import { Markup } from "telegraf";

export function getStatisticsSurveyButtons() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('The most popular answers', 'mostPopularAnswers'),
      Markup.button.callback('Average level of answers', 'averageAnswers'),
      Markup.button.callback('Get an image', 'imageOfAnswers'),
      Markup.button.callback('Go survey menu', 'goSurveyMenu'),
    ],
    {
      columns: 3,
    }
  )
}