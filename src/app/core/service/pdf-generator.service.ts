import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  constructor() {}

  async generatePDF(html: string, fileName: string = 'receta.pdf') {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    tempElement.style.width = '750px'; // Ajusta este valor para controlar el tamaño de la fuente
    tempElement.style.position = 'absolute';
    tempElement.style.left = '-9999px';
    document.body.appendChild(tempElement);

    const pdf = new jsPDF('p', 'pt', 'letter');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const marginHorizontal = 40; // Margen para encuadernación
    const marginVertical = 20;
    const usableWidth = pageWidth - marginHorizontal * 2;

    try {
      const canvas = await html2canvas(tempElement, {
        scale: 2,
        useCORS: true,
      });

      const imgWidth = usableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let currentHeight = 0;
      let pageNumber = 1;

      while (currentHeight < imgHeight) {
        const pageCanvasHeight = Math.min(pageHeight - marginVertical * 2, imgHeight - currentHeight);

        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          marginHorizontal,
          marginVertical,
          imgWidth,
          pageCanvasHeight,
          undefined,
          'FAST'
        );

        currentHeight += pageCanvasHeight;

        if (currentHeight < imgHeight) {
          pdf.addPage();
          pageNumber++;
          pdf.setPage(pageNumber);
        }
      }

      pdf.save(fileName);
    } catch (error) {
      console.error('Error generando el PDF:', error);
    } finally {
      document.body.removeChild(tempElement);
    }
  }
}
