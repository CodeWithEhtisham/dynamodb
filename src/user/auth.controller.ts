// auth.controller.ts
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() userDto: UserDto) {
    const user = Object.assign(new User(), userDto);
    await this.userService.create(user);
    return user;
  }

  @Post('signin')
  async signin(@Body() userDto: UserDto) {
    const user = await this.userService.validate(userDto.email, userDto.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const { accessToken } = await this.userService.login(user);
    return { user, accessToken };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() req) {
    const email = req.user.email;
    const user = await this.userService.me(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
