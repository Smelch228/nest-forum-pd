import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { VotingService } from './voting.service';
import { VoteDto } from './dto/vote.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../common/decorators/user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Voting')
@Controller('voting')
@UseGuards(AuthGuard)
export class VotingController {
  constructor(private readonly votingService: VotingService) {}

  @Post()
  vote(@Body() voteDto: VoteDto, @User() user) {
    return this.votingService.vote(voteDto, +user.id);
  }

  @Delete()
  removeVote(@Body() voteDto: VoteDto, @User() user) {
    return this.votingService.removeVote(
      +user.id,
      voteDto.votableId,
      voteDto.votableType,
    );
  }
}
