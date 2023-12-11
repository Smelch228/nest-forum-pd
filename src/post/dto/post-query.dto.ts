import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

export class PostQueryDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  categoryId?: string;
}
