import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private readonly mapper: DataMapper;

  constructor(
    private readonly dynamoDB: DynamoDB,
    private readonly jwtService: JwtService,
  ) {
    this.mapper = new DataMapper({ client: dynamoDB });
  }

  async create(user: User): Promise<User> {
    return await this.mapper.put(user);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.mapper.get(Object.assign(new User(), { email }));
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<{ accessToken: string }> {
    const payload = { email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async me(email: string): Promise<User> {
    return await this.findByEmail(email);
  }
}
