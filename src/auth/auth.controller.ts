import { Controller, Post, Body, UseGuards, Request, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,

  ) {}

  @Post('login')
  async login(@Body() body: { name: string; password: string }, @Res() res: Response) {
    // console.log("--------------------------",body.name,body.password);
    const user = await this.authService.validateUser(body.name, body.password);
    // console.log(user)
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
