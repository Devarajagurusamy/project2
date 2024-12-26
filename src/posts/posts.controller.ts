import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
    UsePipes,
    ValidationPipe,
    BadRequestException,
    Delete,
    NotFoundException,
    UseGuards,
    HttpException,
    Request,
    HttpStatus,
    Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { isValidObjectId } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }
    

    // Fetch all posts with pagination
    @Get()
    async findAll(@Query('page') page: string, @Query('limit') limit: string) {
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 5;

        if (pageNumber < 1 || limitNumber < 1) {
            throw new BadRequestException('Page and limit must be greater than 0');
        }

        const skip = (pageNumber - 1) * limitNumber;
        const [posts, total] = await this.postsService.findAllWithPagination(skip, limitNumber);

        return {
            data: posts,
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        };
    }

    // // Fetch all posts
    // @Get()
    // async findAll() {
    //     return await this.postsService.findAll();
    // }

    // Fetch single posts by id 
    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.postsService.findById(id);
    }

    // Create a new post
    @UseGuards(JwtAuthGuard)

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto);
    }

    // Update an existing post
    @UseGuards(JwtAuthGuard)

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
        @Request() req: any
    ) {
    const post = await this.postsService.findById(id);

        if (!isValidObjectId(id)) {
            throw new BadRequestException(`Invalid ID format: ${id}`);
        }
        if (post.author !== req.user.name) {
      throw new HttpException('Forbidden: You do not own this post', HttpStatus.FORBIDDEN);
    }
        return this.postsService.update(id, updatePostDto);
    }

    // Delete a post
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    const post = await this.postsService.findById(id);
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    if (post.author !== req.user.name) {
      throw new HttpException('Forbidden: You do not own this post', HttpStatus.FORBIDDEN);
    }
    return this.postsService.delete(id);
    }
    
    


    
}
