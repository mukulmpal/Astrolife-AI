// Ambient types for "pdfkit" package.
declare namespace PDFKit {
  interface PDFDocumentOptions {
    size?: string | [number, number];
    margins?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    bufferPages?: boolean;
    info?: Record<string, any>;
    [key: string]: any;
  }

  interface TextOptions {
    align?: "left" | "center" | "right" | "justify";
    width?: number;
    height?: number;
    ellipsis?: boolean | string;
    underline?: boolean;
    lineBreak?: boolean;
    continued?: boolean;
    [key: string]: any;
  }

  interface PDFDocument {
    y: number;
    x: number;
    pipe<T extends NodeJS.WritableStream>(destination: T, options?: any): T;
    font(src: string, family?: string, size?: number): this;
    fontSize(size: number): this;
    fillColor(color: string, opacity?: number): this;
    strokeColor(color: string, opacity?: number): this;
    lineWidth(width: number): this;
    rect(x: number, y: number, w: number, h: number): this;
    fillAndStroke(fillColor?: string, strokeColor?: string): this;
    text(text: string, options?: TextOptions): this;
    text(text: string, x?: number, y?: number, options?: TextOptions): this;
    moveDown(lines?: number): this;
    moveUp(lines?: number): this;
    addPage(options?: any): this;
    bufferedPageRange(): { start: number; count: number };
    switchToPage(pageIndex: number): this;
    end(): void;
    [key: string]: any;
  }
}

declare module "pdfkit" {
  const PDFDocument: {
    new (options?: PDFKit.PDFDocumentOptions): PDFKit.PDFDocument;
  };
  export default PDFDocument;
}

