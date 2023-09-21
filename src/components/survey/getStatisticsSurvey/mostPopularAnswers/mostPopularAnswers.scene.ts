import { Command, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from '../../../../context.interface';
import { GetStatisticsSurveyService } from '../getStatisticsSurvey.service';
import { SurveyService } from '../../survey.service';
import { mostPopularAnswersButtons } from './mostPopularAnswers.buttons';

@Scene('mostPopularAnswersScene')
export class MostPopularAnswersScene {
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
    const text = this.getStatisticSurveyService.getPopularAnswersStats(survey);

    try {
      await ctx.editMessageText(text, mostPopularAnswersButtons());
    } catch (e) {
      await ctx.reply(text, mostPopularAnswersButtons());
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