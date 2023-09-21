import { Action, Command, Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context } from '../../context.interface';
import { Telegraf } from 'telegraf';

@Update()
export class MenuUpdate {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {
  }

  @Command('menu')
  async menuCommand(@Ctx() ctx: Context) {
    await ctx.scene.enter('menuScene');
  }

  @Action('goMenu')
  async goMenu(@Ctx() ctx: Context) {
    await ctx.scene.enter('menuScene');
  }
}
