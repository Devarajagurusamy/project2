import { Controller, Post, Body, UseGuards, Request, Get, Res, Req, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { OAuth2Client } from 'google-auth-library';


const client = new OAuth2Client("20961636685-ef7b6atj562vtj8uunbuchppidd2q3u6.apps.googleusercontent.com");

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('google')
  async googleAuthToken(@Body('token') token: string, @Res() res: Response) {
    try {
      // Verify Google token
      
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "20961636685-ef7b6atj562vtj8uunbuchppidd2q3u6.apps.googleusercontent.com",
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new HttpException('Invalid Google Token', HttpStatus.UNAUTHORIZED);
      }

      // Validate or register user in database
      const user = await this.authService.validateGoogleUser({
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });

      console.log("user------------->>",user)

      // Generate JWT token
      const jwtToken = await this.authService.generateToken(user);

      // Set HTTP-only cookie
      res.cookie('auth_token', jwtToken, {
        httpOnly: true,
        secure: false,
      });

      return res.json(user);
      
    } catch (error) {
      console.error("Google Auth Error:", error);
      throw new HttpException('Invalid Google Token', HttpStatus.UNAUTHORIZED);
    }
  }

  // Standard Login with JWT
  @Post('login')
  async login(@Body() body: { name: string; password: string }, @Res() res: Response) {
    const user = await this.authService.validateUser(body.name, body.password);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.authService.generateToken(user);
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

    return res.json({ message: 'Logged in successfully', token });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.json({ message: 'Logged out successfully' });
  }

   @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
     const user = await this.usersService.findById(req.user.id); // Fetch from DB
     console.log("user-----",user)
    if (!user) {
      return { message: 'User not found' };
    }
    return {
      name: user.name,
      email: user.email,
    };
  }
}




