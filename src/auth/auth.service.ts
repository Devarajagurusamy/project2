import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }
  
  async validateGoogleUser(user: any) {
    const payload = { email: user.email, sub: user.googleId };
    const token = this.jwtService.sign(payload);
    return { user, token };
  }

  // Validate user credentials
  async validateUser(name: string, password: string): Promise<any> {
    // console.log("AUTH SERVICE---------------", await this.usersService.findByUsername(name))
    // console.log("NAME PASSWORD---------------",name,password)
    
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

  // Generate a JWT token
  // async login(user: any) {
  //   const payload = { name: user._doc.name, sub: user._doc._id }; // Payload to encode in JWT
  //   //-------------------------------------------------------------------------------------->>>>doubt
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
}
