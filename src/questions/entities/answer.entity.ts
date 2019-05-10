import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Question } from './question.entity';

@Entity({ name: 'answers' })
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  correct: boolean;

  @ManyToOne(type => Question, question => question.answers)
  question: Question;
}
