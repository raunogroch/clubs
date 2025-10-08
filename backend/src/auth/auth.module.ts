import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { RevokedTokensService } from './revoked-tokens.service';
import { RevokedToken, RevokedTokenSchema } from './schemas/revoked-token.schema';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    MongooseModule.forFeature([{ name: RevokedToken.name, schema: RevokedTokenSchema }]),
  ],
  providers: [AuthService, JwtStrategy, RevokedTokensService],
  exports: [AuthService, RevokedTokensService],
  controllers: [AuthController],
})
export class AuthModule {}
