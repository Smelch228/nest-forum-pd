import { Controller } from '@nestjs/common';
import { VotingService } from './voting.service';

@Controller('voting')
export class VotingController {
  constructor(private readonly votingService: VotingService) {}
}
