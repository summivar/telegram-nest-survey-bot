import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

export type AnswerName = string | 'unknown name';

export type AnswerLevel = 1 | 2 | 3 | 4 | 5;

export type Answer = {
  name: AnswerName;
  answer: string;
  answerLevel: AnswerLevel;
}

@Entity({name: 'surveys'})
export class SurveyEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  uniqueId: string;

  @Column()
  name: string;

  @Column()
  question: string;

  @Column()
  createdBy: number;

  @Column()
  answers: Answer[];
}