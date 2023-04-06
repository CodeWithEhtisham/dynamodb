// user.entity.ts
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

@table('users')
export class User {
  @hashKey()
  email: string;

  @attribute()
  firstName: string;

  @attribute()
  lastName: string;

  @attribute()
  password: string;
}
