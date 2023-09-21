import { Markup } from "telegraf";

export function menuButtons() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('Connect to survey', 'connectToSurvey'),
      Markup.button.callback('Create survey', 'createSurveyScene'),
      Markup.button.callback('Delete survey', 'deleteSurveyScene'),
      Markup.button.callback('View all surveys', 'viewAllSurveysScene'),
    ],
    {
      columns: 3,
    }
  )
}