import { Injectable } from '@nestjs/common';
import { AnswerLevel, SurveyEntity } from '../survey.entity';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration, } from 'chart.js';
import * as fs from 'fs';

export type CharType = 'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar';

@Injectable()
export class GetStatisticsSurveyService {
  constructor() {
  }

  getPopularAnswersStats(survey: SurveyEntity): string {
    const answerCounts: Record<AnswerLevel, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    // Подсчитываем количество каждого уровня ответа
    survey.answers.forEach((answer) => {
      answerCounts[answer.answerLevel]++;
    });

    const totalAnswers = survey.answers.length;
    const stats: string[] = [];

    // Генерируем статистику для каждого уровня ответа
    for (let level = 5; level >= 1; level--) {
      const count = answerCounts[level];
      const percentage = (count / totalAnswers) * 100;

      // Добавляем результат в массив статистики
      stats.push(`Total ${level}: ${count} - ${percentage.toFixed(2)}%`);
    }

    // Добавляем общее количество ответов
    stats.unshift(`Total number of answers: ${totalAnswers}\n`);

    // Объединяем все строки статистики в одну строку
    return stats.join('\n');
  }

  getAverageLevel(survey: SurveyEntity): number {
    if (survey.answers.length === 0) {
      return 0; // Защита от деления на ноль, если ответов нет
    }

    let totalLevel = 0;

    // Суммируем уровни ответов
    survey.answers.forEach((answer) => {
      totalLevel += Number(answer.answerLevel);
    });

    // Рассчитываем средний уровень ответов
    return Number((totalLevel / survey.answers.length).toFixed(2));
  }

  existedFileToDelete(filename: string) {

  }

  async createGraph(survey: SurveyEntity, fileName: string, type: CharType) {
    const width = 1000;   // define width and height of canvas
    const height = 1000;

    const canvasRenderService = new ChartJSNodeCanvas({width: width, height: height});

    const xLabels = survey.answers.map((answer) => answer.name); // Метки по оси X
    const dataValues = survey.answers.map((answer) => answer.answerLevel); // Значения данных

    const createImage = async () => {
      const xLabels = ['1', '2', '3', '4', '5']; // Метки по оси X
      const dataValues = [0, 0, 0, 0, 0]; // Изначально у нас 5 уровней, и значения начинаются с 0

      if (survey.answers.length) {
        survey.answers.forEach((answer) => {
          dataValues[answer.answerLevel - 1]++;
        });
      }

      const plugin = {
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart, args, options) => {
          const {ctx} = chart;
          ctx.save();
          ctx.globalCompositeOperation = 'destination-over';
          ctx.fillStyle = options.color || '#99ffff';
          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        }
      };

      // @ts-ignore
      const configuration: ChartConfiguration = {
        type: type, // Тип графика (можно изменить на другой тип)
        data: {
          labels: xLabels,
          datasets: [
            {
              label: 'Answer level',
              data: dataValues,
              backgroundColor: [
                'rgba(255, 0, 0, 0.75)',
                'rgba(255, 165, 0, 0.75)',
                'rgba(255, 255, 0, 0.75)',
                'rgba(162, 255, 0, 0.75)',
                'rgba(0, 128, 0, 0.75)',
              ], // Цвет столбцов
              borderWidth: 0
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true, // Ось Y начинается с 0
            }
          },
          plugins: {
            // @ts-ignore
            customCanvasBackgroundColor: {
              color: 'white',
            }
          }
        },
        plugins: [plugin],
      };

      return canvasRenderService.renderToDataURL(configuration);
    };

    const base64 = await createImage();
    let base64Image = base64.split(';base64,').pop();
    fs.writeFile(fileName, base64Image, {encoding: 'base64'}, function (err) {
    });
  }

  async deletePhoto(imageURL: string) {
    if (fs.existsSync(imageURL)) {
      fs.unlinkSync(imageURL);
    }
  }
}