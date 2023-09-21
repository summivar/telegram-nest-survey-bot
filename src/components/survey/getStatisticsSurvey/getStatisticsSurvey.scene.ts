import { Action, Command, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from '../../../context.interface';
import { getStatisticsSurveyButtons } from './getStatisticsSurvey.buttons';
import { SurveyService } from '../survey.service';

@Scene('getStatisticsSurveyScene')
export class GetStatisticsSurveyScene {
  constructor(private surveyService: SurveyService) {
  }
  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    const survey = await this.surveyService.findOneByUniqueId(ctx.session.currentSurveyId);
    if (!survey.answers.length) {
      await ctx.scene.enter('surveyMenuScene');
    }
    try {
      await ctx.editMessageText('Select a menu item: ', getStatisticsSurveyButtons());
    } catch (e) {
      await ctx.reply('Select a menu item: ', getStatisticsSurveyButtons());
    }
  }

  @Action('mostPopularAnswers')
  async mostPopularAnswers(@Ctx() ctx: Context) {
    await ctx.scene.enter('mostPopularAnswersScene');
  }

  @Action('averageAnswers')
  async averageAnswers(@Ctx() ctx: Context) {
    await ctx.scene.enter('averageAnswersScene');
  }

  @Action('imageOfAnswers')
  async imageOfAnswers(@Ctx() ctx: Context) {
    await ctx.scene.enter('imageOfAnswersScene');
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