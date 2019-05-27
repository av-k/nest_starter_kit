import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getText(): string {
    return 'Done!';
  }
}
