import { Action, Command, Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context } from '../../context.interface';
import { Telegraf } from 'telegraf';

@Update()
export class SurveyMenuUpdate {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {
  }

  @Action('goSurveyMenu')
  async goSurveyMenu(@Ctx() ctx: Context) {
    await ctx.scene.enter('surveyMenuScene');
  }

  @Command('menu')
  async menuCommand(@Ctx() ctx: Context) {
    await ctx.scene.enter('menuScene');
  }
}
