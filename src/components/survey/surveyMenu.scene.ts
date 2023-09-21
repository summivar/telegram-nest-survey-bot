import { Action, Command, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from '../../context.interface';
import { surveyMenuButtons } from './surveyMenu.buttons';
import { SurveyService } from './survey.service';

@Scene('surveyMenuScene')
export class SurveyMenuScene {

  constructor(private surveyService: SurveyService) {
  }

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    const survey = await this.surveyService.findOneByUniqueId(ctx.session.currentSurveyId);
    const text = `Name: ${survey?.name}\nQuestion: ${survey?.question}\nUniqueId: ${survey?.uniqueId}\nAnswers: ${survey?.answers.length}\n\nSelect a menu item: `;
    try {
      await ctx.editMessageText(text, surveyMenuButtons(survey));
    } catch (e) {
      await ctx.reply(text, surveyMenuButtons(survey));
    }
  }

  @Action('addNewAnswerScene')
  async addNewAnswerScene(@Ctx() ctx: Context) {
    await ctx.scene.enter('addNewAnswerSurveyScene');
  }

  @Action('deleteLastSurveyScene')
  async deleteLastSurveyScene(@Ctx() ctx: Context) {
    const survey = await this.surveyService.findOneByUniqueId(ctx.session.currentSurveyId);
    if (!survey.answers.length) {
      await ctx.reply('No answers to delete in current survey');
      await ctx.scene.reenter();
      return;
    }
    const isDeleted = await this.surveyService.deleteLastAnswerFromSurvey(ctx.session.currentSurveyId);
    if (!isDeleted) {
      await ctx.reply('Something go wrong, did not delete');
      return;
    }
    const message = await ctx.reply('Last answer was deleted');
    setTimeout(async () => {
      await ctx.telegram.deleteMessage(ctx.from.id, message.message_id);
      await ctx.scene.reenter();
    }, 500);
  }

  @Action('updateQuestionScene')
  async updateQuestionScene(@Ctx() ctx: Context) {
    await ctx.scene.enter('updateQuestionSurveyScene');
  }

  @Action('updateNameScene')
  async updateNameScene(@Ctx() ctx: Context) {
    await ctx.scene.enter('updateNameSurveyScene');
  }

  @Action('getStatisticsScene')
  async getStatisticsScene(@Ctx() ctx: Context) {
    await ctx.scene.enter('getStatisticsSurveyScene');
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