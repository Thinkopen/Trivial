import { ApiModelProperty } from '@nestjs/swagger';

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiModelProperty({ format: 'uuid' })
  id: string;

  @Column()
  @ApiModelProperty()
  name: string;

  @Column()
  @ApiModelProperty({ format: 'email' })
  email: string;

  @Column()
  @ApiModelProperty({ format: 'url' })
  picture: string;

  @Column({ default: false })
  @ApiModelProperty({ default: false })
  admin: boolean;

  @CreateDateColumn()
  @ApiModelProperty({ type: 'string', format: 'date' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiModelProperty({ type: 'string', format: 'date' })
  updatedAt: Date;
}
