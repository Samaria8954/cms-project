"use client";



import Link from "next/link";

import {

  useEffect,

  useMemo,

  useState,

  type ReactNode,

} from "react";





/* =========================================================

   TYPES

\========================================================= */



type Page = {

  id: number;

  title: string;

  menuLabel?: string | null;

  slug: string;

  status: string;

  author?: string;

  createdAt: string;

  updatedAt?: string;

  seoTitle?: string | null;

  metaDescription?: string | null;

  focusKeyword?: string | null;

};



type FilterType = "all" | "published" | "draft" | "trash";



type DateFilter =

  | "all"

  | "today"

  | "week"

  | "month"

  | "last-month";



type SeoFilter =

  | "all"

  | "complete"

  | "missing";



type SortType =

  | "newest"

  | "oldest"

  | "updated"

  | "title-asc"

  | "title-desc";



/* =========================================================

   ICON

\========================================================= */



function Icon({

  name,

  className = "h-5 w-5",

}: {

  name: string;

  className?: string;

}) {

  const common = {

    fill: "none",

    stroke: "currentColor",

    strokeWidth: 1.8,

    strokeLinecap: "round" as const,

    strokeLinejoin: "round" as const,

  };



  if (name === "page") {

    return (

      <svg

        viewBox="0 0 24 24"

        className={className}

        {...common}

      >

        <path d="M6 3.5h8l4 4V20.5H6z" />

        <path d="M14 3.5v4h4" />

        <path d="M9 12h6M9 15.5h6" />

      </svg>

    );

  }



  if (name === "check") {

    return (

      <svg

        viewBox="0 0 24 24"

        className={className}

        {...common}

      >

        <path d="m5 12 4 4L19 6" />

      </svg>

    );

  }



  if (name === "draft") {

    return (

      <svg

        viewBox="0 0 24 24"

        className={className}

        {...common}

      >

        <path d="M5 4.5h14v15H5z" />

        <path d="M8 9h8M8 12h8M8 15h5" />

      </svg>

    );

  }



  if (name === "search") {

    return (

      <svg

        viewBox="0 0 24 24"

        className={className}

        {...common}

      >

        <circle cx="11" cy="11" r="6.5" />

        <path d="m16 16 4 4" />

      </svg>

    );

  }



  if (name === "close") {

    return (

      <svg

        viewBox="0 0 24 24"

        className={className}

        {...common}

      >

        <path d="m6 6 12 12M18 6 6 18" />

      </svg>

    );

  }



  if (name === "filter") {

    return (

      <svg

        viewBox="0 0 24 24"

        className={className}

        {...common}

      >

        <path d="M4 6h16M7 12h10M10 18h4" />

      </svg>

    );

  }



  if (name === "trash") {

    return (

      <svg

        viewBox="0 0 24 24"

        className={className}

        {...common}

      >

        <path d="M5 7h14" />

        <path d="M9 7V4h6v3" />

        <path d="M8 7l1 13h6l1-13" />

        <path d="M10 11v5M14 11v5" />

      </svg>

    );

  }



  if (name === "external") {

    return (

      <svg

        viewBox="0 0 24 24"

        className={className}

        {...common}

      >

        <path d="M14 5h5v5" />

        <path d="m19 5-8 8" />

        <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />

      </svg>

    );

  }



  return null;

}



/* =========================================================

   MINI STAT

\========================================================= */



