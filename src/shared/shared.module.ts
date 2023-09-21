import { Global, Module, Provider } from '@nestjs/common';
import { HelperService } from './services/helper.service';

const providers: Provider[] = [
  HelperService
]

@Global()
@Module({
  providers: providers,
  exports: [...providers]
})
export class SharedModule {
}