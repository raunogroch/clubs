import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClubsModule } from './clubs/clubs.module';
import { SportsModule } from './sports/sports.module';
import { GroupsModule } from './clubs/groups/groups.module';
import { PaymentsModule } from './payments/payments.module';
import { HttpModule } from './common/http/http.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
      }),
    }),
    HttpModule,
    AuthModule,
    UsersModule,
    ClubsModule,
    SportsModule,
    GroupsModule,
    PaymentsModule,
    AdminModule,
  ],
})
export class AppModule {}
