import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async list(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  async upsertByEmail(email: string, userRaw: Partial<User>): Promise<User> {
    const foundUser = (await this.findByEmail(email)) || new User();

    Object.keys(userRaw)
      .forEach((field) => {
        foundUser[field] = userRaw[field];
      });

    return this.userRepository.save(foundUser);
  }
}
