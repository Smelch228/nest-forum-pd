import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../common/decorators/user.decorator';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { CommentService } from '../comment/comment.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PostQueryDto } from './dto/post-query.dto';

@ApiTags('Posts')
@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}

  @Get('/search')
  searchPosts(
    @Query('title') title: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.postService.findPostsByTitleContains(title, pageOptionsDto);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiSecurity('session-token')
  create(@Body() createPostDto: CreatePostDto, @User() user) {
    return this.postService.create(createPostDto, +user.id);
  }

  @Get(':id/comments')
  getCommentsByPostId(
    @Param('id', ParseIntPipe) postId: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.commentService.getCommentsByPostId(postId, pageOptionsDto);
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PostQueryDto) {
    return this.postService.findAll(
      pageOptionsDto,
      pageOptionsDto.categoryId ? +pageOptionsDto.categoryId : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiSecurity('session-token')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User() user,
  ) {
    const post = await this.postService.findOne(+id);
    if (post.userId !== +user.id) {
      throw new ForbiddenException();
    }
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiSecurity('session-token')
  remove(@Param('id') id: string, @User() user) {
    return this.postService.remove(+id, user.id);
  }
}
