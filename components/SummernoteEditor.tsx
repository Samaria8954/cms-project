"use client";

import { useEffect, useRef } from "react";

import $ from "jquery";

import "summernote/dist/summernote-lite.css";
import "summernote/dist/summernote-lite.js";

type SummernoteEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onCustomCodeClick?: () => void;
};

export default function SummernoteEditor({
  value,
  onChange,
  disabled = false,
  onCustomCodeClick,
}: SummernoteEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);

  const lastValueRef = useRef(value || "");
  const onChangeRef = useRef(onChange);
  const customCodeClickRef = useRef(onCustomCodeClick);

  /* -----------------------------------------
     Keep latest callbacks
  ----------------------------------------- */

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    customCodeClickRef.current = onCustomCodeClick;
  }, [onCustomCodeClick]);

  /* -----------------------------------------
     Initialize Summernote
  ----------------------------------------- */

  useEffect(() => {
    if (!editorRef.current) return;

    const $editor = $(editorRef.current);

    if (initializedRef.current) return;

    initializedRef.current = true;

    const customCodeButton = function (context: any) {
      const ui = $.summernote.ui;

      return ui
        .button({
          contents:
            '<span style="font-size:13px;font-weight:700;">&lt;/&gt;</span>',
          tooltip: "Add Custom Code Section",
          click: function () {
            customCodeClickRef.current?.();
          },
        })
        .render();
    };

    try {
      $editor.summernote({
        /*
         * Small initial editor.
         * User can stretch it vertically.
         */
        height: 210,
        minHeight: 160,
        maxHeight: 900,

        placeholder: "Start writing your page content...",

        dialogsInBody: true,

        dialogsFade: false,

        disableDragAndDrop: false,

        toolbar: [
          [
            "history",
            ["undo", "redo"],
          ],

          [
            "style",
            ["style"],
          ],

          [
            "font",
            [
              "bold",
              "italic",
              "underline",
              "clear",
            ],
          ],

          [
            "fontname",
            ["fontname"],
          ],

          [
            "fontsize",
            ["fontsize"],
          ],

          [
            "color",
            ["color"],
          ],

          [
            "para",
            [
              "ul",
              "ol",
              "paragraph",
            ],
          ],

          [
            "table",
            ["table"],
          ],

          [
            "insert",
            [
              "link",
              "picture",
              "video",
            ],
          ],

          [
            "view",
            [
              "fullscreen",
              "codeview",
            ],
          ],

          
        ],

        buttons: {
          customCode: customCodeButton,
        },

        callbacks: {
          onInit: function () {
            try {
              const button = $editor
                .next(".note-editor")
                .find(
                  '.note-btn[data-name="customCode"]'
                );

              button.css({
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                color: "#2563eb",
                fontWeight: "700",
              });

              if (disabled) {
                $editor.summernote("disable");
              }
            } catch (error) {
              console.error(
                "Summernote init error:",
                error
              );
            }
          },

          onChange: function (
            contents: string
          ) {
            const newValue = contents || "";

            lastValueRef.current = newValue;

            onChangeRef.current(
              newValue
            );
          },

          onBlur: function () {
            try {
              const current =
                $editor.summernote("code") ||
                "";

              lastValueRef.current =
                current;

              onChangeRef.current(
                current
              );
            } catch (error) {
              console.error(
                "Summernote blur error:",
                error
              );
            }
          },
        },
      });

      /*
       * Initial content
       */
      $editor.summernote(
        "code",
        value || ""
      );

      lastValueRef.current =
        value || "";
    } catch (error) {
      console.error(
        "Summernote initialization error:",
        error
      );

      initializedRef.current = false;
    }

    /*
     * Cleanup
     */
    return () => {
      try {
        if (
          editorRef.current &&
          initializedRef.current
        ) {
          $editor.summernote(
            "destroy"
          );
        }
      } catch (error) {
        console.warn(
          "Summernote cleanup warning:",
          error
        );
      } finally {
        initializedRef.current =
          false;
      }
    };
  }, []);

  /* -----------------------------------------
     Sync external value
  ----------------------------------------- */

  useEffect(() => {
    if (
      !editorRef.current ||
      !initializedRef.current
    ) {
      return;
    }

    const $editor =
      $(editorRef.current);

    try {
      const current =
        $editor.summernote("code") ||
        "";

      const externalValue =
        value || "";

      /*
       * Don't overwrite user's typing.
       */
      if (
        externalValue !== current &&
        externalValue !==
          lastValueRef.current
      ) {
        $editor.summernote(
          "code",
          externalValue
        );

        lastValueRef.current =
          externalValue;
      }
    } catch (error) {
      console.warn(
        "Summernote sync warning:",
        error
      );
    }
  }, [value]);

  /* -----------------------------------------
     Disabled state
  ----------------------------------------- */

  useEffect(() => {
    if (
      !editorRef.current ||
      !initializedRef.current
    ) {
      return;
    }

    const $editor =
      $(editorRef.current);

    try {
      if (disabled) {
        $editor.summernote(
          "disable"
        );
      } else {
        $editor.summernote(
          "enable"
        );
      }
    } catch (error) {
      console.warn(
        "Summernote disabled state warning:",
        error
      );
    }
  }, [disabled]);

  return (
    <div className="summernote-wrapper w-full">
      <div
        ref={editorRef}
        className="w-full"
      />

      <style jsx global>{`
        /* =================================
           EDITOR FRAME
        ================================= */

        .summernote-wrapper
          .note-editor {
          border: 1px solid #cbd5e1 !important;

          border-radius: 10px !important;

          background: #ffffff !important;

          overflow: visible !important;
        }

        /* =================================
           TOOLBAR
        ================================= */

        .summernote-wrapper
          .note-toolbar {
          position: sticky !important;

          top: 0 !important;

          z-index: 40 !important;

          padding: 6px 7px !important;

          background: #ffffff !important;

          border-bottom: 1px solid
            #e2e8f0 !important;

          box-shadow:
            0 2px 7px
              rgba(
                15,
                23,
                42,
                0.04
              ) !important;
        }

        /* =================================
           TOOLBAR BUTTONS
        ================================= */

        .summernote-wrapper
          .note-toolbar
          .note-btn {
          margin: 1px !important;

          border-radius: 6px !important;

          min-height: 30px !important;
        }

        /* =================================
           CUSTOM CODE BUTTON
        ================================= */

        .summernote-wrapper
          .note-toolbar
          .note-btn[data-name="customCode"] {
          color: #000 !important;

          background: #eff6ff !important;

          border: 1px solid
            #bfdbfe !important;

          font-weight: 700 !important;
        }

        .summernote-wrapper
          .note-toolbar
          .note-btn[data-name="customCode"]:hover {
          background: #dbeafe !important;

          color: #000 !important;
        }

        /* =================================
           EDITING AREA

           SMALL INITIALLY
           USER CAN DRAG DOWN
        ================================= */

        .summernote-wrapper
          .note-editable {
          min-height: 160px !important;

          height: 210px !important;

          max-height: 900px !important;

          overflow-y: auto !important;

          resize: vertical !important;

          padding: 15px !important;

          font-size: 15px !important;

          line-height: 1.65 !important;
        }

        /* =================================
           RESIZE HANDLE
        ================================= */

        .summernote-wrapper
          .note-editable {
          scrollbar-width: thin;
        }

        .summernote-wrapper
          .note-editable::-webkit-scrollbar {
          width: 7px;
        }

        .summernote-wrapper
          .note-editable::-webkit-scrollbar-thumb {
          background: #cbd5e1;

          border-radius: 10px;
        }

        /* =================================
           STATUS BAR
        ================================= */

        .summernote-wrapper
          .note-statusbar {
          min-height: 5px !important;

          border-top: 1px solid
            #e2e8f0 !important;

          background: #fafafa !important;
        }

        /* =================================
           FULLSCREEN
        ================================= */

        .note-editor.note-frame.fullscreen {
          z-index: 1000 !important;
        }
      `}</style>
    </div>
  );
}