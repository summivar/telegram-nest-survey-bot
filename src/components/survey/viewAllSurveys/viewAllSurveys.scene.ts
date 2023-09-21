import { Command, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from '../../../context.interface';
import { SurveyService } from '../survey.service';
import { viewAllSurveysButtons } from './viewAllSurveys.buttons';

@Scene('viewAllSurveysScene')
export class ViewAllSurveysScene {

  constructor(private surveyService: SurveyService) {
  }

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    const surveys = await this.surveyService.getAll();
    if (!surveys.length) {
      try {
        await ctx.editMessageText('No surveys', viewAllSurveysButtons());
      } catch (e) {
        await ctx.reply('No surveys', viewAllSurveysButtons());
      }
      return;
    }
    let text: string = 'Surveys:\n';
    surveys.forEach((survey, index) => {
      text += `${index + 1}. ${survey.name} | ${survey.uniqueId}\n`;
    });
    try {
      await ctx.editMessageText(text, viewAllSurveysButtons())
    } catch (e) {
      await ctx.reply(text, viewAllSurveysButtons());
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