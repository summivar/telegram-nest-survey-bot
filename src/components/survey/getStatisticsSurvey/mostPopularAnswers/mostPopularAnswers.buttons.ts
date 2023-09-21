import { Markup } from "telegraf";

export function mostPopularAnswersButtons() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('Go survey menu', 'goSurveyMenu'),
    ]
  )
}