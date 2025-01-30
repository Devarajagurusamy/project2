import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  // Fetch all users
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }



  // Fetch a user by ID
  async findById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id).exec();
  }

  // Create a new user with hashed password
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,  // Store the hashed password
    });
    return createdUser.save();
  }

  // Update an existing user with optional password hashing
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // If password is provided in the update, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true, runValidators: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  // Delete a user by ID
  async delete(id: string): Promise<User | null> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

 async findByUsername(name: string): Promise<User | null> {
  const user = await this.userModel.findOne({ name: name });
  // console.log("USER SERVICE", user);  // Log the actual result (after resolving the promise)
  return user;
}

}
