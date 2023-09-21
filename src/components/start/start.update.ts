import { Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context } from '../../context.interface';
import { Telegraf } from 'telegraf';

@Update()
export class StartUpdate {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {
  }

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    await ctx.reply('Hi! I conduct surveys');
    await ctx.scene.enter('menuScene');
  }
}
