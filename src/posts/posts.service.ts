import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel('Post') private readonly postModel: Model<Post>,
    ) {}

 // Fetch all posts with pagination
    async findAllWithPagination(skip: number, limit: number): Promise<[Post[], number]> {
        const posts = await this.postModel.find().skip(skip).limit(limit).exec();
        const total = await this.postModel.countDocuments().exec();
        return [posts, total];
    }
    
    // Fetch all posts
    async findAll(): Promise<Post[]> {
        return this.postModel.find().exec();
    }

    // Fetch a post by ID
    async findById(id: string): Promise<Post | undefined> {
        return this.postModel.findById(id).exec();
    }

    

    // // Fetch a post by author name
    // async findByAuthor(author: string): Promise<Post | null> {
    //     return this.postModel.findOne({ author }).exec();
    // }

    // Create a new post
    async create(createPostDto: CreatePostDto): Promise<Post> {
        console.log("createPostDto-----------")
        const createdPost = new this.postModel(createPostDto);
        return createdPost.save();
    }

    // Update an existing post
    async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
        const updatedPost = await this.postModel
            .findByIdAndUpdate(id, updatePostDto, { new: true, runValidators: true })
            .exec();

        if (!updatedPost) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return updatedPost;
    }

    // Delete a post by ID
    async delete(id: string): Promise<Post | null> {
        const deletedPost = await this.postModel.findByIdAndDelete(id).exec();
        if (!deletedPost) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return deletedPost;
    }

    async findByTitle(title: string): Promise<Post | null> { 
        return this.postModel.findOne({ title }).exec();
    }
}
