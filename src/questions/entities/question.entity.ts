import { ApiModelProperty } from '@nestjs/swagger';

import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Answer } from './answer.entity';

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn('uuid')
  @ApiModelProperty({ format: 'uuid' })
  id: string;

  @Column()
  @ApiModelProperty()
  text: string;

  @CreateDateColumn()
  @ApiModelProperty({ type: 'string', format: 'date' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiModelProperty({ type: 'string', format: 'date' })
  updatedAt: Date;

  @OneToMany(type => Answer, answer => answer.question, { cascade: true })
  @ApiModelProperty({ type: Answer, isArray: true })
  answers: Answer[];
}
