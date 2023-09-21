import { Command, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from '../../../context.interface';
import { SurveyService } from '../survey.service';
import { HelperService } from '../../../shared/services/helper.service';

@Scene('addNewAnswerSurveyScene')
export class AddNewAnswerSurveyScene {
  constructor(
    private surveyService: SurveyService, private helperService: HelperService
  ) {
  }

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    ctx.session.waitingMode = 'nameOfAnswerer';
    try {
      await ctx.editMessageText('Write name of answerer. If you don\'t know, just message \'-\': ');
    } catch (e) {
      await ctx.reply('Write name of answerer. If you don\'t know, just message \'-\':  ');
    }
  }

  @On('text')
  async handleText(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    if (message && message.text) {
      switch (ctx.session.waitingMode) {
        case 'nameOfAnswerer':
          if (message.text === 'exit') {
            await ctx.scene.enter('surveyMenuScene');
            break;
          }
          if (message.text === '-') {
            ctx.session.tempData.firstData = 'unknown name';
          } else {
            ctx.session.tempData.firstData = message.text;
          }
          await ctx.reply('Ok. Write answer or type exit: ');
          ctx.session.waitingMode = 'answer';
          break;
        case 'answer':
          if (message.text === 'exit') {
            await ctx.scene.enter('surveyMenuScene');
            break;
          }
          await ctx.reply('Ok. Write answerLevel(number from 1 to 5) or type exit: ');
          ctx.session.tempData.secondData = message.text;
          ctx.session.waitingMode = 'answerLevel';
          break;
        case 'answerLevel':
          if (message.text === 'exit') {
            await ctx.scene.enter('surveyMenuScene');
            break;
          }

          if (!this.helperService.regexTestOnlyNumberFromOneToFive(message.text)) {
            await ctx.reply('The number must be from 1 to 5, try one more time');
            break;
          }

          const isAdded = await this.surveyService.addAnswerToSurvey(
            ctx.session.currentSurveyId, ctx.session.tempData.firstData, ctx.session.tempData.secondData, message.text
          );

          if (!isAdded) {
            await ctx.reply('Can not add, sorry, go to menu...');
            await ctx.scene.enter('surveyMenuScene');
            break;
          }
          await ctx.reply('Answer added. Go to survey menu...');
          await ctx.scene.enter('surveyMenuScene');
          break;
        default:
          await ctx.reply('Something go wrong in addNewAnswerSurveyScene, go to menu...');
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