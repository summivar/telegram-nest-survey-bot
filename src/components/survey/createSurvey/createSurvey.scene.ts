import { Command, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from '../../../context.interface';
import { SurveyService } from '../survey.service';

@Scene('createSurveyScene')
export class CreateSurveyScene {
  constructor(private surveyService: SurveyService) {
  }

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    ctx.session.waitingMode = 'nameOfSurvey';
    try {
      await ctx.editMessageText('Write name of survey or type exit: ');
    } catch (e) {
      await ctx.reply('Write name of survey or type exit: ');
    }
  }

  @On('text')
  async handleText(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    if (message && message.text) {
      switch (ctx.session.waitingMode) {
        case 'nameOfSurvey':
          if (message.text === 'exit') {
            await ctx.scene.enter('menuScene');
            break;
          }
          ctx.session.tempData.firstData = message.text;
          await ctx.reply('Ok. Write question of survey or type exit: ');
          ctx.session.waitingMode = 'questionOfSurvey';
          break;
        case 'questionOfSurvey':
          if (message.text === 'exit') {
            await ctx.scene.enter('menuScene');
            break;
          }
          try {
            const survey = await this.surveyService.addNewSurvey(ctx.session.tempData.firstData, message.text, ctx.message.from.id);
            if (!survey) {
              await ctx.reply('Can not add, sorry, go to menu...');
              await ctx.scene.enter('menuScene');
              break;
            }
            await ctx.reply(`Ok. New survey created. \nName: ${survey.name}, \nquestion: ${survey.question}, \nuniqueId: ${survey.uniqueId}`);
            ctx.session.waitingMode = null;
            ctx.session.tempData = {};
            ctx.session.currentSurveyId = survey.uniqueId;
            await ctx.scene.enter('surveyMenuScene');
          } catch (e) {
            console.log(`Error while questioning, in createSurveyScene, user: ${ctx.message.from.id} | ${ctx.message.from.username}`);
            await ctx.reply('Something go wrong in createSurveyScene, go to menu...');
            await ctx.scene.enter('menuScene');
          }
          break;
        default:
          await ctx.reply('Something go wrong in createSurveyScene, go to menu...');
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