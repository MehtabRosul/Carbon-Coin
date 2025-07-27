declare module 'jspdf' {
  export default class jsPDF {
    constructor(options?: {
      orientation?: 'p' | 'portrait' | 'l' | 'landscape';
      unit?: 'pt' | 'px' | 'in' | 'mm' | 'cm' | 'ex' | 'em' | 'pc';
      format?: string | number[];
      putOnlyUsedFonts?: boolean;
      floatPrecision?: number;
    });
    
    addImage(
      imageData: string, 
      format: string, 
      x: number, 
      y: number, 
      width: number, 
      height: number, 
      alias?: string, 
      compression?: string, 
      rotation?: number, 
      sourceY?: number
    ): void;
    
    save(filename: string): void;
    addPage(): void;
    
    internal: {
      pageSize: {
        getWidth(): number;
        getHeight(): number;
      };
    };
  }
} 