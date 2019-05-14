import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { UsersService } from './users.service';

import { User } from './entities/user.entity';

@ApiUseTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ title: 'Users list', description: 'Retrieves the complete list of users' })
  @ApiOkResponse({ description: 'All the users', isArray: true, type: User })
  async list(): Promise<User[]> {
    return this.usersService.list();
  }
}
