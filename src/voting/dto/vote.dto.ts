import { VotableType } from '../../common/enums/votable-type.enum';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class VoteDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  votableId: number;

  @IsNotEmpty()
  @IsString()
  votableType: VotableType;

  @IsNotEmpty()
  @IsBoolean()
  upvote: boolean;
}