function MiniStat({

  label,

  value,

  icon,

  iconClass,

  delay,

}: {

  label: string;

  value: number;

  icon: ReactNode;

  iconClass: string;

  delay: string;

}) {

  return (

    <div

      className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)]"

      style={{

        animation: "pagesFadeUp .45s ease both",

        animationDelay: delay,

      }}

    >

      <div className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full bg-blue-50/70 blur-2xl transition-all duration-300 group-hover:bg-blue-100/80" />



      <div className="relative flex items-center justify-between">

        <div className="min-w-0">

          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">

            {label}

          </p>



          <p className="mt-0.5 text-[21px] font-bold leading-6 tracking-tight text-slate-900">

            {value}

          </p>

        </div>



        <div

          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass} shadow-sm`}

        >

          {icon}

        </div>

      </div>

    </div>

  );

}



/* =========================================================

   MAIN

\========================================================= */



export default function PagesPage() {

  const [pages, setPages] = useState<Page[]>([]);
  const [trashPages, setTrashPages] = useState<Page[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  /* =======================================================

     FILTERS

  ======================================================= */



  const [filter, setFilter] =

    useState<FilterType>("all");



  const [dateFilter, setDateFilter] =

    useState<DateFilter>("all");



  const [seoFilter, setSeoFilter] =

    useState<SeoFilter>("all");



  const [sort, setSort] =

    useState<SortType>("newest");



  const [search, setSearch] =

    useState("");



  const [appliedFilters, setAppliedFilters] =

    useState({

      filter: "all" as FilterType,

      dateFilter: "all" as DateFilter,

      seoFilter: "all" as SeoFilter,

      sort: "newest" as SortType,

    });



  /* =======================================================

     DELETE

  ======================================================= */



  const [deleteId, setDeleteId] =

    useState<number | null>(null);



  const [deleting, setDeleting] =

    useState(false);



  const [deleteError, setDeleteError] =

    useState("");



  const [restoringId, setRestoringId] =

    useState<number | null>(null);



  const [permanentDeleteId, setPermanentDeleteId] =

    useState<number | null>(null);



  const [permanentlyDeleting, setPermanentlyDeleting] =

    useState(false);



  const [permanentDeleteError, setPermanentDeleteError] =

    useState("");



  /* =======================================================

     QUICK EDIT

  ======================================================= */



  const [quickEditPage, setQuickEditPage] =

    useState<Page | null>(null);



  const [quickSaving, setQuickSaving] =

    useState(false);



  const [quickMessage, setQuickMessage] =

    useState("");



  const [quickMessageType, setQuickMessageType] =

    useState<"success" | "error" | "">("");



  const [quickTitle, setQuickTitle] =

    useState("");



  const [quickMenuLabel, setQuickMenuLabel] =

    useState("");



  const [quickSlug, setQuickSlug] =

    useState("");



  const [quickSeoTitle, setQuickSeoTitle] =

    useState("");



  const [quickMetaDescription, setQuickMetaDescription] =

    useState("");



  const [quickFocusKeyword, setQuickFocusKeyword] =

    useState("");



  const [quickStatus, setQuickStatus] =

    useState("draft");



  /* =======================================================
     FETCH PAGES
  ======================================================= */

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        setError("");

        const [pagesResponse, trashResponse] = await Promise.all([
          fetch("/api/pages", { cache: "no-store" }),
          fetch("/api/pages?trash=true", { cache: "no-store" }),
        ]);

        if (!pagesResponse.ok) {
          throw new Error("Failed to fetch pages.");
        }

        const pagesData = await pagesResponse.json();
        const trashData = trashResponse.ok
          ? await trashResponse.json()
          : [];

        setPages(Array.isArray(pagesData) ? pagesData : []);
        setTrashPages(Array.isArray(trashData) ? trashData : []);
      } catch (err) {
        console.error("FETCH PAGES ERROR:", err);
        setError("Unable to load pages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  /* =======================================================

     COUNTS

  ======================================================= */



  const allCount = pages.length;



  const publishedCount =

    pages.filter(

      (page) =>

        page.status === "published"

    ).length;



  const draftCount =

    pages.filter(

      (page) =>

        page.status !== "published"

    ).length;

  const trashCount = trashPages.length;



  /* =======================================================

     SEO CHECK

  ======================================================= */



  const isSeoComplete = (

    page: Page

  ) => {

    return Boolean(

      page.seoTitle?.trim() &&

      page.metaDescription?.trim() &&

      page.focusKeyword?.trim()

    );

  };



  /* =======================================================

     DATE FILTER

  ======================================================= */



  const matchesDateFilter = (

    page: Page,

    selectedDate: DateFilter

  ) => {

    if (selectedDate === "all") {

      return true;

    }



    const created =

      new Date(page.createdAt);



    const now = new Date();



    if (selectedDate === "today") {

      return (

        created.getFullYear() ===

          now.getFullYear() &&

        created.getMonth() ===

          now.getMonth() &&

        created.getDate() ===

          now.getDate()

      );

    }



    if (selectedDate === "week") {

      const weekAgo =

        new Date(now);



      weekAgo.setDate(

        now.getDate() - 7

      );



      return created >= weekAgo;

    }



    if (selectedDate === "month") {

      return (

        created.getFullYear() ===

          now.getFullYear() &&

        created.getMonth() ===

          now.getMonth()

      );

    }



    if (

      selectedDate ===

      "last-month"

    ) {

      const firstDayCurrentMonth =

        new Date(

          now.getFullYear(),

          now.getMonth(),

          1

        );



      const firstDayLastMonth =

        new Date(

          now.getFullYear(),

          now.getMonth() - 1,

          1

        );



      return (

        created >= firstDayLastMonth &&

        created < firstDayCurrentMonth

      );

    }



    return true;

  };



  /* =======================================================

     APPLY FILTERS

  ======================================================= */



  const handleApplyFilters = () => {

    setAppliedFilters({

      filter,

      dateFilter,

      seoFilter,

      sort,

    });

  };



  /* =======================================================

     RESET FILTERS

  ======================================================= */



  const handleResetFilters = () => {

    setFilter("all");

    setDateFilter("all");

    setSeoFilter("all");

    setSort("newest");

    setSearch("");



    setAppliedFilters({

      filter: "all",

      dateFilter: "all",

      seoFilter: "all",

      sort: "newest",

    });

  };



  /* =======================================================

     FILTERED PAGES

  ======================================================= */



  const filteredPages = useMemo(() => {

    let result =
      appliedFilters.filter === "trash"
        ? [...trashPages]
        : [...pages];

    /* STATUS */

    if (
      appliedFilters.filter !== "all" &&
      appliedFilters.filter !== "trash"
    ) {
      result = result.filter((page) => {
        if (appliedFilters.filter === "published") {
          return page.status === "published";
        }

        return page.status !== "published";
      });
    }

    /* LIVE SEARCH */



    const searchValue =

      search

        .trim()

        .toLowerCase();



    if (searchValue) {

      result = result.filter(

        (page) => {

          return (

            page.title

              .toLowerCase()

              .includes(searchValue) ||

            page.slug

              .toLowerCase()

              .includes(searchValue) ||

            (

              page.menuLabel ||

              ""

            )

              .toLowerCase()

              .includes(searchValue)

          );

        }

      );

    }



    /* DATE */



    result = result.filter(

      (page) =>

        matchesDateFilter(

          page,

          appliedFilters.dateFilter

        )

    );



    /* SEO */



    if (

      appliedFilters.seoFilter ===

      "complete"

    ) {

      result = result.filter(

        (page) =>

          isSeoComplete(page)

      );

    }



    if (

      appliedFilters.seoFilter ===

      "missing"

    ) {

      result = result.filter(

        (page) =>

          !isSeoComplete(page)

      );

    }



    /* SORT */



    result.sort((a, b) => {

      if (

        appliedFilters.sort ===

        "newest"

      ) {

        return (

          new Date(

            b.createdAt

          ).getTime() -

          new Date(

            a.createdAt

          ).getTime()

        );

      }



      if (

        appliedFilters.sort ===

        "oldest"

      ) {

        return (

          new Date(

            a.createdAt

          ).getTime() -

          new Date(

            b.createdAt

          ).getTime()

        );

      }



      if (

        appliedFilters.sort ===

        "updated"

      ) {

        return (

          new Date(

            b.updatedAt ||

              b.createdAt

          ).getTime() -

          new Date(

            a.updatedAt ||

              a.createdAt

          ).getTime()

        );

      }



      if (

        appliedFilters.sort ===

        "title-asc"

      ) {

        return a.title.localeCompare(

          b.title

        );

      }



      if (

        appliedFilters.sort ===

        "title-desc"

      ) {

        return b.title.localeCompare(

          a.title

        );

      }



      return 0;

    });



    return result;

  }, [

    pages,

    trashPages,

    search,

    appliedFilters.filter,

    appliedFilters.dateFilter,

    appliedFilters.seoFilter,

    appliedFilters.sort,

  ]);



  /* =======================================================

     DELETE PAGE

  ======================================================= */



  const selectedPage =

    pages.find(

      (page) =>

        page.id === deleteId

    );



  const handleDelete = async () => {
    if (!deleteId || deleting) {
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`/api/pages/${deleteId}`, {
        method: "DELETE",
      });

      const responseText = await response.text();
      let data: any = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        setDeleteError(
          data.error || "Unable to move page to trash."
        );
        return;
      }

      const trashedPage = data.page;

      setPages((currentPages) =>
        currentPages.filter((page) => page.id !== deleteId)
      );

      if (trashedPage) {
        setTrashPages((currentPages) => [
          trashedPage,
          ...currentPages.filter((page) => page.id !== deleteId),
        ]);
      }

      setDeleteId(null);
    } catch (err) {
      console.error("MOVE PAGE TO TRASH ERROR:", err);
      setDeleteError(
        "Something went wrong while moving the page to trash."
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =======================================================
     RESTORE PAGE
  ======================================================= */

  const handleRestore = async (id: number) => {
    if (restoringId !== null) {
      return;
    }

    setRestoringId(id);

    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "restore" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to restore page."
        );
      }

      setTrashPages((currentPages) =>
        currentPages.filter((page) => page.id !== id)
      );

      if (data.page) {
        setPages((currentPages) => [
          data.page,
          ...currentPages,
        ]);
      }
    } catch (err) {
      console.error("RESTORE PAGE ERROR:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to restore page."
      );
    } finally {
      setRestoringId(null);
    }
  };

  /* =======================================================
     PERMANENT DELETE
  ======================================================= */

  const handlePermanentDelete = async () => {
    if (
      !permanentDeleteId ||
      permanentlyDeleting
    ) {
      return;
    }

    setPermanentlyDeleting(true);
    setPermanentDeleteError("");

    try {
      const response = await fetch(
        `/api/pages/${permanentDeleteId}?permanent=true`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setPermanentDeleteError(
          data.error ||
            "Unable to permanently delete page."
        );
        return;
      }

      setTrashPages((currentPages) =>
        currentPages.filter(
          (page) => page.id !== permanentDeleteId
        )
      );

      setPermanentDeleteId(null);
    } catch (err) {
      console.error(
        "PERMANENT DELETE ERROR:",
        err
      );

      setPermanentDeleteError(
        "Something went wrong while permanently deleting the page."
      );
    } finally {
      setPermanentlyDeleting(false);
    }
  };

  /* =======================================================

     OPEN QUICK EDIT

  ======================================================= */



  const openQuickEdit = (

    page: Page

  ) => {

    setQuickEditPage(page);



    setQuickTitle(

      page.title || ""

    );



    setQuickMenuLabel(

      page.menuLabel || ""

    );



    setQuickSlug(

      page.slug || ""

    );



    setQuickSeoTitle(

      page.seoTitle || ""

    );



    setQuickMetaDescription(

      page.metaDescription || ""

    );



    setQuickFocusKeyword(

      page.focusKeyword || ""

    );



    setQuickStatus(

      page.status || "draft"

    );



    setQuickMessage("");

    setQuickMessageType("");

  };



  /* =======================================================

     CLOSE QUICK EDIT

  ======================================================= */



  const closeQuickEdit = () => {

    if (quickSaving) {

      return;

    }



    setQuickEditPage(null);

    setQuickMessage("");

    setQuickMessageType("");

  };



  /* =======================================================

     QUICK UPDATE

  ======================================================= */



  const handleQuickUpdate =

    async () => {

      if (

        !quickEditPage ||

        quickSaving

      ) {

        return;

      }



      setQuickMessage("");

      setQuickMessageType("");



      if (!quickTitle.trim()) {

        setQuickMessage(

          "Page title is required."

        );

        setQuickMessageType(

          "error"

        );

        return;

      }



      if (!quickSlug.trim()) {

        setQuickMessage(

          "Page slug is required."

        );

        setQuickMessageType(

          "error"

        );

        return;

      }



      if (

        quickSeoTitle.length >

        60

      ) {

        setQuickMessage(

          "SEO Title should be 60 characters or less."

        );

        setQuickMessageType(

          "error"

        );

        return;

      }



      if (

        quickMetaDescription.length >

        160

      ) {

        setQuickMessage(

          "Meta Description should be 160 characters or less."

        );

        setQuickMessageType(

          "error"

        );

        return;

      }



      setQuickSaving(true);



      try {

        const response =

          await fetch(

            `/api/pages/${quickEditPage.id}`,

            {

              method: "PUT",

              headers: {

                "Content-Type":

                  "application/json",

              },

              body: JSON.stringify({

                title:

                  quickTitle.trim(),



                menuLabel:

                  quickMenuLabel.trim() ||

                  null,



                slug:

                  quickSlug.trim(),



                seoTitle:

                  quickSeoTitle.trim() ||

                  null,



                metaDescription:

                  quickMetaDescription.trim() ||

                  null,



                focusKeyword:

                  quickFocusKeyword.trim() ||

                  null,



                status:

                  quickStatus,

              }),

            }

          );



        const responseText =

          await response.text();



        let data: any = {};



        try {

          data = responseText

            ? JSON.parse(

                responseText

              )

            : {};

        } catch {

          throw new Error(

            responseText ||

              "Invalid server response."

          );

        }



        if (!response.ok) {

          throw new Error(

            data.error ||

              data.details ||

              "Unable to update page."

          );

        }



        setPages(

          (currentPages) =>

            currentPages.map(

              (page) =>

                page.id ===

                quickEditPage.id

                  ? {

                      ...page,

                      title:

                        quickTitle.trim(),

                      menuLabel:

                        quickMenuLabel.trim() ||

                        null,

                      slug:

                        quickSlug.trim(),

                      seoTitle:

                        quickSeoTitle.trim() ||

                        null,

                      metaDescription:

                        quickMetaDescription.trim() ||

                        null,

                      focusKeyword:

                        quickFocusKeyword.trim() ||

                        null,

                      status:

                        quickStatus,

                      updatedAt:

                        new Date().toISOString(),

                    }

                  : page

            )

        );



        setQuickMessage(

          "Page updated successfully."

        );



        setQuickMessageType(

          "success"

        );



        setTimeout(() => {

          setQuickEditPage(null);

        }, 700);

      } catch (err) {

        console.error(

          "QUICK EDIT ERROR:",

          err

        );



        setQuickMessage(

          err instanceof Error

            ? err.message

            : "Something went wrong while updating the page."

        );



        setQuickMessageType(

          "error"

        );

      } finally {

        setQuickSaving(false);

      }

    };



  /* =======================================================

     LOADING

  ======================================================= */



  if (loading) {

    return (

      <div className="flex min-h-[240px] items-center justify-center">

        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">

          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />

          Loading pages...

        </div>

      </div>

    );

  }



  /* =======================================================

     UI

  ======================================================= */



  return (

    <div className="w-full bg-[#f5f7fb]">



      <style jsx>{`

        @keyframes pagesFadeUp {

          from {

            opacity: 0;

            transform: translateY(7px);

          }



          to {

            opacity: 1;

            transform: translateY(0);

          }

        }



        @keyframes quickEditIn {

          from {

            opacity: 0;

            transform: translateY(12px) scale(0.98);

          }



          to {

            opacity: 1;

            transform: translateY(0) scale(1);

          }

        }

      `}</style>



      <div className="w-full">



        {/* =================================================

            COMPACT PREMIUM HEADER

        ================================================= */}



        <div

          className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"

          style={{

            animation:

              "pagesFadeUp .45s ease both",

          }}

        >

          <div>

            <div className="flex items-center gap-2.5">



              {/* Icon */}

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-[0_6px_18px_rgba(37,99,235,0.20)]">

                <Icon

                  name="page"

                  className="h-[17px] w-[17px]"

                />

              </div>



              <div>



                <div className="flex items-center gap-2">



                  <h1 className="text-[24px] font-bold leading-none tracking-[-0.03em] text-slate-950">

                    Pages

                  </h1>



                  <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-blue-600">

                    CMS

                  </span>



                </div>



                <p className="mt-1 text-[11px] font-medium text-slate-400">

                  Content Management

                </p>



              </div>

            </div>

          </div>



          <Link

            href="/admin/pages/new"

            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-xs font-bold text-white shadow-[0_5px_16px_rgba(15,23,42,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-[0_7px_20px_rgba(37,99,235,0.22)]"

          >

            <span className="text-base leading-none">

              +

            </span>



            Add New Page

          </Link>

        </div>



        {/* =================================================
            STATUS NAVIGATION
        ================================================= */}

        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">

          <button
            type="button"
            onClick={() => {
              setFilter("all");
              setAppliedFilters((current) => ({
                ...current,
                filter: "all",
              }));
            }}
            className={`group relative overflow-hidden rounded-xl border bg-white px-4 py-3 text-left shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)] ${
              appliedFilters.filter === "all"
                ? "border-blue-200 ring-1 ring-blue-100"
                : "border-slate-200/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">All</p>
                <p className="mt-0.5 text-[21px] font-bold leading-6 tracking-tight text-slate-900">{allCount}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shadow-sm">
                <Icon name="page" className="h-4 w-4" />
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setFilter("published");
              setAppliedFilters((current) => ({
                ...current,
                filter: "published",
              }));
            }}
            className={`group relative overflow-hidden rounded-xl border bg-white px-4 py-3 text-left shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)] ${
              appliedFilters.filter === "published"
                ? "border-emerald-200 ring-1 ring-emerald-100"
                : "border-slate-200/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Published</p>
                <p className="mt-0.5 text-[21px] font-bold leading-6 tracking-tight text-slate-900">{publishedCount}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shadow-sm">
                <Icon name="check" className="h-4 w-4" />
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setFilter("draft");
              setAppliedFilters((current) => ({
                ...current,
                filter: "draft",
              }));
            }}
            className={`group relative overflow-hidden rounded-xl border bg-white px-4 py-3 text-left shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)] ${
              appliedFilters.filter === "draft"
                ? "border-amber-200 ring-1 ring-amber-100"
                : "border-slate-200/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Drafts</p>
                <p className="mt-0.5 text-[21px] font-bold leading-6 tracking-tight text-slate-900">{draftCount}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 shadow-sm">
                <Icon name="draft" className="h-4 w-4" />
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setFilter("trash");
              setAppliedFilters((current) => ({
                ...current,
                filter: "trash",
              }));
            }}
            className={`group relative overflow-hidden rounded-xl border bg-white px-4 py-3 text-left shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)] ${
              appliedFilters.filter === "trash"
                ? "border-red-200 ring-1 ring-red-100"
                : "border-slate-200/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Trash</p>
                <p className="mt-0.5 text-[21px] font-bold leading-6 tracking-tight text-slate-900">{trashCount}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 shadow-sm">
                <Icon name="trash" className="h-4 w-4" />
              </div>
            </div>
          </button>

        </div>



        {/* =================================================

            ERROR

        ================================================= */}



        {error && (

          <div className="mb-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">



            <span>

              <strong>Error:</strong>{" "}

              {error}

            </span>



            <button

              type="button"

              onClick={() =>

                window.location.reload()

              }

              className="font-bold underline underline-offset-2"

            >

              Retry

            </button>



          </div>

        )}



        {/* =================================================

            FILTER BAR

        ================================================= */}



        <section

          className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.035)]"

          style={{

            animation:

              "pagesFadeUp .45s ease both",

            animationDelay: "200ms",

          }}

        >



          <div className="p-4">



            {/* STATUS + SEARCH */}



            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">



              {/* SEARCH */}



              <div className="relative w-full lg:w-[270px]">



                <Icon

                  name="search"

                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"

                />



                <input

                  type="text"

                  value={search}

                  onChange={(e) =>

                    setSearch(

                      e.target.value

                    )

                  }

                  placeholder="Search pages..."

                  className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-xs font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"

                />



              </div>



            </div>



            {/* ADVANCED FILTERS */}



            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">



              <select

                value={dateFilter}

                onChange={(e) =>

                  setDateFilter(

                    e.target.value as DateFilter

                  )

                }

                className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

              >

                <option value="all">

                  All dates

                </option>



                <option value="today">

                  Today

                </option>



                <option value="week">

                  This week

                </option>



                <option value="month">

                  This month

                </option>



                <option value="last-month">

                  Last month

                </option>

              </select>



              <select

                value={seoFilter}

                onChange={(e) =>

                  setSeoFilter(

                    e.target.value as SeoFilter

                  )

                }

                className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

              >

                <option value="all">

                  All SEO

                </option>



                <option value="complete">

                  SEO Complete

                </option>



                <option value="missing">

                  SEO Missing

                </option>

              </select>



              <select

                value={sort}

                onChange={(e) =>

                  setSort(

                    e.target.value as SortType

                  )

                }

                className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

              >

                <option value="newest">

                  Newest first

                </option>



                <option value="oldest">

                  Oldest first

                </option>



                <option value="updated">

                  Recently updated

                </option>



                <option value="title-asc">

                  Title A–Z

                </option>



                <option value="title-desc">

                  Title Z–A

                </option>

              </select>



              <button

                type="button"

                onClick={

                  handleApplyFilters

                }

                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700"

              >

                <Icon

                  name="filter"

                  className="h-3.5 w-3.5"

                />



                Apply Filters

              </button>



            </div>



            {/* FILTER FOOTER */}



            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">



              <p className="text-[11px] text-slate-500">

                Showing{" "}

                <span className="font-semibold text-slate-800">

                  {filteredPages.length}

                </span>{" "}

                of{" "}

                <span className="font-semibold text-slate-800">

                  {allCount}

                </span>{" "}

                pages

              </p>



              <button

                type="button"

                onClick={

                  handleResetFilters

                }

                className="text-[11px] font-semibold text-slate-500 transition hover:text-blue-600"

              >

                Reset filters

              </button>



            </div>



          </div>

        </section>



        {/* =================================================

            PAGES TABLE

        ================================================= */}



        <section

          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.035)]"

          style={{

            animation:

              "pagesFadeUp .45s ease both",

            animationDelay: "260ms",

          }}

        >



          <div className="overflow-x-auto">



            <table className="w-full min-w-[850px]">



              {/* HEADER */}



              <thead>

                <tr className="border-b border-slate-200 bg-slate-50/70">



                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">

                    Page

                  </th>



                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">

                    Status

                  </th>



                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">

                    Author

                  </th>



                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">

                    Created

                  </th>



                </tr>

              </thead>



              {/* BODY */}



              <tbody className="divide-y divide-slate-100">



                {/* EMPTY */}



                {filteredPages.length === 0 && (

                  <tr>

                    <td

                      colSpan={4}

                      className="px-6 py-14 text-center"

                    >

                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">

                        <Icon

                          name="page"

                          className="h-5 w-5"

                        />

                      </div>



                      <p className="mt-3 text-sm font-semibold text-slate-800">

                        No pages found

                      </p>



                      <p className="mt-1 text-xs text-slate-500">

                        Try changing your filters or search.

                      </p>

                    </td>

                  </tr>

                )}



                {/* PAGES */}



                {filteredPages.map(

                  (page) => (

                    <tr

                      key={page.id}

                      className="transition hover:bg-slate-50/60"

                    >



                      {/* PAGE */}



                      <td className="px-6 py-5">



                        <div>



                          {/* PAGE TITLE */}



                          <Link

                            href={`/admin/pages/${page.id}/edit`} 

                            className=" text-[15px] blocks font-bold leading-8 tracking-tight text-slate-950 transition hover:text-blue-600" 

                          >

                            {page.title}

                          </Link>



                                                   {/* ACTIONS */}

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            {filter === "trash" ? (
                              <>
                                <button
                                  type="button"
                                  disabled={restoringId === page.id}
                                  onClick={() => handleRestore(page.id)}
                                  className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-700 disabled:opacity-50"
                                >
                                  {restoringId === page.id
                                    ? "Restoring..."
                                    : "Restore"}
                                </button>

                                <span className="text-slate-300">|</span>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPermanentDeleteId(page.id);
                                    setPermanentDeleteError("");
                                  }}
                                  className="text-xs font-semibold text-red-600 transition hover:text-red-700"
                                >
                                  Delete Permanently
                                </button>
                              </>
                            ) : (
                              <>
                                <Link
                                  href={`/admin/pages/${page.id}/edit`}
                                  className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                                >
                                  Edit
                                </Link>

                                <span className="text-slate-300">|</span>

                                <button
                                  type="button"
                                  onClick={() => openQuickEdit(page)}
                                  className="text-xs font-semibold text-slate-600 transition hover:text-blue-600"
                                >
                                  Quick Edit
                                </button>

                                <span className="text-slate-300">|</span>

                                <button
                                  type="button"
                                  title="Move to Trash"
                                  onClick={() => {
                                    setDeleteId(page.id);
                                    setDeleteError("");
                                  }}
                                  className="inline-flex items-center justify-center text-red-500 transition hover:text-red-700"
                                >
                                  <Icon
                                    name="trash"
                                    className="h-[15px] w-[15px]"
                                  />
                                </button>

                                <span className="text-slate-300">|</span>

                                <Link
                                  href={`/${page.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
                                >
                                  View
                                  <Icon
                                    name="external"
                                    className="h-3 w-3"
                                  />
                                </Link>
                              </>
                            )}
                          </div>



                          {/* SLUG */}



                          <code className="mt-2 inline-block rounded-md bg-slate-50 px-2 py-1 text-[11px] text-slate-500">

                            /{page.slug}

                          </code>



                        </div>



                      </td>



                      {/* STATUS */}



                      <td className="px-6 py-5">



                        <span

                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${

                            page.status === "published"
                              ? "bg-emerald-50 text-emerald-700"
                              : page.status === "trash"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"

                          }`}

                        >

                          {page.status === "published"
                            ? "Published"
                            : page.status === "trash"
                              ? "Trash"
                              : "Draft"}

                        </span>



                      </td>



                      {/* AUTHOR */}



                      <td className="px-6 py-5">



                        <span className="text-sm font-medium text-slate-700">

                          {page.author ||

                            "Admin"}

                        </span>



                      </td>



                      {/* CREATED */}



                      <td className="px-6 py-5 text-sm text-slate-500">



                        {new Date(

                          page.createdAt

                        ).toLocaleDateString()}



                      </td>



                    </tr>

                  )

                )}



              </tbody>

            </table>

          </div>

        </section>



      </div>



      {/* =====================================================

          QUICK EDIT MODAL

      ===================================================== */}



      {quickEditPage && (

        <div

          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"

          onMouseDown={(e) => {

            if (

              e.target ===

              e.currentTarget

            ) {

              closeQuickEdit();

            }

          }}

        >



          <div

            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"

            style={{

              animation:

                "quickEditIn .2s ease both",

            }}

          >



            {/* MODAL HEADER */}



            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">



              <div>



                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">

                  Quick Edit

                </p>



                <h2 className="mt-1 text-xl font-bold text-slate-900">

                  Edit Page Settings

                </h2>



                <p className="mt-1 text-xs text-slate-500">

                  Update the page settings.

                </p>



              </div>



              <button

                type="button"

                onClick={

                  closeQuickEdit

                }

                disabled={quickSaving}

                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"

              >

                <Icon

                  name="close"

                  className="h-4 w-4"

                />

              </button>



            </div>



            {/* MODAL BODY */}



            <div className="space-y-5 px-6 py-6">



              {quickMessage && (

                <div

                  className={`rounded-lg border px-4 py-3 text-sm ${

                    quickMessageType ===

                    "success"

                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"

                      : "border-red-200 bg-red-50 text-red-700"

                  }`}

                >

                  {quickMessage}

                </div>

              )}



              {/* TITLE */}



              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-800">

                  Page Title

                </label>



                <input

                  type="text"

                  value={quickTitle}

                  onChange={(e) =>

                    setQuickTitle(

                      e.target.value

                    )

                  }

                  className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

                />

              </div>



              {/* MENU LABEL */}



              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-800">

                  Menu Label

                </label>



                <input

                  type="text"

                  value={quickMenuLabel}

                  onChange={(e) =>

                    setQuickMenuLabel(

                      e.target.value

                    )

                  }

                  placeholder={

                    quickTitle ||

                    "Page title"

                  }

                  className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

                />



                <p className="mt-1.5 text-xs text-slate-400">

                  Leave empty to use Page Title.

                </p>

              </div>



              {/* SLUG */}



              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-800">

                  Slug

                </label>



                <input

                  type="text"

                  value={quickSlug}

                  onChange={(e) =>

                    setQuickSlug(

                      e.target.value

                    )

                  }

                  className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

                />

              </div>



              {/* SEO */}



              <div className="border-t border-slate-200 pt-5">



                <h3 className="text-base font-bold text-slate-900">

                  SEO

                </h3>



                <div className="mt-4 space-y-4">



                  {/* SEO TITLE */}



                  <div>



                    <label className="mb-2 block text-sm font-semibold text-slate-800">

                      SEO Title

                    </label>



                    <input

                      type="text"

                      value={

                        quickSeoTitle

                      }

                      onChange={(e) =>

                        setQuickSeoTitle(

                          e.target.value

                        )

                      }

                      maxLength={60}

                      className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

                    />



                    <p className="mt-1 text-right text-xs text-slate-400">

                      {

                        quickSeoTitle.length

                      }

                      /60

                    </p>



                  </div>



                  {/* META */}



                  <div>



                    <label className="mb-2 block text-sm font-semibold text-slate-800">

                      Meta Description

                    </label>



                    <textarea

                      value={

                        quickMetaDescription

                      }

                      onChange={(e) =>

                        setQuickMetaDescription(

                          e.target.value

                        )

                      }

                      maxLength={160}

                      rows={3}

                      className="w-full resize-none rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

                    />



                    <p className="mt-1 text-right text-xs text-slate-400">

                      {

                        quickMetaDescription.length

                      }

                      /160

                    </p>



                  </div>



                  {/* FOCUS KEYWORD */}



                  <div>



                    <label className="mb-2 block text-sm font-semibold text-slate-800">

                      Focus Keyword

                    </label>



                    <input

                      type="text"

                      value={

                        quickFocusKeyword

                      }

                      onChange={(e) =>

                        setQuickFocusKeyword(

                          e.target.value

                        )

                      }

                      className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

                    />



                  </div>



                </div>

              </div>



              {/* STATUS */}



              <div className="border-t border-slate-200 pt-5">



                <label className="mb-2 block text-sm font-semibold text-slate-800">

                  Status

                </label>



                <select

                  value={quickStatus}

                  onChange={(e) =>

                    setQuickStatus(

                      e.target.value

                    )

                  }

                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

                >

                  <option value="draft">

                    Draft

                  </option>



                  <option value="published">

                    Published

                  </option>

                </select>



              </div>



            </div>



            {/* MODAL FOOTER */}



            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-end">



              <button

                type="button"

                onClick={

                  closeQuickEdit

                }

                disabled={quickSaving}

                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"

              >

                Cancel

              </button>



              <button

                type="button"

                onClick={

                  handleQuickUpdate

                }

                disabled={quickSaving}

                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"

              >

                {quickSaving

                  ? "Updating..."

                  : "Update Page"}

              </button>



            </div>



          </div>

        </div>

      )}



      {/* =====================================================

          DELETE MODAL

      ===================================================== */}



      {deleteId !== null && (

        <div

          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]"

          onMouseDown={(e) => {

            if (

              e.target ===

                e.currentTarget &&

              !deleting

            ) {

              setDeleteId(null);

              setDeleteError("");

            }

          }}

        >



          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">



            <h3 className="text-lg font-bold text-slate-900">

              Move to Trash?

            </h3>



            <p className="mt-2 text-sm leading-6 text-slate-500">

              Are you sure you want to move{" "}

              <span className="font-semibold text-slate-800">

                {selectedPage?.title}

              </span>

              ? This page will be moved to Trash. You can restore it later.

            </p>



            {deleteError && (

              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                {deleteError}

              </div>

            )}



            <div className="mt-6 flex justify-end gap-3">



              <button

                type="button"

                disabled={deleting}

                onClick={() => {

                  setDeleteId(null);

                  setDeleteError("");

                }}

                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"

              >

                Cancel

              </button>



              <button

                type="button"

                disabled={deleting}

                onClick={

                  handleDelete

                }

                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"

              >

                {deleting
                  ? "Moving..."
                  : "Move to Trash"}

              </button>



            </div>



          </div>

        </div>

      )}

      {/* =====================================================
          PERMANENT DELETE MODAL
      ===================================================== */}

      {permanentDeleteId !== null && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !permanentlyDeleting
            ) {
              setPermanentDeleteId(null);
              setPermanentDeleteError("");
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              Delete Permanently?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-slate-800">
                {
                  trashPages.find(
                    (page) => page.id === permanentDeleteId
                  )?.title
                }
              </span>
              ? This cannot be undone.
            </p>

            {permanentDeleteError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {permanentDeleteError}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={permanentlyDeleting}
                onClick={() => {
                  setPermanentDeleteId(null);
                  setPermanentDeleteError("");
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={permanentlyDeleting}
                onClick={handlePermanentDelete}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {permanentlyDeleting
                  ? "Deleting..."
                  : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  );

}