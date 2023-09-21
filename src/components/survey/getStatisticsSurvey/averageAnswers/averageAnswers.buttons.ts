import { Markup } from "telegraf";

export function averageAnswersButtons () {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('Go survey menu', 'goSurveyMenu'),
    ]
  )
}