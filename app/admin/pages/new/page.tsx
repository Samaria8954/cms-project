"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


type PageStatus = "draft" | "published";
type SaveAction = "draft" | "edit" | "published" | "";

type ApiResponse = {
  id?: number;
  page?: {
    id?: number;
  };
  message?: string;
  error?: string;
};

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "arrow-left":
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      );

    case "file":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h6" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "link":
      return (
        <svg {...common}>
          <path d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
          <path d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 7 20l1.15-1.15" />
        </svg>
      );

    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 0 18" />
          <path d="M12 3a14 14 0 0 0 0 18" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "chevron-down":
      return (
        <svg {...common}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );

    case "eye":
      return (
        <svg {...common}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.41 1.41-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V20h-2v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-1.41-1.41.06-.06A1.7 1.7 0 0 0 9.5 15a1.7 1.7 0 0 0-1.55-1H7v-2h.95a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88L9.1 9.06l1.41-1.41.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1-1.55V5h2v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.41 1.41-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.55 1H21v2h-.95a1.7 1.7 0 0 0-1.55 1Z" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M5 7h14" />
          <path d="M5 12h14" />
          <path d="M5 17h14" />
        </svg>
      );

    case "edit":
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
      );

    case "save":
      return (
        <svg {...common}>
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
          <path d="M17 21v-8H7v8" />
          <path d="M7 3v5h8" />
        </svg>
      );

    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
        </svg>
      );

    case "external":
      return (
        <svg {...common}>
          <path d="M14 3h7v7" />
          <path d="M10 14 21 3" />
          <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
        </svg>
      );

    default:
      return null;
  }
}

