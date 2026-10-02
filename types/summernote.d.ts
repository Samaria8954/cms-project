import "jquery";

declare module "jquery" {
  interface JQuery<TElement = HTMLElement> {
    summernote(
      options?: SummernoteOptions | string,
      ...args: unknown[]
    ): JQuery<TElement>;
  }
}

interface SummernoteOptions {
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  placeholder?: string;

  callbacks?: {
    onChange?: (contents: string) => void;
    onInit?: () => void;
    onDestroy?: () => void;
  };

  toolbar?: unknown[];
}