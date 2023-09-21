import { Command, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from '../../../context.interface';
import { SurveyService } from '../survey.service';

@Scene('deleteSurveyScene')
export class DeleteSurveyScene {
  constructor(private surveyService: SurveyService) {
  }

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    ctx.session.waitingMode = 'uniqueId';
    try {
      await ctx.editMessageText('Write uniqueId of survey to delete or type exit: ');
    } catch (e) {
      await ctx.reply('Write uniqueId of survey to delete or type exit: ');
    }
  }

  @On('text')
  async handleText(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    if (message && message.text) {
      switch (ctx.session.waitingMode) {
        case 'uniqueId':
          if (message.text === 'exit') {
            await ctx.scene.enter('menuScene');
            break;
          }
          const isDeleted = await this.surveyService.findOneByUniqueIdAndDelete(message.text);
          if (!isDeleted) {
            await ctx.reply('Survey not found, try one more time, or type exit');
            break;
          }
          await ctx.reply('Survey has deleted');
          await ctx.scene.enter('menuScene');
          break;
        default:
          await ctx.reply('Something go wrong in deleteSurveyScene, go to menu...');
          await ctx.scene.enter('menuScene');
          break;
      }
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