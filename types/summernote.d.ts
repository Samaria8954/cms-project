import "jquery";

declare module "jquery" {
  interface JQueryStatic {
    summernote: {
      ui: {
        button(options: {
          contents?: string;
          tooltip?: string;
          click?: () => void;
        }): {
          render(): JQuery<HTMLElement>;
        };
      };
    };
  }

  interface JQuery<TElement = HTMLElement> {
    summernote(
      options?: SummernoteOptions
    ): JQuery<TElement>;

    summernote(command: "code"): string;

    summernote(
      command: "code",
      value: string
    ): JQuery<TElement>;

    summernote(
      command: "disable" | "enable" | "destroy"
    ): JQuery<TElement>;

    summernote(
      command: string,
      ...args: unknown[]
    ): JQuery<TElement>;
  }
}

interface SummernoteOptions {
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  placeholder?: string;

  dialogsInBody?: boolean;
  dialogsFade?: boolean;
  disableDragAndDrop?: boolean;

  toolbar?: unknown[][];

  buttons?: {
    [key: string]: (context: unknown) => unknown;
  };

  callbacks?: {
    onInit?: () => void;
    onChange?: (contents: string) => void;
    onBlur?: () => void;
    onDestroy?: () => void;
  };
}