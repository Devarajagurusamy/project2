import { Controller, Post, Body, UseGuards, Request, Get, Res, Req, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';


const client = new OAuth2Client("20961636685-ef7b6atj562vtj8uunbuchppidd2q3u6.apps.googleusercontent.com");

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // Google Authentication
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.log('Google Auth------');
    // Redirects to Google OAuth
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    console.log('Google Auth Success:', req.user);

    if (!req.user) {
      throw new HttpException('Google authentication failed', HttpStatus.UNAUTHORIZED);
    }

    const authResponse = await this.authService.validateGoogleUser(req.user);

    // Set token as an HTTP-only cookie
    res.cookie('jwt', authResponse.token, { httpOnly: true, secure: true, maxAge: 3600000 });

  }

  @Post('google')
  async googleAuthToken(@Body('token') token: string) {
    try {

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "20961636685-ef7b6atj562vtj8uunbuchppidd2q3u6.apps.googleusercontent.com",
      });

      const payload = ticket.getPayload();



      const data = await this.authService.validateGoogleUser({
        name: payload.name,
        email: payload.email,
        picture: payload.picture
      });
      return data;

    } catch (error) {
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
  getProfile(@Request() req) {
    return { message: `Welcome, ${req.user.name}` };
  }
}
