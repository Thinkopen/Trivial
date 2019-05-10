import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Question } from './question.entity';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity({ name: 'answers' })
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  @ApiModelProperty({ format: 'uuid' })
  id: string;

  @Column()
  @ApiModelProperty()
  text: string;

  @Column({ default: false })
  @ApiModelProperty()
  correct: boolean;

  @CreateDateColumn()
  @ApiModelProperty({ type: 'string', format: 'date' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiModelProperty({ type: 'string', format: 'date' })
  updatedAt: Date;

  @ManyToOne(type => Question, question => question.answers)
  question: Question;
}
