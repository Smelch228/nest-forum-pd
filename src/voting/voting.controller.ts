import { Body, Controller, Delete, Post } from '@nestjs/common';
import { VotingService } from './voting.service';
import { VoteDto } from './dto/vote.dto';

@Controller('voting')
export class VotingController {
  constructor(private readonly votingService: VotingService) {}

  @Post()
  vote(@Body() voteDto: VoteDto) {
    return this.votingService.vote(
      voteDto.userId,
      voteDto.votableId,
      voteDto.votableType,
      voteDto.upvote,
    );
  }

  @Delete()
  removeVote(@Body() voteDto: VoteDto) {
    return this.votingService.removeVote(
      voteDto.userId,
      voteDto.votableId,
      voteDto.votableType,
    );
  }
}
