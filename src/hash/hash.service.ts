import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hashBcrypt(toHash: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(toHash, saltOrRounds);

    return hash;
  }

  async compareBcrypt(toCompare: string, hash: string) {
    return await bcrypt.compare(toCompare, hash);
  }
}
