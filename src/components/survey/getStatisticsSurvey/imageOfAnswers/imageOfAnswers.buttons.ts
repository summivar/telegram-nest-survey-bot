import { Markup } from "telegraf";

export function imageOfAnswersButtons () {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('Get a pie', 'getPie'),
      Markup.button.callback('Get a bar', 'getBar'),
      Markup.button.callback('Go survey menu', 'goSurveyMenu'),
    ]
  )
}