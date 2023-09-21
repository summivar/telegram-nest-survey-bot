import { Module } from '@nestjs/common';
import { MenuScene, MenuUpdate, StartUpdate, SurveyModule, } from '../components';

@Module({
  imports: [
    SurveyModule
  ],
  providers: [
    // all updates
    MenuUpdate,
    StartUpdate,
    // all scenes
    MenuScene
  ],
  exports: [
    // all updates
    MenuUpdate,
    StartUpdate,
    // all scenes
    MenuScene,
    // module
    SurveyModule
  ]
})
export class ComponentsModule {
}
