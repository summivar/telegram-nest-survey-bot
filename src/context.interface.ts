import { Context as ContextTelegraf } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

export type WaitingMode =
  'connectionSurveyId'
  | 'nameOfSurvey'
  | 'questionOfSurvey'
  | 'uniqueId'
  | 'newNameOfSurvey'
  | 'newQuestionOfSurvey'
  | 'nameOfAnswerer'
  | 'answer'
  | 'answerLevel'
  | null;

export interface Context extends ContextTelegraf, SceneContext {
  session: {
    __scenes: any;
    waitingMode: WaitingMode;
    tempData: {
      firstData?: string;
      secondData?: string;
    };
    currentSurveyId: string | null;
  }
}
