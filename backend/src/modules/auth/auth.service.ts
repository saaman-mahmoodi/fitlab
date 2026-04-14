import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: Record<string, unknown>) {
    const userId = user.id as string;
    const userEmail = user.email as string;
    const userRole = user.role as UserRole;
    const userName = user.name as string;

    const payload = { email: userEmail, sub: userId, role: userRole };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: userId,
        email: userEmail,
        name: userName,
        role: userRole,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const user = await this.usersService.create(registerDto);

    if (registerDto.role === UserRole.COACH) {
      return this.login({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    }

    return this.login({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = { email: user.email, sub: user.id, role: user.role };
      const accessToken = this.jwtService.sign(newPayload);
      const refreshToken = this.jwtService.sign(newPayload, {
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
      });

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}