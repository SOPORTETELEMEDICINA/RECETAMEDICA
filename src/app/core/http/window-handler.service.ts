import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowHandlerService {
  openHtmlContent(htmlContent: string, newTitle: string, url?: string): void {
    const newWindow = window.open('', '_blank');

    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();

      newWindow.document.title = newTitle;

      if (url) {
        newWindow.history.pushState({}, '', url);
      }
    } else {
      console.error('No se pudo abrir la nueva ventana');
    }
  }
}
