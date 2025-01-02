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

  // @Post('register')
  // async register(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }
  
  
//   @Post('login')
// async login(@Body() body: { name: string; password: string }, @Res() res: Response) {
//   try {
//     const user = await this.authService.validateUser(body.name, body.password);
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = await this.authService.generateToken(user);

//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 3600000, // 1 hour
//     });

//     return res.status(200).json({ message: 'Logged in successfully' });
//   } catch (error) {
//     console.error('Login error:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }

  
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
