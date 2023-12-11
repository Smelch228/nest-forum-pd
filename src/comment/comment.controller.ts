import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../common/decorators/user.decorator';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiSecurity('session-token')
  create(@Body() createCommentDto: CreateCommentDto, @User() user) {
    return this.commentService.create(createCommentDto, +user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiSecurity('session-token')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiSecurity('session-token')
  async remove(@Param('id') id: string, @User() user) {
    const comment = await this.commentService.findOne(+id);
    if (comment && comment.userId === +user.id) {
      return this.commentService.remove(+id);
    } else {
      throw new ForbiddenException("You can't delete this comment!");
    }
  }
}
