import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DbService } from '../db/db.service';
import { JwtInterface } from './interfaces/jwt.interface';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private dbService: DbService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

  async validate(payload: JwtInterface): Promise<UserInterface> {
    const user = await this.dbService.getUserById(payload.publicId);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
