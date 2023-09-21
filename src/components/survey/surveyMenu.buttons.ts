import { Markup } from "telegraf";
import { SurveyEntity } from './survey.entity';

export function surveyMenuButtons(survey: SurveyEntity) {
  const commonButtons = [
    Markup.button.callback('Add new answer', 'addNewAnswerScene'),
    Markup.button.callback('Delete last answer', 'deleteLastSurveyScene'),
    Markup.button.callback('Update question', 'updateQuestionScene'),
    Markup.button.callback('Update name', 'updateNameScene'),
    Markup.button.callback('Go menu', 'goMenu'),
  ];

  if (!survey.answers.length) {
    return Markup.inlineKeyboard(commonButtons, { columns: 3 });
  }

  // Добавляем кнопку "Get statistics" для опросов с ответами
  commonButtons.push(Markup.button.callback('Get statistics', 'getStatisticsScene'));

  return Markup.inlineKeyboard(commonButtons, { columns: 3 });
}