import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyEntity } from './survey.entity';
import { SurveyMenuUpdate } from './surveyMenu.update';
import { SurveyMenuScene } from './surveyMenu.scene';
import { AddNewAnswerSurveyScene } from './addNewAnswerSurvey/addNewAnswerSurvey.scene';
import { CreateSurveyScene } from './createSurvey/createSurvey.scene';
import { DeleteSurveyScene } from './deleteSurvey/deleteSurvey.scene';
import { GetStatisticsSurveyScene } from './getStatisticsSurvey/getStatisticsSurvey.scene';
import { UpdateQuestionSurveyScene } from './updateQuestionSurvey/updateQuestionSurvey.scene';
import { ViewAllSurveysScene } from './viewAllSurveys/viewAllSurveys.scene';
import { SurveyService } from './survey.service';
import { UpdateNameSurveyScene } from './updateNameSurvey/updateNameSurvey.scene';
import { SharedModule } from '../../shared/shared.module';
import { GetStatisticsSurveyService } from './getStatisticsSurvey/getStatisticsSurvey.service';
import { MostPopularAnswersScene } from './getStatisticsSurvey/mostPopularAnswers/mostPopularAnswers.scene';
import { ImageOfAnswersScene } from './getStatisticsSurvey/imageOfAnswers/imageOfAnswers.scene';
import { AverageAnswersScene } from './getStatisticsSurvey/averageAnswers/averageAnswers.scene';

@Module({
  imports: [
    TypeOrmModule.forFeature([SurveyEntity]),
    SharedModule
  ],
  providers: [
    // services
    SurveyService,
    GetStatisticsSurveyService,
    // update
    SurveyMenuUpdate,
    // all scenes
    SurveyMenuScene,
    AddNewAnswerSurveyScene,
    CreateSurveyScene,
    DeleteSurveyScene,
    GetStatisticsSurveyScene,
    UpdateQuestionSurveyScene,
    UpdateNameSurveyScene,
    ViewAllSurveysScene,
    MostPopularAnswersScene,
    ImageOfAnswersScene,
    AverageAnswersScene,
  ],
  exports: [
    // services
    SurveyService,
    GetStatisticsSurveyService,
    // update
    SurveyMenuUpdate,
    // all scenes
    SurveyMenuScene,
    AddNewAnswerSurveyScene,
    CreateSurveyScene,
    DeleteSurveyScene,
    GetStatisticsSurveyScene,
    UpdateQuestionSurveyScene,
    UpdateNameSurveyScene,
    ViewAllSurveysScene,
    MostPopularAnswersScene,
    ImageOfAnswersScene,
    AverageAnswersScene,
  ]
})
export class SurveyModule {}