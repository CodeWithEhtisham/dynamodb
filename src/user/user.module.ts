// user.module.ts
// user.module.ts
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { DynamoDB } from 'aws-sdk';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from './user.entity';
import { JWT_SECRET } from '../constants';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    JwtStrategy,
    {
      provide: DynamoDB,
      useFactory: () => {
        return new DynamoDB({ region: 'us-east-1' });
      },
    },
    {
      provide: DataMapper,
      useFactory: (dynamoDB: DynamoDB) => {
        return new DataMapper({ client: dynamoDB });
      },
      inject: [DynamoDB],
    },
    {
      provide: JwtService,
      useFactory: () => {
        return new JwtService({
          secret: JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        });
      },
    },
  ],
  exports: [UserService],
})
export class UserModule {}

