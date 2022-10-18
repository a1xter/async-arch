import { Injectable, InternalServerErrorException, UnauthorizedException}  from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RecordMetadata } from 'kafkajs';
import { UserMessageType } from '@async-arch/types';
import { DbService } from '../db/db.service';
import { ProducerService } from '../kafka/producer.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtInterface } from './interfaces/jwt.interface';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
    private readonly producerService: ProducerService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserInterface> {
    const { password } = createUserDto;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const user = await this.dbService.createUser({ ...createUserDto, password: hash });
    if (!user) throw new InternalServerErrorException()

    const message: UserMessageType = {
      type: 'create',
      payload: user
    }

    const recordMetadata: RecordMetadata[] = await this.producerService.produce({
      topic: 'streaming.users',
      messages: [{value: JSON.stringify(message)}]
    })
    console.log({ recordMetadata });
    if (recordMetadata.length === 0) console.error({error: 'cannot create a message in Kafka'});

    return user;
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { password, email } = signInDto;
    const error = new UnauthorizedException(
      'Please check your login credentials.'
    );

    const user = await this.dbService.getUserByEmail(email);
    if (!user) throw error;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw error;

    const payload: JwtInterface = {
      publicId: user.publicId,
      username: user.username,
      role: user.role
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
