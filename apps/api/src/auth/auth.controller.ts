import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthCredentialsDto } from '@auth/dto/auth-credentials.dto';
import {
  EmailSignInResponseExample,
  studentEmailSignUpResponseExample,
} from '@auth/responses/email-auth-response-examples';
import {
  IUserAdditionalInfo,
  IUserSignIn,
} from '@auth/interface/auth.interface';
import { IUserSignInResponse, IUserSignUpResponse } from '@auth/auth.types';
import { ValidatePasswordDto } from '@auth/dto/validate-password.dto';
import { IsAuthenticatedUserGuard } from '@common/guards/is-authenticated-user.guard';
import { ValidateEmailDto } from '@auth/dto/validate-email.dto';
import { IsAdminGuard } from '@common/guards/is-admin.guard';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('student/email/signup')
  @ApiOperation({ summary: 'Sign up with email and password' })
  @ApiBody({ type: AuthCredentialsDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully signed up.',
    content: {
      'application/json': {
        example: studentEmailSignUpResponseExample,
      },
    },
  })
  public async studentEmailSignup(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<IUserSignUpResponse> {
    const userAddionalInfo: IUserAdditionalInfo = {
      is_course_instructor: false,
    };
    return await this._authService.emailSignup(
      authCredentialsDto,
      userAddionalInfo,
    );
  }

  @Post('resend-confirmation-link')
  @ApiOperation({ summary: 'Resend confirmation link' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The confirmation link has been successfully sent.',
  })
  public async resendConfirmationLink(
    @Body() email: ValidateEmailDto,
  ): Promise<{ message: string }> {
    await this._authService.resendConfirmationLink(email.email);
    return {
      message: 'Confirmation Link Sent Successfully',
    };
  }

  @Post('email/login')
  @ApiOperation({ summary: 'Login with email/username and password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully logged in.',
    content: {
      'application/json': {
        example: EmailSignInResponseExample,
      },
    },
  })
  public async emailLogin(
    @Body() authCredentials: IUserSignIn,
  ): Promise<IUserSignInResponse> {
    return await this._authService.emailLogin(authCredentials);
  }

  @Patch('email/change-password')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user password has been successfully changed.',
  })
  @UseGuards(IsAuthenticatedUserGuard)
  @ApiBearerAuth()
  public async emailChangePassword(
    @Body() password: ValidatePasswordDto,
  ): Promise<{ message: string }> {
    await this._authService.emailChangePassword(password);
    return {
      message: 'Pasword Changed Successfully',
    };
  }

  @Post('email/reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'A Password Reset Link has been Successfully sent to your email',
  })
  public async emailResetPassword(
    @Body() email: ValidateEmailDto,
  ): Promise<{ message: string }> {
    await this._authService.emailResetPassword(email);
    return {
      message: 'A Password Reset Link has been Successfully sent to your email',
    };
  }

  @Post('signout')
  @ApiOperation({ summary: 'Sign out' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully signed out.',
  })
  @UseGuards(IsAuthenticatedUserGuard)
  @ApiBearerAuth()
  public async signOut(): Promise<{ message: string }> {
    await this._authService.signOut();
    return {
      message: 'Sign out Successful',
    };
  }

  @Post('admin/email/signup')
  @ApiOperation({ summary: 'Sign up with email and password' })
  @ApiBody({ type: AuthCredentialsDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully signed up.',
    content: {
      'application/json': {
        example: studentEmailSignUpResponseExample,
      },
    },
  })
  public async adminEmailSignup(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<IUserSignUpResponse> {
    const userAddionalInfo: IUserAdditionalInfo = {
      is_admin: 'service_role',
      is_course_instructor: false,
    };
    return await this._authService.emailSignup(
      authCredentialsDto,
      userAddionalInfo,
    );
  }

  @Post('admin/instructor/email-invite')
  @ApiOperation({ summary: 'Invite instructor by email' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Instructor Invite Sent Successfully',
  })
  @UseGuards(IsAdminGuard)
  @ApiBearerAuth()
  public async instructorSendEmailInvite(
    @Body() email: ValidateEmailDto,
  ): Promise<{ message: string }> {
    await this._authService.instructorSendEmailInvite(email.email);
    return {
      message: 'Instructor Invite Sent Successfully',
    };
  }
}
