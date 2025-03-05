import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class AuthService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
  private readonly usersService: UsersService,
    private readonly jwtService: JwtService,) { }
  
  
  async validateGoogleUser({name, email, picture }: { name: string,email: string,picture: string }): Promise<any> {

    const userExists = await this.userModel.findOne({ email: email });

    if (!userExists) {
      const createUser = new this.userModel({ name, email, picture });
      
      await createUser.save();
      return createUser;
    } else {
      return userExists;
    }

  }

  async validateOrCreateUser(user: { email: string; name: string; picture: string }) {
    let existingUser = await this.userModel.findOne({ email: user.email });

    if (!existingUser) {
      existingUser = await this.userModel.create(user);
    }

    return existingUser;
  }

  // Validate user credentials
  async validateUser(name: string, password: string): Promise<any> {
    
    const user = await this.usersService.findByUsername(name);
    

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user; // Exclude password from the returned user object
      return result;
    }
    throw new UnauthorizedException('Invalid data service');
  }

  async generateToken(user: any) {
    const payload = { name: user._doc.name, sub: user._doc._id };
    return this.jwtService.sign(payload); // Sign the JWT token
  }

  
}
