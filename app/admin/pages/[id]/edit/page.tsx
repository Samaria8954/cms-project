"use client";

import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useParams, useRouter } from "next/navigation";

import SummernoteEditor from "@/components/SummernoteEditor";


type PageData = {
  id: number;
  title: string;
  menuLabel?: string | null;
  slug: string;

  content: string;
  contentBlocks?: string | null;

  customHtml: string;
  customCss: string;
  customJs: string;

  seoTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;

  featuredImage?: string | null;
  status: string;
  updatedAt?: string;
};

type CodeSection = {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  enabled: boolean;
};

type ContentBlock =
  | {
      id: string;
      type: "summernote";
      content: string;
    }
  | {
      id: string;
      type: "custom";
      sectionId: string;
    };

type CodeTab = "html" | "css" | "js";

const SECTION_START = "CMS_CUSTOM_SECTION_START";
const SECTION_END = "CMS_CUSTOM_SECTION_END";

function createId() {
  return `${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

/* =========================================================
   PARSE SAVED CUSTOM SECTIONS
========================================================= */

function parseSections(
  customHtml = "",
  customCss = "",
  customJs = ""
): CodeSection[] {
  const sections = new Map<string, CodeSection>();

  const getSection = (
    id: string,
    name = "Custom Section"
  ) => {
    if (!sections.has(id)) {
      sections.set(id, {
        id,
        name,
        html: "",
        css: "",
        js: "",
        enabled: true,
      });
    }

    return sections.get(id)!;
  };

  /* HTML */

  const htmlRegex = new RegExp(
    `<!--\\s*${SECTION_START}:([^:]+):([\\s\\S]*?)\\s*-->([\\s\\S]*?)<!--\\s*${SECTION_END}:\\1\\s*-->`,
    "g"
  );

  let htmlMatch: RegExpExecArray | null;

  while ((htmlMatch = htmlRegex.exec(customHtml))) {
    const id = htmlMatch[1];
    const name =
      htmlMatch[2].trim() || "Custom Section";

    const html = htmlMatch[3].trim();

    const section = getSection(id, name);

    section.name = name;
    section.html = html;
  }

  /* CSS */

  const cssRegex = new RegExp(
    `/\\*\\s*${SECTION_START}:([^:]+):([\\s\\S]*?)\\s*\\*/([\\s\\S]*?)/\\*\\s*${SECTION_END}:\\1\\s*\\*/`,
    "g"
  );

  let cssMatch: RegExpExecArray | null;

  while ((cssMatch = cssRegex.exec(customCss))) {
    const id = cssMatch[1];
    const name =
      cssMatch[2].trim() || "Custom Section";

    const css = cssMatch[3].trim();

    const section = getSection(id, name);

    section.name = name;
    section.css = css;
  }

  /* JS */

  const jsRegex = new RegExp(
    `/\\*\\s*${SECTION_START}:([^:]+):([\\s\\S]*?)\\s*\\*/([\\s\\S]*?)/\\*\\s*${SECTION_END}:\\1\\s*\\*/`,
    "g"
  );

  let jsMatch: RegExpExecArray | null;

  while ((jsMatch = jsRegex.exec(customJs))) {
    const id = jsMatch[1];
    const name =
      jsMatch[2].trim() || "Custom Section";

    const js = jsMatch[3].trim();

    const section = getSection(id, name);

    section.name = name;
    section.js = js;
  }

  /* LEGACY */

  if (
    sections.size === 0 &&
    (customHtml.trim() ||
      customCss.trim() ||
      customJs.trim())
  ) {
    sections.set("legacy", {
      id: "legacy",
      name: "Custom Code",
      html: customHtml.trim(),
      css: customCss.trim(),
      js: customJs.trim(),
      enabled: true,
    });
  }

  return Array.from(sections.values());
}

/* =========================================================
   SERIALIZE CUSTOM SECTIONS
========================================================= */

function serializeSections(
  sections: CodeSection[]
) {
  const htmlParts: string[] = [];
  const cssParts: string[] = [];
  const jsParts: string[] = [];

  sections
    .filter((section) => section.enabled)
    .forEach((section) => {
      const safeName =
        section.name.trim() || "Custom Section";

      if (section.html.trim()) {
        htmlParts.push(
          `<!-- ${SECTION_START}:${section.id}:${safeName} -->\n` +
            section.html.trim() +
            `\n<!-- ${SECTION_END}:${section.id} -->`
        );
      }

      if (section.css.trim()) {
        cssParts.push(
          `/* ${SECTION_START}:${section.id}:${safeName} */\n` +
            section.css.trim() +
            `\n/* ${SECTION_END}:${section.id} */`
        );
      }

      if (section.js.trim()) {
        jsParts.push(
          `/* ${SECTION_START}:${section.id}:${safeName} */\n` +
            section.js.trim() +
            `\n/* ${SECTION_END}:${section.id} */`
        );
      }
    });

  return {
    customHtml: htmlParts.join("\n\n"),
    customCss: cssParts.join("\n\n"),
    customJs: jsParts.join("\n\n"),
  };
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function EditPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  /* =======================================================
     PAGE STATE
  ======================================================= */

  const [page, setPage] =
    useState<PageData | null>(null);

  const [title, setTitle] = useState("");
  const [menuLabel, setMenuLabel] = useState("");
  const [slug, setSlug] = useState("");

  const [blocks, setBlocks] =
    useState<ContentBlock[]>([]);

  const [sections, setSections] =
    useState<CodeSection[]>([]);

  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] =
    useState("");
  const [focusKeyword, setFocusKeyword] =
    useState("");

  const [featuredImage, setFeaturedImage] =
    useState("");

  const [status, setStatus] = useState("draft");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =======================================================
     ADD SECTION CHOOSER
  ======================================================= */

  const [addSectionOpen, setAddSectionOpen] =
    useState(false);

  const [customInsertIndex, setCustomInsertIndex] =
    useState<number | null>(null);

  /* =======================================================
     CUSTOM CODE MODAL
  ======================================================= */

  const [codeModalOpen, setCodeModalOpen] =
    useState(false);

  const [editingSectionId, setEditingSectionId] =
    useState<string | null>(null);

  const [codeName, setCodeName] = useState("");
  const [codeHtml, setCodeHtml] = useState("");
  const [codeCss, setCodeCss] = useState("");
  const [codeJs, setCodeJs] = useState("");

  const [codeTab, setCodeTab] =
    useState<CodeTab>("html");

  /* =======================================================
     LOAD PAGE
  ======================================================= */

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function loadPage() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/pages/${id}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load page."
          );
        }

        const data = await response.json();

        if (cancelled) return;

        const pageData: PageData =
          data.page ?? data;

        setPage(pageData);

        setTitle(pageData.title || "");

        setMenuLabel(
          pageData.menuLabel || ""
        );

        setSlug(pageData.slug || "");

        setSeoTitle(
          pageData.seoTitle || ""
        );

        setMetaDescription(
          pageData.metaDescription || ""
        );

        setFocusKeyword(
          pageData.focusKeyword || ""
        );

        setFeaturedImage(
          pageData.featuredImage || ""
        );

        setStatus(
          pageData.status || "draft"
        );

        const parsedSections =
          parseSections(
            pageData.customHtml || "",
            pageData.customCss || "",
            pageData.customJs || ""
          );

        setSections(parsedSections);

        /* =================================================
           LOAD ORDERED BLOCKS
        ================================================= */

        let loadedBlocks: ContentBlock[] =
          [];

        if (pageData.contentBlocks) {
          try {
            const parsed = JSON.parse(
              pageData.contentBlocks
            );

            if (Array.isArray(parsed)) {
              loadedBlocks =
                parsed.filter(
                  (block): block is ContentBlock => {
                    if (
                      !block ||
                      typeof block !== "object"
                    ) {
                      return false;
                    }

                    if (
                      block.type ===
                        "summernote" &&
                      typeof block.content ===
                        "string"
                    ) {
                      return true;
                    }

                    if (
                      block.type === "custom" &&
                      typeof block.sectionId ===
                        "string"
                    ) {
                      return true;
                    }

                    return false;
                  }
                );
            }
          } catch (parseError) {
            console.error(
              "Unable to parse contentBlocks:",
              parseError
            );
          }
        }

        /* =================================================
           OLD PAGE FALLBACK
        ================================================= */

        if (loadedBlocks.length === 0) {
          const legacyBlocks: ContentBlock[] =
            [];

          if (pageData.content?.trim()) {
            legacyBlocks.push({
              id: createId(),
              type: "summernote",
              content: pageData.content,
            });
          }

          parsedSections.forEach((section) => {
            legacyBlocks.push({
              id: createId(),
              type: "custom",
              sectionId: section.id,
            });
          });

          loadedBlocks = legacyBlocks;
        }

        setBlocks(loadedBlocks);
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            "Unable to load this page."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [id]);

    useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function loadPage() {
      // tumhara existing code...
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [id]);


  /* =======================================================
     BROWSER TAB TITLE
  ======================================================= */

  useEffect(() => {
    if (title.trim()) {
      document.title = `Edit Page - ${title}`;
    } else {
      document.title = "Edit Page";
    }

    return () => {
      document.title = "Admin";
    };
  }, [title]);
  /* =======================================================
     UPDATE SUMMERNOTE BLOCK
  ======================================================= */

  function updateSummernoteBlock(
    blockId: string,
    value: string
  ) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId &&
        block.type === "summernote"
          ? {
              ...block,
              content: value,
            }
          : block
      )
    );
  }

  /* =======================================================
     ADD SECTION CHOOSER
  ======================================================= */

  function openAddSectionChooser() {
    setAddSectionOpen(true);
  }

  function addSummernoteBlock() {
    const newBlock: ContentBlock = {
      id: createId(),
      type: "summernote",
      content: "",
    };

    setBlocks((current) => [
      ...current,
      newBlock,
    ]);

    setAddSectionOpen(false);
  }

  function addCustomBlock() {
    setAddSectionOpen(false);

    setCustomInsertIndex(
      blocks.length
    );

    openAddCodeModal();
  }

  /* =======================================================
     SAVE PAGE
  ======================================================= */

  async function savePage(
    nextStatus?: string
  ) {
    if (!page) return;

    if (!title.trim()) {
      setError("Page title is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (seoTitle.length > 60) {
      setError(
        "SEO Title should not exceed 60 characters."
      );
      return;
    }

    if (metaDescription.length > 160) {
      setError(
        "Meta Description should not exceed 160 characters."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const finalStatus =
        nextStatus || status;

      const serialized =
        serializeSections(sections);

      /*
       * Keep first Summernote content
       * in legacy content field.
       */
      const firstSummernote =
        blocks.find(
          (block) =>
            block.type === "summernote"
        );

      const legacyContent =
        firstSummernote &&
        firstSummernote.type ===
          "summernote"
          ? firstSummernote.content
          : "";

      const response = await fetch(
        `/api/pages/${page.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title: title.trim(),

            menuLabel:
              menuLabel.trim() || null,

            slug: slug.trim(),

            /*
             * Legacy field
             */
            content: legacyContent,

            /*
             * NEW ORDERED BUILDER
             */
            contentBlocks:
              JSON.stringify(blocks),

            /*
             * Custom code
             */
            customHtml:
              serialized.customHtml,

            customCss:
              serialized.customCss,

            customJs:
              serialized.customJs,

            /*
             * SEO
             */
            seoTitle:
              seoTitle.trim() || null,

            metaDescription:
              metaDescription.trim() || null,

            focusKeyword:
              focusKeyword.trim() || null,

            /*
             * Featured Image
             */
            featuredImage:
              featuredImage.trim() || null,

            status: finalStatus,
          }),
        }
      );

      if (!response.ok) {
        const data =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          data?.error ||
            "Failed to save page."
        );
      }

      const data =
        await response
          .json()
          .catch(() => null);

      if (data?.page) {
        setPage(data.page);
      }

      setStatus(finalStatus);

      setMessage(
        finalStatus === "published"
          ? "Page published successfully."
          : "Page saved successfully."
      );

      window.setTimeout(() => {
        setMessage("");
      }, 3500);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleSaveDraft() {
    savePage("draft");
  }

  function handlePublish() {
    savePage("published");
  }

  /* =======================================================
     PREVIEW
  ======================================================= */

  function handlePreview() {
    if (!slug.trim()) {
      setError(
        "Please enter a slug before previewing."
      );
      return;
    }

    window.open(
      `/${slug.trim()}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  /* =======================================================
     CUSTOM CODE MODAL
  ======================================================= */

  function openAddCodeModal() {
    setEditingSectionId(null);

    setCodeName("");
    setCodeHtml("");
    setCodeCss("");
    setCodeJs("");

    setCodeTab("html");

    setCodeModalOpen(true);
  }

  function openEditCodeModal(
    section: CodeSection
  ) {
    setEditingSectionId(section.id);

    setCodeName(section.name);
    setCodeHtml(section.html);
    setCodeCss(section.css);
    setCodeJs(section.js);

    setCodeTab("html");

    setCodeModalOpen(true);
  }

  function closeCodeModal() {
    setCodeModalOpen(false);

    setEditingSectionId(null);

    setCodeName("");
    setCodeHtml("");
    setCodeCss("");
    setCodeJs("");

    setCodeTab("html");
    setCustomInsertIndex(null);
  }

  function saveCodeSection() {
    const name =
      codeName.trim() ||
      "Custom Section";

    /*
     * EDIT EXISTING
     */
    if (editingSectionId) {
      setSections((current) =>
        current.map((item) =>
          item.id === editingSectionId
            ? {
                ...item,
                name,
                html: codeHtml,
                css: codeCss,
                js: codeJs,
              }
            : item
        )
      );

      closeCodeModal();
      return;
    }

    /*
     * NEW CUSTOM SECTION
     */
    const newSection: CodeSection = {
      id: createId(),
      name,
      html: codeHtml,
      css: codeCss,
      js: codeJs,
      enabled: true,
    };

    setSections((current) => [
      ...current,
      newSection,
    ]);

    const newBlock: ContentBlock = {
      id: createId(),
      type: "custom",
      sectionId: newSection.id,
    };

    setBlocks((current) => {
      const next = [...current];

      const insertIndex =
        customInsertIndex === null
          ? next.length
          : Math.max(
              0,
              Math.min(
                customInsertIndex,
                next.length
              )
            );

      next.splice(
        insertIndex,
        0,
        newBlock
      );

      return next;
    });

    closeCodeModal();
  }

  /* =======================================================
     DUPLICATE CUSTOM SECTION
  ======================================================= */

  function duplicateSection(
    section: CodeSection
  ) {
    const copy: CodeSection = {
      ...section,
      id: createId(),
      name: `${section.name} Copy`,
    };

    setSections((current) => {
      const index = current.findIndex(
        (item) => item.id === section.id
      );

      if (index === -1) {
        return [...current, copy];
      }

      const next = [...current];

      next.splice(index + 1, 0, copy);

      return next;
    });

    setBlocks((current) => {
      const blockIndex =
        current.findIndex(
          (block) =>
            block.type === "custom" &&
            block.sectionId === section.id
        );

      const newBlock: ContentBlock = {
        id: createId(),
        type: "custom",
        sectionId: copy.id,
      };

      if (blockIndex === -1) {
        return [...current, newBlock];
      }

      const next = [...current];

      next.splice(
        blockIndex + 1,
        0,
        newBlock
      );

      return next;
    });
  }

  /* =======================================================
     TOGGLE CUSTOM SECTION
  ======================================================= */

  function toggleSection(
    sectionId: string
  ) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              enabled:
                !section.enabled,
            }
          : section
      )
    );
  }

  /* =======================================================
     DELETE CUSTOM SECTION
  ======================================================= */

  function deleteSection(
    sectionId: string
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this custom section?"
    );

    if (!confirmed) return;

    setSections((current) =>
      current.filter(
        (section) =>
          section.id !== sectionId
      )
    );

    setBlocks((current) =>
      current.filter(
        (block) =>
          !(
            block.type === "custom" &&
            block.sectionId === sectionId
          )
      )
    );
  }

  /* =======================================================
     DELETE SUMMERNOTE BLOCK
  ======================================================= */

  function deleteSummernoteBlock(
    blockId: string
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this content section?"
    );

    if (!confirmed) return;

    setBlocks((current) =>
      current.filter(
        (block) => block.id !== blockId
      )
    );
  }

  /* =======================================================
     FEATURED IMAGE
  ======================================================= */

  function handleFeaturedImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select an image file."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result ===
        "string"
      ) {
        setFeaturedImage(
          reader.result
        );
      }
    };

    reader.onerror = () => {
      setError(
        "Unable to read the image."
      );
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  }

  function removeFeaturedImage() {
    setFeaturedImage("");
  }

  /* =======================================================
     COUNTERS / URL
  ======================================================= */

  const seoTitleCount =
    seoTitle.length;

  const metaDescriptionCount =
    metaDescription.length;

  const publicUrl = useMemo(() => {
    return slug.trim()
      ? `/${slug.trim()}`
      : "/page-slug";
  }, [slug]);

  /* =======================================================
     MODAL PREVIEW
  ======================================================= */

  const modalPreview = useMemo(() => {
    const safeJs = codeJs || "";

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<style>
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
}

body {
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  background: #ffffff;
  color: #0f172a;
}

${codeCss}

</style>
</head>

<body>

${codeHtml}

<script>
try {
${safeJs}
} catch (error) {
  console.error(error);
}
</script>

</body>
</html>`;
  }, [
    codeHtml,
    codeCss,
    codeJs,
  ]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-500 shadow-sm">
            Loading page...
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE NOT FOUND
  ======================================================= */

  if (!page) {
    return (
      <div className="min-h-screen bg-[#f6f8fc]">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
              !
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Page not found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              The page you are trying to
              edit does not exist.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/pages"
                )
              }
              className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Back to Pages
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* ===================================================
          TOP HEADER
      =================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[68px] max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/pages"
                )
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              title="Back to Pages"
            >
              ←
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-600">
                  Edit Page
                </span>

                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                  ID #{page.id}
                </span>
              </div>

              <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                {title ||
                  "Untitled Page"}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {message && (
              <div className="hidden rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 md:block">
                {message}
              </div>
            )}

            {error && (
              <div className="hidden max-w-[320px] truncate rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 md:block">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handlePreview}
              className="hidden rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 sm:inline-flex"
            >
              Preview
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="min-w-0">
            {/* PAGE TITLE */}

            <div className="mb-3">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Page Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Enter page title..."
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* =================================================
                PAGE CONTENT / ORDERED BUILDER
            ================================================= */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.035)]">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Page Content
                  </h2>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Build your page section by section.
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-600">
                  {blocks.length}
                </span>
              </div>

              <div className="p-3">
                {blocks.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                      +
                    </div>

                    <h3 className="mt-2 text-xs font-bold text-slate-800">
                      No sections yet
                    </h3>

                    <p className="mx-auto mt-1 max-w-sm text-[10px] leading-4 text-slate-400">
                      Add a Summernote content section or custom code section.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {blocks.map(
                      (block, index) => {
                        /* =====================================
                           SUMMERNOTE BLOCK
                        ===================================== */

                        if (
                          block.type ===
                          "summernote"
                        ) {
                          return (
                            <div
                              key={
                                block.id
                              }
                              className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                            >
                              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2.5">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[10px] font-bold text-blue-600">
                                    {index +
                                      1}
                                  </div>

                                  <div>
                                    <h3 className="text-xs font-bold text-slate-900">
                                      Summernote Content
                                    </h3>

                                    <span className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                                      Visual Editor
                                    </span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteSummernoteBlock(
                                      block.id
                                    )
                                  }
                                  className="rounded-md border border-red-200 px-2 py-1 text-[9px] font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>

                              <div className="p-3">
                                <SummernoteEditor
                                  value={
                                    block.content
                                  }
                                  onChange={(
                                    value
                                  ) =>
                                    updateSummernoteBlock(
                                      block.id,
                                      value
                                    )
                                  }
                                  disabled={
                                    saving
                                  }
                                />
                              </div>
                            </div>
                          );
                        }

                        /* =====================================
                           CUSTOM BLOCK
                        ===================================== */

                        const section =
                          sections.find(
                            (item) =>
                              item.id ===
                              block.sectionId
                          );

                        if (!section) {
                          return null;
                        }

                        return (
                          <div
                            key={
                              block.id
                            }
                            className={`overflow-hidden rounded-lg border ${
                              section.enabled
                                ? "border-slate-200 bg-white"
                                : "border-slate-200 bg-slate-50 opacity-70"
                            }`}
                          >
                            {/* HEADER */}

                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2.5">
                              <div className="flex min-w-0 items-center gap-2">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[10px] font-bold text-blue-600">
                                  {index +
                                    1}
                                </div>

                                <div className="min-w-0">
                                  <h3 className="truncate text-xs font-bold text-slate-900">
                                    {
                                      section.name
                                    }
                                  </h3>

                                  <div className="mt-0.5 flex gap-1">
                                    {section.html.trim() && (
                                      <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[8px] font-bold text-orange-600">
                                        HTML
                                      </span>
                                    )}

                                    {section.css.trim() && (
                                      <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[8px] font-bold text-blue-600">
                                        CSS
                                      </span>
                                    )}

                                    {section.js.trim() && (
                                      <span className="rounded bg-yellow-50 px-1.5 py-0.5 text-[8px] font-bold text-yellow-600">
                                        JS
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex shrink-0 items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditCodeModal(
                                      section
                                    )
                                  }
                                  className="rounded-md border border-slate-200 px-2 py-1 text-[9px] font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    duplicateSection(
                                      section
                                    )
                                  }
                                  className="rounded-md border border-slate-200 px-2 py-1 text-[9px] font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                >
                                  Duplicate
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleSection(
                                      section.id
                                    )
                                  }
                                  className={`rounded-md border px-2 py-1 text-[9px] font-semibold ${
                                    section.enabled
                                      ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                      : "border-slate-200 bg-white text-slate-500"
                                  }`}
                                >
                                  {section.enabled
                                    ? "Enabled"
                                    : "Disabled"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteSection(
                                      section.id
                                    )
                                  }
                                  className="rounded-md border border-red-200 px-2 py-1 text-[9px] font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>

                            {/* PREVIEW */}

                            <div className="bg-slate-50 p-2">
                              <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
                                {section.html.trim() ||
                                section.css.trim() ||
                                section.js.trim() ? (
                                  <iframe
                                    title={`Preview ${section.name}`}
                                    srcDoc={`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    sans-serif;

  background: #fff;
}

${section.css}
</style>
</head>

<body>

${section.html}

<script>
try {
${section.js}
} catch(error) {
  console.error(error);
}
</script>

</body>
</html>`}
                                    className="h-[180px] w-full border-0 bg-white"
                                    sandbox="allow-scripts"
                                  />
                                ) : (
                                  <div className="flex h-[120px] items-center justify-center text-[10px] text-slate-400">
                                    Empty custom section
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}

                {/* ONE ADD BUTTON */}

                <div className="mt-3 flex justify-center border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={
                      openAddSectionChooser
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    <span className="text-sm">
                      +
                    </span>

                    Add Section
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="min-w-0 space-y-3">
            {/* FEATURED IMAGE */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.035)]">
              <div className="border-b border-slate-200 px-4 py-3">
                <h2 className="text-sm font-bold text-slate-900">
                  Featured Image
                </h2>
              </div>

              <div className="p-3">
                {featuredImage ? (
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="h-36 w-full object-cover"
                    />

                    <div className="flex items-center justify-between border-t border-slate-200 bg-white p-2">
                      <label className="cursor-pointer rounded-md px-2.5 py-1.5 text-[10px] font-bold text-blue-600 transition hover:bg-blue-50">
                        Replace

                        <input
                          type="file"
                          accept="image/*"
                          onChange={
                            handleFeaturedImageChange
                          }
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={
                          removeFeaturedImage
                        }
                        className="rounded-md px-2.5 py-1.5 text-[10px] font-bold text-red-600 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex min-h-[145px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 text-center transition hover:border-blue-300 hover:bg-blue-50/40">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg shadow-sm">
                      🖼️
                    </div>

                    <span className="mt-2 text-[10px] font-bold text-slate-700">
                      Upload Featured Image
                    </span>

                    <span className="mt-1 text-[9px] text-slate-400">
                      PNG, JPG, WEBP
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleFeaturedImageChange
                      }
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </section>

            {/* PUBLISH */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.035)]">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <h2 className="text-sm font-bold text-slate-900">
                  Publish
                </h2>

                <span
                  className={`rounded-full px-2 py-1 text-[9px] font-bold ${
                    status === "published"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {status === "published"
                    ? "Published"
                    : "Draft"}
                </span>
              </div>

              <div className="space-y-3 p-3">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-600">
                    Status
                  </label>

                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target.value
                      )
                    }
                    className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>
                  </select>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Current Status
                    </span>

                    <span
                      className={`text-[10px] font-bold ${
                        status === "published"
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    >
                      {status ===
                      "published"
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={
                      handleSaveDraft
                    }
                    disabled={saving}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-[10px] font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : "Save Draft"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      handlePublish
                    }
                    disabled={saving}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : "Publish"}
                  </button>
                </div>
              </div>
            </section>

            {/* SEO */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.035)]">
              <div className="border-b border-slate-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">
                    SEO Settings
                  </h2>

                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-blue-600">
                    SEO
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-3">
                {/* SEO TITLE */}

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-700">
                      SEO Title
                    </label>

                    <span
                      className={`text-[9px] font-semibold ${
                        seoTitleCount >
                        60
                          ? "text-red-600"
                          : seoTitleCount >
                              50
                            ? "text-amber-600"
                            : "text-slate-400"
                      }`}
                    >
                      {seoTitleCount}/60
                    </span>
                  </div>

                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(event) =>
                      setSeoTitle(
                        event.target.value
                      )
                    }
                    maxLength={70}
                    placeholder="SEO title..."
                    className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* META DESCRIPTION */}

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-700">
                      Meta Description
                    </label>

                    <span
                      className={`text-[9px] font-semibold ${
                        metaDescriptionCount >
                        160
                          ? "text-red-600"
                          : metaDescriptionCount >
                              145
                            ? "text-amber-600"
                            : "text-slate-400"
                      }`}
                    >
                      {metaDescriptionCount}/160
                    </span>
                  </div>

                  <textarea
                    value={
                      metaDescription
                    }
                    onChange={(event) =>
                      setMetaDescription(
                        event.target.value
                      )
                    }
                    maxLength={180}
                    rows={3}
                    placeholder="Write a short description..."
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs leading-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* FOCUS KEYWORD */}

                <div>
                  <label className="mb-1 block text-[10px] font-bold text-slate-700">
                    Focus Keyword
                  </label>

                  <input
                    type="text"
                    value={focusKeyword}
                    onChange={(event) =>
                      setFocusKeyword(
                        event.target.value
                      )
                    }
                    placeholder="e.g. web development"
                    className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* SEARCH PREVIEW */}

                <div>
                  <div className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                    Search Preview
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                    <div className="truncate text-[11px] font-semibold text-blue-700">
                      {seoTitle ||
                        title ||
                        "Page Title"}
                    </div>

                    <div className="mt-0.5 truncate text-[9px] text-emerald-700">
                      example.com
                      {publicUrl}
                    </div>

                    <div className="mt-1 line-clamp-2 text-[9px] leading-4 text-slate-500">
                      {metaDescription ||
                        "Your page meta description will appear here."}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* MOBILE MESSAGE */}

            {(message || error) && (
              <div
                className={`rounded-xl border px-3 py-2.5 text-xs font-semibold xl:hidden ${
                  error
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {error || message}
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* ===================================================
          ADD SECTION CHOOSER
      =================================================== */}

      {addSectionOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/15 p-4">
          <div className="w-full max-w-[440px] rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Add Section
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Choose one section type.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAddSectionOpen(
                    false
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-lg text-slate-500 hover:bg-slate-50"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4">
              {/* SUMMERNOTE */}

              <button
                type="button"
                onClick={
                  addSummernoteBlock
                }
                className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg font-bold text-blue-600">
                  T
                </div>

                <h3 className="mt-3 text-xs font-bold text-slate-900">
                  Text Editor
                </h3>

                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  Add text and visual content using the editor.
                </p>
              </button>

              {/* CUSTOM CODE */}

              <button
                type="button"
                onClick={
                  addCustomBlock
                }
                className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 font-mono text-sm text-slate-700">
                  &lt;/&gt;
                </div>

                <h3 className="mt-3 text-xs font-bold text-slate-900">
                  Custom Code
                </h3>

                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  Add HTML, CSS and JavaScript with live preview.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          CUSTOM CODE MODAL
      =================================================== */}

      {codeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/25 p-3 backdrop-blur-[2px] sm:p-5">
          <div className="flex h-[94vh] w-full max-w-[1450px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.18)]">
            {/* MODAL HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
                    &lt;/&gt;
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                      {editingSectionId
                        ? "Edit Custom Section"
                        : "Add Custom Section"}
                    </h2>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Write code on the left and see live preview on the right.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  closeCodeModal
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                title="Close"
              >
                ×
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="min-h-0 flex-1 overflow-hidden">
              <div className="grid h-full grid-cols-1 lg:grid-cols-2">
                {/* LEFT */}

                <div className="flex min-h-0 flex-col border-b border-slate-200 bg-slate-50 lg:border-b-0 lg:border-r">
                  {/* NAME */}

                  <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3">
                    <label className="mb-1.5 block text-[10px] font-bold text-slate-700">
                      Section Name
                    </label>

                    <input
                      type="text"
                      value={codeName}
                      onChange={(event) =>
                        setCodeName(
                          event.target.value
                        )
                      }
                      placeholder="e.g. Hero Section"
                      className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* TABS */}

                  <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-2">
                    <div className="flex rounded-lg bg-slate-100 p-1">
                      {(
                        [
                          "html",
                          "css",
                          "js",
                        ] as CodeTab[]
                      ).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() =>
                            setCodeTab(
                              tab
                            )
                          }
                          className={`flex-1 rounded-md px-3 py-2 text-[10px] font-bold uppercase tracking-wide transition ${
                            codeTab === tab
                              ? "bg-white text-blue-600 shadow-sm"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CODE */}

                  <div className="min-h-0 flex-1 overflow-hidden p-4">
                    {codeTab ===
                      "html" && (
                      <textarea
                        value={
                          codeHtml
                        }
                        onChange={(
                          event
                        ) =>
                          setCodeHtml(
                            event.target
                              .value
                          )
                        }
                        spellCheck={false}
                        placeholder={`<section class="hero">
  <h1>Hello World</h1>
</section>`}
                        className="h-full min-h-[350px] w-full resize-none rounded-xl border border-slate-300 bg-white p-4 font-mono text-[12px] leading-6 text-slate-800 outline-none placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    )}

                    {codeTab ===
                      "css" && (
                      <textarea
                        value={
                          codeCss
                        }
                        onChange={(
                          event
                        ) =>
                          setCodeCss(
                            event.target
                              .value
                          )
                        }
                        spellCheck={false}
                        placeholder={`.hero {
  padding: 80px 20px;
  text-align: center;
}`}
                        className="h-full min-h-[350px] w-full resize-none rounded-xl border border-slate-300 bg-white p-4 font-mono text-[12px] leading-6 text-slate-800 outline-none placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    )}

                    {codeTab ===
                      "js" && (
                      <textarea
                        value={
                          codeJs
                        }
                        onChange={(
                          event
                        ) =>
                          setCodeJs(
                            event.target
                              .value
                          )
                        }
                        spellCheck={false}
                        placeholder={`document
  .querySelector(".hero")
  ?.addEventListener("click", () => {
    console.log("Clicked");
  });`}
                        className="h-full min-h-[350px] w-full resize-none rounded-xl border border-slate-300 bg-white p-4 font-mono text-[12px] leading-6 text-slate-800 outline-none placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    )}
                  </div>
                </div>

                {/* RIGHT PREVIEW */}

                <div className="flex min-h-0 flex-col bg-[#f6f8fc]">
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        Live Preview
                      </h3>

                      <p className="mt-0.5 text-[9px] text-slate-400">
                        Preview updates while you edit.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />

                      <span className="text-[9px] font-semibold text-slate-500">
                        Live
                      </span>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-auto p-4">
                    <div className="min-h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      {codeHtml.trim() ||
                      codeCss.trim() ||
                      codeJs.trim() ? (
                        <iframe
                          title="Custom Section Live Preview"
                          srcDoc={
                            modalPreview
                          }
                          className="min-h-[500px] w-full border-0 bg-white"
                          sandbox="allow-scripts"
                        />
                      ) : (
                        <div className="flex min-h-[500px] items-center justify-center px-6 text-center">
                          <div>
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
                              &lt;/&gt;
                            </div>

                            <h4 className="mt-3 text-sm font-bold text-slate-700">
                              Nothing to preview yet
                            </h4>

                            <p className="mt-1 max-w-xs text-[10px] leading-4 text-slate-400">
                              Add HTML, CSS or JavaScript on the left.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-3">
              <div className="hidden text-[9px] text-slate-400 sm:block">
                {editingSectionId
                  ? "Changes will be applied to this section."
                  : "New custom section will be added to the page."}
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={
                    closeCodeModal
                  }
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-[10px] font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    saveCodeSection
                  }
                  className="rounded-lg bg-blue-600 px-5 py-2 text-[10px] font-bold text-white shadow-sm transition hover:bg-blue-700"
                >
                  {editingSectionId
                    ? "Update Section"
                    : "Add Section"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}