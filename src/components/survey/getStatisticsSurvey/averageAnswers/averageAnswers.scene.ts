import { Command, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from '../../../../context.interface';
import { SurveyService } from '../../survey.service';
import { GetStatisticsSurveyService } from '../getStatisticsSurvey.service';
import { averageAnswersButtons } from './averageAnswers.buttons';

@Scene('averageAnswersScene')
export class AverageAnswersScene {
  constructor(
    private surveyService: SurveyService,
    private getStatisticSurveyService: GetStatisticsSurveyService
  ) {
  }

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    const survey = await this.surveyService.findOneByUniqueId(ctx.session.currentSurveyId);

    if (!survey) {
      try {
        await ctx.editMessageText('Survey not found, go to survey menu...');
        await ctx.scene.enter('surveyMenuScene');
      } catch (e) {
        await ctx.reply('Survey not found, go to survey menu...');
        await ctx.scene.enter('surveyMenuScene');
      }
      return;
    }

    const averageAnswerLevel = this.getStatisticSurveyService.getAverageLevel(survey);
    const text = `Total number of answers: ${survey.answers.length}\n\nAverage answer's level: ${averageAnswerLevel}`;

    try {
      await ctx.editMessageText(text, averageAnswersButtons());
    } catch (e) {
      await ctx.reply(text, averageAnswersButtons());
    }
  }

  @Command('reenter')
  async reenter(@Ctx() ctx: Context) {
    await ctx.scene.reenter();
  }

  @Command('menu')
  async menu(@Ctx() ctx: Context) {
    await ctx.scene.enter('menuScene');
  }
}