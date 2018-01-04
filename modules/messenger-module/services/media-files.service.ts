import { Injectable } from '@angular/core';
import { MediaFilesServiceOutput } from '../../../interfaces';

@Injectable()
export class MediaFilesService {

  validateFile(event: Event): MediaFilesServiceOutput {
      let fileType: string = '';
      const target: HTMLInputElement = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        console.log(target.files[0].type)
        switch (target.files[0].type) {
          case 'image/jpeg': fileType = 'image';
          break;
          case 'image/png': fileType = 'image';
          break;
          default: fileType = 'file';
          break;
        }
      }
      return {
        file: target.files[0],
        type: fileType,
        name: target.files[0].name,
        progress: 0
      };
  }
}
