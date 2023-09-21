import { Action, Command, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from '../../../../context.interface';
import { CharType, GetStatisticsSurveyService } from '../getStatisticsSurvey.service';
import { imageOfAnswersButtons } from './imageOfAnswers.buttons';
import { SurveyService } from '../../survey.service';

@Scene('imageOfAnswersScene')
export class ImageOfAnswersScene {
  constructor(
    private getStatisticsSurveyService: GetStatisticsSurveyService,
    private surveyService: SurveyService
  ) {
  }

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    try {
      await ctx.editMessageText('Select a menu item: ', imageOfAnswersButtons());
    } catch (e) {
      await ctx.reply('Select a menu item: ', imageOfAnswersButtons());
    }
  }

  @Action('getPie')
  async getPie(@Ctx() ctx: Context) {
    await this.handleImage(ctx, 'pie');
  }

  @Action('getBar')
  async getBar(@Ctx() ctx: Context) {
    await this.handleImage(ctx, 'bar');
  }

  private async handleImage (ctx: Context, type: CharType) {
    try {
      const survey = await this.surveyService.findOneByUniqueId(ctx.session.currentSurveyId);
      const imageURL = `${ctx.from.id}.png`;
      this.getStatisticsSurveyService.deletePhoto(imageURL).finally(() => {
        this.getStatisticsSurveyService.createGraph(survey, imageURL, type).then(async () => {
          await ctx.replyWithPhoto({source: imageURL}).then(async () => {
            await this.getStatisticsSurveyService.deletePhoto(imageURL);
            await ctx.scene.reenter();
          });
        });
      });
    } catch (e) {
      console.log(e);
      await ctx.reply('Something go wrong, try later, go menu...');
      await ctx.scene.enter('surveyMenuScene');
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