export default function NewPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [menuLabel, setMenuLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(false);

  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");

  const [seoOpen, setSeoOpen] = useState(true);

  const [pageStatus, setPageStatus] =
    useState<PageStatus>("draft");

  const [saving, setSaving] = useState(false);
  const [savingType, setSavingType] = useState<SaveAction>("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const effectiveMenuLabel = useMemo(() => {
    return menuLabel.trim() || title.trim();
  }, [menuLabel, title]);

  const setupProgress = useMemo(() => {
    let completed = 0;

    if (title.trim()) completed++;
    if (slug.trim()) completed++;
    if (effectiveMenuLabel) completed++;
    if (seoTitle.trim()) completed++;
    if (metaDescription.trim()) completed++;
    if (focusKeyword.trim()) completed++;

    return Math.round((completed / 6) * 100);
  }, [
    title,
    slug,
    effectiveMenuLabel,
    seoTitle,
    metaDescription,
    focusKeyword,
  ]);

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setTitle(value);

    if (!slugManuallyEdited) {
      setSlug(generateSlug(value));
    }
  };

  const handleSlugChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSlugManuallyEdited(true);
    setSlug(generateSlug(e.target.value));
  };

  const handleSave = async (action: SaveAction) => {
    setMessage("");
    setMessageType("");

    if (!title.trim()) {
      setMessage("Please enter a page title.");
      setMessageType("error");
      return;
    }

    if (!slug.trim()) {
      setMessage("Please enter a page slug.");
      setMessageType("error");
      return;
    }

    if (seoTitle.length > 60) {
      setMessage("SEO Title should not exceed 60 characters.");
      setMessageType("error");
      return;
    }

    if (metaDescription.length > 160) {
      setMessage(
        "Meta Description should not exceed 160 characters."
      );
      setMessageType("error");
      return;
    }

    setSaving(true);
    setSavingType(action);

    const status: PageStatus =
      action === "published" ? "published" : "draft";

    try {
      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          menuLabel: effectiveMenuLabel || null,
          slug: slug.trim(),
          seoTitle: seoTitle.trim() || null,
          metaDescription: metaDescription.trim() || null,
          focusKeyword: focusKeyword.trim() || null,
          status,
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to create page."
        );
      }

      const pageId = data.id ?? data.page?.id;

      if (!pageId) {
        throw new Error(
          "Page was created but its ID was not returned."
        );
      }

      if (action === "edit" || action === "published") {
        router.push(`/admin/pages/${pageId}/edit`);
        return;
      }

      router.push("/admin/pages");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setMessageType("error");
    } finally {
      setSaving(false);
      setSavingType("");
    }
  };

  const previewTitle =
    seoTitle.trim() || title.trim() || "Your Page Title";

  const previewDescription =
    metaDescription.trim() ||
    "Add a meta description to control how this page appears in search results.";

  const previewUrl =
    slug.trim() || "your-page";

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <style jsx global>{`
        @keyframes newPageFadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes newPageSoftIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .new-page-enter {
          animation: newPageFadeUp 0.45s ease both;
        }

        .new-page-section {
          animation: newPageSoftIn 0.5s ease both;
        }

        .new-page-input {
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background-color 0.2s ease;
        }

        .new-page-input:focus {
          outline: none;
          border-color: #60a5fa;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .new-page-button {
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background-color 0.2s ease,
            border-color 0.2s ease;
        }

        .new-page-button:hover {
          transform: translateY(-1px);
        }
      `}</style>

      <div className="new-page-enter mx-auto w-full max-w-[1550px] px-4 py-6 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <Link
              href="/admin/pages"
              className="new-page-button mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900"
            >
              <Icon name="arrow-left" size={19} />
            </Link>

            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">
                  Content
                </span>

                <span className="text-slate-400">/</span>

                <span className="text-[11px] font-semibold text-slate-500">
                  New Page
                </span>
              </div>

              <h1 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[28px]">
                Create New Page
              </h1>

              <p className="mt-1.5 text-[14px] text-slate-600">
                Set up your page details before opening the editor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-[13px] font-medium text-slate-700 shadow-sm">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  pageStatus === "draft"
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
              />

              {pageStatus === "draft"
                ? "Draft"
                : "Published"}
            </div>

            <Link
              href="/admin/pages"
              className="new-page-button rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* MESSAGE */}

        {message && (
          <div
            className={`mb-6 flex items-center gap-2.5 rounded-xl border px-4 py-3.5 text-[13px] font-medium ${
              messageType === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-red-300 bg-red-50 text-red-800"
            }`}
          >
            <Icon
              name={messageType === "success" ? "check" : "info"}
              size={17}
            />

            <span>{message}</span>
          </div>
        )}

        {/* =====================================================
            WORKSPACE
        ===================================================== */}

        <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* ===================================================
              LEFT CONTENT
          =================================================== */}

          <main className="min-w-0">
            {/* PAGE INFORMATION */}

            <section className="new-page-section overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-[0_5px_22px_rgba(15,23,42,0.045)]">
              <div className="border-b border-slate-200 px-6 py-5 sm:px-7">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon name="file" size={20} />
                  </div>

                  <div>
                    <h2 className="text-[17px] font-bold text-slate-900">
                      Page Information
                    </h2>

                    <p className="mt-0.5 text-[13px] text-slate-600">
                      Basic details for your new page.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-7 p-6 sm:p-7">
                {/* PAGE TITLE */}

                <div>
                  <label className="mb-2.5 block text-[14px] font-bold text-slate-800">
                    Page Title
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="e.g. About Us"
                    className="new-page-input h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-[15px] font-medium text-slate-800 placeholder:text-slate-500"
                  />

                  <p className="mt-2 text-[12px] text-slate-500">
                    Main title displayed on the page.
                  </p>
                </div>

                {/* MENU LABEL */}

                <div>
                  <label className="mb-2.5 block text-[14px] font-bold text-slate-800">
                    Menu Label
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      <Icon name="menu" size={18} />
                    </span>

                    <input
                      type="text"
                      value={menuLabel}
                      onChange={(e) =>
                        setMenuLabel(e.target.value)
                      }
                      placeholder={
                        title || "e.g. About"
                      }
                      className="new-page-input h-12 w-full rounded-xl border border-slate-300 bg-slate-50 pl-11 pr-4 text-[15px] font-medium text-slate-800 placeholder:text-slate-500"
                    />
                  </div>

                  <p className="mt-2 text-[12px] text-slate-500">
                    Leave empty to use the page title.
                  </p>
                </div>

                {/* SLUG */}

                <div>
                  <label className="mb-2.5 block text-[14px] font-bold text-slate-800">
                    URL Slug
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-slate-50">
                    <div className="flex h-12 items-center border-r border-slate-300 bg-slate-100 px-4 text-[14px] font-semibold text-slate-600">
                      /
                    </div>

                    <input
                      type="text"
                      value={slug}
                      onChange={handleSlugChange}
                      placeholder="about-us"
                      className="new-page-input h-12 min-w-0 flex-1 bg-transparent px-4 text-[15px] font-medium text-slate-800 placeholder:text-slate-500 focus:shadow-none"
                    />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[12px] text-slate-500">
                      URL-friendly address of the page.
                    </p>

                    {slugManuallyEdited && (
                      <button
                        type="button"
                        onClick={() => {
                          setSlugManuallyEdited(false);
                          setSlug(generateSlug(title));
                        }}
                        className="text-[12px] font-bold text-blue-600 hover:text-blue-700"
                      >
                        Reset from title
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                SEO SECTION
            ================================================= */}

            <section
              className="new-page-section mt-8"
              style={{
                animationDelay: "70ms",
              }}
            >
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <button
                  type="button"
                  onClick={() => setSeoOpen(!seoOpen)}
                  className="flex items-center gap-3.5 text-left"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon name="search" size={19} />
                  </div>

                  <div>
                    <h2 className="text-[17px] font-bold text-slate-900">
                      SEO Settings
                    </h2>

                    <p className="mt-0.5 text-[13px] text-slate-600">
                      Search engine settings for this page.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSeoOpen(!seoOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-800"
                >
                  <span
                    className={`transition-transform duration-200 ${
                      seoOpen ? "rotate-180" : ""
                    }`}
                  >
                    <Icon name="chevron-down" size={19} />
                  </span>
                </button>
              </div>

              {seoOpen && (
                <div className="pt-7">
                  {/* SEO TITLE */}

                  <div className="mb-7">
                    <div className="mb-2.5 flex items-center justify-between gap-3">
                      <label className="text-[14px] font-bold text-slate-800">
                        SEO Title
                      </label>

                      <span
                        className={`text-[12px] font-semibold ${
                          seoTitle.length > 60
                            ? "text-red-600"
                            : "text-slate-500"
                        }`}
                      >
                        {seoTitle.length}/60
                      </span>
                    </div>

                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) =>
                        setSeoTitle(e.target.value)
                      }
                      placeholder={
                        title || "Enter SEO title"
                      }
                      className="new-page-input h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] font-medium text-slate-800 placeholder:text-slate-500"
                    />

                    <p className="mt-2 text-[12px] text-slate-500">
                      Recommended: 50–60 characters.
                    </p>
                  </div>

                  {/* META DESCRIPTION */}

                  <div className="mb-7">
                    <div className="mb-2.5 flex items-center justify-between gap-3">
                      <label className="text-[14px] font-bold text-slate-800">
                        Meta Description
                      </label>

                      <span
                        className={`text-[12px] font-semibold ${
                          metaDescription.length > 160
                            ? "text-red-600"
                            : "text-slate-500"
                        }`}
                      >
                        {metaDescription.length}/160
                      </span>
                    </div>

                    <textarea
                      value={metaDescription}
                      onChange={(e) =>
                        setMetaDescription(e.target.value)
                      }
                      placeholder="Write a short description..."
                      rows={5}
                      className="new-page-input w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-[15px] font-medium leading-6 text-slate-800 placeholder:text-slate-500"
                    />

                    <p className="mt-2 text-[12px] text-slate-500">
                      Recommended: 150–160 characters.
                    </p>
                  </div>

                  {/* FOCUS KEYWORD */}

                  <div className="mb-8">
                    <label className="mb-2.5 block text-[14px] font-bold text-slate-800">
                      Focus Keyword
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                        <Icon name="search" size={17} />
                      </span>

                      <input
                        type="text"
                        value={focusKeyword}
                        onChange={(e) =>
                          setFocusKeyword(e.target.value)
                        }
                        placeholder="e.g. web development"
                        className="new-page-input h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-[15px] font-medium text-slate-800 placeholder:text-slate-500"
                      />
                    </div>

                    <p className="mt-2 text-[12px] text-slate-500">
                      Main keyword you want to target.
                    </p>
                  </div>

                  {/* SEARCH PREVIEW */}

                  <div className="border-t border-slate-300 pt-7">
                    <div className="mb-4 flex items-center gap-2.5">
                      <Icon
                        name="eye"
                        size={18}
                        strokeWidth={1.8}
                      />

                      <span className="text-[14px] font-bold text-slate-700">
                        Search Preview
                      </span>
                    </div>

                    <div className="max-w-3xl rounded-xl border border-slate-300 bg-white px-5 py-5 shadow-sm sm:px-6">
                      <div className="mb-1.5 text-[12px] font-medium text-slate-500">
                        yourwebsite.com/{previewUrl}
                      </div>

                      <div className="mb-1.5 text-[19px] font-medium leading-7 text-blue-700">
                        {previewTitle}
                      </div>

                      <p className="text-[14px] leading-6 text-slate-600">
                        {previewDescription}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* =================================================
                EDITOR HANDOFF
            ================================================= */}

            <section className="mt-9 border-t border-slate-300 pt-7">
              <div className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Icon name="edit" size={18} />
                  </div>

                  <div>
                    <h3 className="text-[15px] font-bold text-slate-800">
                      Page Content
                    </h3>

                    <p className="mt-1 text-[13px] leading-5 text-slate-600">
                      Build the actual page from the editor after
                      creation.
                    </p>
                  </div>
                </div>

                <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-[12px] font-semibold text-slate-600">
                  <Icon name="edit" size={14} />
                  After creation
                </span>
              </div>
            </section>
          </main>

          {/* ===================================================
              RIGHT SIDEBAR
          =================================================== */}

          <aside className="space-y-7">
            {/* PUBLISHING */}

            <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-[0_5px_22px_rgba(15,23,42,0.045)]">
              <div className="border-b border-slate-200 px-5 py-4.5">
                <div className="flex items-center gap-2.5">
                  <Icon
                    name="settings"
                    size={18}
                    strokeWidth={1.7}
                  />

                  <h3 className="text-[15px] font-bold text-slate-900">
                    Publishing
                  </h3>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <label className="mb-2.5 block text-[13px] font-bold text-slate-700">
                    Status
                  </label>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setPageStatus("draft")
                      }
                      className={`rounded-xl border px-4 py-3.5 text-left transition ${
                        pageStatus === "draft"
                          ? "border-blue-300 bg-blue-50 text-blue-800"
                          : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-[13px] font-bold">
                        Draft
                      </div>

                      <div className="mt-1 text-[11px] font-medium opacity-70">
                        Save for later
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPageStatus("published")
                      }
                      className={`rounded-xl border px-4 py-3.5 text-left transition ${
                        pageStatus === "published"
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                          : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-[13px] font-bold">
                        Publish
                      </div>

                      <div className="mt-1 text-[11px] font-medium opacity-70">
                        Make it live
                      </div>
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-5">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-slate-600">
                      Visibility
                    </span>

                    <span className="text-[13px] font-bold text-slate-800">
                      Public
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[12px] text-slate-500">
                    <Icon name="globe" size={15} />
                    Anyone can view when published.
                  </div>
                </div>
              </div>
            </section>

            {/* NAVIGATION */}

            <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-[0_5px_22px_rgba(15,23,42,0.045)]">
              <div className="border-b border-slate-200 px-5 py-4.5">
                <div className="flex items-center gap-2.5">
                  <Icon name="menu" size={18} />

                  <h3 className="text-[15px] font-bold text-slate-900">
                    Navigation
                  </h3>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                  Menu Preview
                </div>

                <div className="flex min-h-[46px] items-center gap-2.5 rounded-xl border border-slate-300 bg-slate-50 px-4">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />

                  <span className="truncate text-[13px] font-bold text-slate-700">
                    {effectiveMenuLabel || "Page Label"}
                  </span>
                </div>

                <p className="mt-2.5 text-[12px] leading-5 text-slate-500">
                  Menu label can differ from page title.
                </p>
              </div>
            </section>

            {/* PUBLIC URL */}

            <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-[0_5px_22px_rgba(15,23,42,0.045)]">
              <div className="border-b border-slate-200 px-5 py-4.5">
                <div className="flex items-center gap-2.5">
                  <Icon name="link" size={18} />

                  <h3 className="text-[15px] font-bold text-slate-900">
                    Public URL
                  </h3>
                </div>
              </div>

              <div className="p-5">
                <div className="break-all rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-[12px] leading-6 text-slate-600">
                  https://yourwebsite.com/
                  <span className="font-bold text-slate-800">
                    {slug || "your-page"}
                  </span>
                </div>
              </div>
            </section>

            {/* SETUP */}

            <section className="rounded-xl border border-slate-200 bg-white/60 p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-bold text-slate-700">
                  Page Setup
                </span>

                <span className="text-[13px] font-bold text-blue-700">
                  {setupProgress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-300">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${setupProgress}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-[12px] leading-5 text-slate-500">
                Complete the basic details before opening the editor.
              </p>
            </section>
          </aside>
        </div>

        {/* =====================================================
            BOTTOM ACTION BAR
        ===================================================== */}

        <div className="sticky bottom-0 z-30 mt-9 border-t border-slate-300 bg-[#f5f7fb]/95 py-5 backdrop-blur-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2.5 text-[13px] font-medium text-slate-600">
              <Icon name="info" size={16} />

              <span>
                Content can be added after page creation.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/admin/pages"
                className="new-page-button rounded-xl border border-slate-300 bg-white px-5 py-3 text-[13px] font-bold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="button"
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="new-page-button inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-[13px] font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon name="save" size={17} />

                {saving && savingType === "draft"
                  ? "Saving..."
                  : "Save Draft"}
              </button>

              <button
                type="button"
                onClick={() => handleSave("edit")}
                disabled={saving}
                className="new-page-button inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-[13px] font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon name="edit" size={17} />

                {saving && savingType === "edit"
                  ? "Creating..."
                  : "Create & Edit"}
              </button>

              <button
                type="button"
                onClick={() => handleSave("published")}
                disabled={saving}
                className="new-page-button inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-[13px] font-bold text-emerald-800 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon name="check" size={17} />

                {saving && savingType === "published"
                  ? "Publishing..."
                  : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}