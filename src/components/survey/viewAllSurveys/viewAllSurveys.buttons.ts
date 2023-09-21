import { Markup } from "telegraf";

export function viewAllSurveysButtons() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('Go menu', 'goMenu'),
    ],
    {
      columns: 3,
    }
  )
}

