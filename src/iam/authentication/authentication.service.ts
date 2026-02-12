import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async signup(sinUpDto: SignUpDto) {
    try {
      const user = new User();
      user.email = sinUpDto.email;
      user.password = await this.hashingService.hash(sinUpDto.password);
      await this.usersRepository.save(user);
    } catch (error) {
      const pgUniqueViolationErrorCode = '23505';
      if (error.code === pgUniqueViolationErrorCode) {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  async signin(sinUpDto: SignUpDto) {
    const user = await this.usersRepository.findOne({
      where: { email: sinUpDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.hashingService.compare(
      sinUpDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    return { message: 'Sign in successful' };
  }
}
