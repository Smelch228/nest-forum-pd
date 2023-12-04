import { Module } from '@nestjs/common';
import { VotingService } from './voting.service';
import { VotingController } from './voting.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [VotingService],
  controllers: [VotingController],
  providers: [VotingService],
})
export class VotingModule {}
