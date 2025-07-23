import { Module } from '@nestjs/common';
import { GoogleAuthService } from './auth/google-auth.service';
import { GoogleService } from './google.service';

@Module({
  providers: [GoogleService, GoogleAuthService],
  exports: [GoogleService, GoogleAuthService],
})
export class GoogleModule {}
