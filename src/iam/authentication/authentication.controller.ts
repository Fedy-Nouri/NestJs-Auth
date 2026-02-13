import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthType } from './enums/auth-type.enum';
import { Auth } from './decorators/auth.decorator';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authenticationService.signup(signUpDto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    return this.authenticationService.signin(signInDto);
  }
}
