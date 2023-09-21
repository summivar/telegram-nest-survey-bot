import { Action, Command, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from '../../context.interface';
import { menuButtons } from './menu.buttons';
import { SurveyService } from '../survey/survey.service';

@Scene('menuScene')
export class MenuScene {
  constructor(private surveyService: SurveyService) {
  }

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    ctx.session.currentSurveyId = null;
    ctx.session.waitingMode = null;
    ctx.session.tempData = {};
    try {
      await ctx.editMessageText('Select a menu item: ', menuButtons());
    } catch (e) {
      await ctx.reply('Select a menu item: ', menuButtons());
    }
  }

  @Command('reenter')
  async reenter(@Ctx() ctx: Context) {
    await ctx.scene.reenter();
  }

  @Command('menu')
  async menu(@Ctx() ctx: Context) {
    await ctx.scene.reenter();
  }

  @Action('connectToSurvey')
  async connectSurvey(@Ctx() ctx: Context) {
    await ctx.editMessageText('Write survey ID: ');
    ctx.session.waitingMode = 'connectionSurveyId';
  }

  @Action('createSurveyScene')
  async createSurvey(@Ctx() ctx: Context) {
    await ctx.scene.enter('createSurveyScene');
  }

  @Action('deleteSurveyScene')
  async deleteSurvey(@Ctx() ctx: Context) {
    await ctx.scene.enter('deleteSurveyScene');
  }

  @Action('viewAllSurveysScene')
  async viewAllSurveys(@Ctx() ctx: Context) {
    await ctx.scene.enter('viewAllSurveysScene');
  }


  @On('text')
  async textHandle(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    if (message && message.text) {
      switch (ctx.session?.waitingMode) {
        case 'connectionSurveyId':
          if (message.text === 'exit') {
            await ctx.scene.reenter();
            break;
          }
          if (!await this.surveyService.findOneByUniqueId(message.text)) {
            await ctx.reply('Survey not found, try one more time, or type exit');
            break;
          }
          ctx.session.currentSurveyId = message.text as string;
          await ctx.reply(`Successful connected to ${message.text} survey. Enjoy!`);
          ctx.session.waitingMode = undefined;
          await ctx.scene.enter('surveyMenuScene');
          break;
        default:
          await ctx.reply("I don't waiting a message from you");
          break;
      }
    }
  }
}