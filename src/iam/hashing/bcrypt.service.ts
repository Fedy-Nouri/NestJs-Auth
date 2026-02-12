import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { hash, compare } from 'bcrypt';

const SALT_Rounds = 10;

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string | Buffer): Promise<string> {
    return hash(data, SALT_Rounds);
  }

  async compare(data: string | Buffer, hashedData: string): Promise<boolean> {
    return compare(data, hashedData);
  }
}
