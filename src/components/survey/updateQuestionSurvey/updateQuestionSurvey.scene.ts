import { Command, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from '../../../context.interface';
import { SurveyService } from '../survey.service';

@Scene('updateQuestionSurveyScene')
export class UpdateQuestionSurveyScene {
  constructor(private surveyService: SurveyService) {
  }

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    ctx.session.waitingMode = 'newQuestionOfSurvey';
    try {
      await ctx.editMessageText('Write new question for survey: ');
    } catch (e) {
      await ctx.reply('Write new question for survey: ');
    }
  }

  @On('text')
  async handleText(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    if (message && message.text) {
      switch (ctx.session.waitingMode) {
        case 'newQuestionOfSurvey':
          if (message.text === 'exit') {
            await ctx.scene.enter('surveyMenuScene');
            break;
          }
          const isUpdated = await this.surveyService.findOneByUniqueIdAndUpdateQuestion(ctx.session.currentSurveyId, message.text);
          if (!isUpdated) {
            await ctx.reply('Something go wrong in updating question, go to menu...');
            await ctx.scene.enter('surveyMenuScene');
            break;
          }
          await ctx.reply(`Question of survey is updated. New question: ${message.text}`);
          ctx.session.waitingMode = null;
          await ctx.scene.enter('surveyMenuScene');
          break;
        default:
          await ctx.reply('Something go wrong in updateQuestionSurveyScene, go to menu...');
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