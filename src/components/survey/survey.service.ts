import { Injectable } from '@nestjs/common';
import { Answer, AnswerLevel, AnswerName, SurveyEntity } from './survey.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SurveyService {
  constructor(@InjectRepository(SurveyEntity) private surveyRepository: Repository<SurveyEntity>) {
  }

  async findOneByUniqueId(uniqueId: string): Promise<SurveyEntity> {
    return this.surveyRepository.findOneBy({uniqueId: uniqueId});
  }

  async findOneByUniqueIdAndDelete(uniqueId: string): Promise<boolean> {
    const survey = await this.findOneByUniqueId(uniqueId);
    if (!survey) {
      return false;
    }
    await this.surveyRepository.remove(survey);
    return true;
  }

  async getAll(): Promise<SurveyEntity[]> {
    return this.surveyRepository.find();
  }

  async deleteLastAnswerFromSurvey(uniqueId: string): Promise<boolean> {
    const survey = await this.findOneByUniqueId(uniqueId);
    if (!survey || !survey.answers.length) {
      return false;
    }

    survey.answers.pop();

    await this.surveyRepository.save(survey);

    return true;
  }

  async findOneByUniqueIdAndUpdateName(uniqueId: string, newName: string): Promise<boolean> {
    const survey = await this.findOneByUniqueId(uniqueId);
    if (!survey) {
      return false;
    }
    survey.name = newName;
    await this.surveyRepository.save(survey);
    return true;
  }

  async findOneByUniqueIdAndUpdateQuestion(uniqueId: string, newQuestion: string): Promise<boolean> {
    const survey = await this.findOneByUniqueId(uniqueId);
    if (!survey) {
      return false;
    }
    survey.question = newQuestion;
    await this.surveyRepository.save(survey);
    return true;
  }

  async addAnswerToSurvey(uniqueId: string, name: AnswerName, answerUser: string, answerLevel: AnswerLevel): Promise<boolean> {
    const survey = await this.findOneByUniqueId(uniqueId);
    if (!survey) {
      return false;
    }
    const answer: Answer = {
      name: name,
      answer: answerUser,
      answerLevel: answerLevel
    };
    survey.answers.push(answer);
    await this.surveyRepository.save(survey);
    return true;
  }

  async addNewSurvey(name: string, question: string, creatorId: number): Promise<SurveyEntity> {
    const uniqueId: string = await this.generateUniqueId();

    const survey = this.surveyRepository.create({
      name: name,
      question: question,
      uniqueId: uniqueId,
      createdBy: creatorId,
      answers: []
    });
    await this.surveyRepository.save(survey);

    return survey;
  }

  private async generateUniqueId(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueId = '#';

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uniqueId += characters.charAt(randomIndex);
    }

    if (await this.findOneByUniqueId(uniqueId)) {
      return this.generateUniqueId();
    }

    return uniqueId;
  }
}