import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  async hashBcrypt(toHash: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(toHash, saltOrRounds);
  }

  async compareBcrypt(toCompare: string, hash: string) {
    return await bcrypt.compare(toCompare, hash);
  }

  async generateUUID() {
    return randomUUID();
  }
}
