import { Controller, Post, Body, UseGuards, Request, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from "@nestjs/passport"
import { Req } from '@nestjs/common';
import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,

  ) { }
  
 @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {
    // This route triggers Google Login
  }

  @Get("google/redirect")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { user } = req;
    const authResponse = await this.authService.validateGoogleUser(user);

    // Set token as a cookie
    res.cookie("jwt", authResponse.token, { httpOnly: true });
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`); // Redirect to frontend after login
  }

  @Post("google")
  async googleAuthToken(@Body("token") token: string) {
    try {
      const googleUser = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
      // console.log("-------------------------------",googleUser.data.name);
      return this.authService.validateGoogleUser(googleUser.data);
    } catch (error) {
      return { message: "Invalid Google Token", error: error.response.data };
    }
  }

  @Post('login')
  async login(@Body() body: { name: string; password: string }, @Res() res: Response) {
    const user = await this.authService.validateUser(body.name, body.password);
    if (!user) {

    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = await this.authService.generateToken(user);
  res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
  res.json({ message: 'Logged in successfully' });
}


   @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.send('Logged out and cookie cleared');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // console.log(req);
    return { message: `Welcome, ${req.user.name}` };
  }
}
