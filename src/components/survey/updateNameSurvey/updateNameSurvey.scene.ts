import { Command, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from '../../../context.interface';
import { SurveyService } from '../survey.service';

@Scene('updateNameSurveyScene')
export class UpdateNameSurveyScene {

  constructor(private surveyService: SurveyService) {
  }

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    ctx.session.waitingMode = 'newNameOfSurvey';
    try {
      await ctx.editMessageText('Write new name for survey: ');
    } catch (e) {
      await ctx.reply('Write new name for survey: ');
    }
  }

  @On('text')
  async handleText(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    if (message && message.text) {
      switch (ctx.session.waitingMode) {
        case 'newNameOfSurvey':
          if (message.text === 'exit') {
            await ctx.scene.enter('surveyMenuScene');
            break;
          }
          const isUpdated = await this.surveyService.findOneByUniqueIdAndUpdateName(ctx.session.currentSurveyId, message.text as string);
          if (!isUpdated) {
            await ctx.reply('Something go wrong in updating name, go to menu...');
            await ctx.scene.enter('surveyMenuScene');
            break;
          }
          await ctx.reply(`Name of survey is updated. New name: ${message.text as string}`);
          ctx.session.waitingMode = null;
          await ctx.scene.enter('surveyMenuScene');
          break;
        default:
          await ctx.reply('Something go wrong in updateNameSurveyScene, go to menu...');
          await ctx.scene.enter('surveyMenuScene');
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