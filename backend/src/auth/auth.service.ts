import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const isValid = await this.validateCredentials(email, password);
    
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email, sub: 'user-id-stub' };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: 'user-id-stub',
        email,
        name: 'Stub User'
      }
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    return {
      message: 'User registered successfully (stub)',
      user: {
        email,
        name
      }
    };
  }

  private async validateCredentials(email: string, password: string): Promise<boolean> {
    return email.includes('@') && password.length >= 6;
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
