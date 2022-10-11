import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbService } from '../db/db.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtInterface } from './interfaces/jwt.interface';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserInterface> {
    const { password } = createUserDto;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    return this.dbService.createUser({ ...createUserDto, password: hash });
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