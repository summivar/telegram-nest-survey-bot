import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  constructor() {
  }

  regexTestOnlyNumberFromOneToFive(str: string): boolean {
    return /^[1-5]+$/.test(str);
  }
}