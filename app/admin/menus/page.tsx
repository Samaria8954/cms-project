"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type Page = {
  id: number;
  title: string;
  slug: string;
  status?: string;
};

type Menu = {
  id: number;
  name: string;
  location: string | null;
};

type MenuItem = {
  id: number;
  menuId: number;
  title: string;
  type: string;
  url: string | null;
  pageId: number | null;
  parentId: number | null;
  sortOrder: number;
  status: string;
  megaMenu: boolean;
  page?: Page | null;
};

/* =========================================================
   ICON
========================================================= */

function Icon({
  name,
  size = 18,
}: {
  name:
    | "menu"
    | "search"
    | "plus"
    | "save"
    | "edit"
    | "trash"
    | "grip"
    | "chevron"
    | "close"
    | "check"
    | "layers"
    | "link"
    | "location"
    | "external"
    | "home"
    | "settings";
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );

    case "save":
      return (
        <svg {...common}>
          <path d="M5 4h12l2 2v14H5z" />
          <path d="M8 4v6h8V4" />
          <path d="M8 20v-6h8v6" />
        </svg>
      );

    case "edit":
      return (
        <svg {...common}>
          <path d="M4 20h4l11-11-4-4L4 16z" />
          <path d="m13 6 4 4" />
        </svg>
      );

    case "trash":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M10 11v5" />
          <path d="M14 11v5" />
          <path d="M6 7l1 13h10l1-13" />
          <path d="M9 7V4h6v3" />
        </svg>
      );

    case "grip":
      return (
        <svg {...common}>
          <circle cx="8" cy="6" r="1" fill="currentColor" />
          <circle cx="16" cy="6" r="1" fill="currentColor" />
          <circle cx="8" cy="12" r="1" fill="currentColor" />
          <circle cx="16" cy="12" r="1" fill="currentColor" />
          <circle cx="8" cy="18" r="1" fill="currentColor" />
          <circle cx="16" cy="18" r="1" fill="currentColor" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...common}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "layers":
      return (
        <svg {...common}>
          <path d="m12 3 8 4-8 4-8-4z" />
          <path d="m4 12 8 4 8-4" />
          <path d="m4 17 8 4 8-4" />
        </svg>
      );

    case "link":
      return (
        <svg {...common}>
          <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
          <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 7 20l1.1-1.1" />
        </svg>
      );

    case "location":
      return (
        <svg {...common}>
          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.3" />
        </svg>
      );

    case "external":
      return (
        <svg {...common}>
          <path d="M14 5h5v5" />
          <path d="m19 5-8 8" />
          <path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </svg>
      );

    case "home":
      return (
        <svg {...common}>
          <path d="m4 11 8-7 8 7" />
          <path d="M6 10v9h12v-9" />
          <path d="M10 19v-5h4v5" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.4v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L8 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6.7v-2.4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L8 8.6l1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h2.4v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1Z" />
        </svg>
      );

    default:
      return null;
  }
}

/* =========================================================
   STYLES
========================================================= */

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[14px] text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

const buttonPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 text-[13px] font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50";

const buttonSecondary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-[13px] font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50";

/* =========================================================
   MAIN PAGE
========================================================= */

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);

  const [selectedMenuId, setSelectedMenuId] =
    useState<number | null>(null);

  const [menuName, setMenuName] = useState("");
  const [menuLocation, setMenuLocation] = useState("");

  const [selectedPageIds, setSelectedPageIds] =
    useState<number[]>([]);

  const [pageSearch, setPageSearch] = useState("");

  const [editingItem, setEditingItem] =
    useState<MenuItem | null>(null);

  const [draggedItem, setDraggedItem] =
    useState<MenuItem | null>(null);

  /* =======================================================
     NEW:
     OPEN/CLOSE PARENT MENUS
  ======================================================= */

  const [expandedItems, setExpandedItems] =
    useState<Set<number>>(new Set());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =======================================================
     LOAD MENU ITEMS
  ======================================================= */

  const loadMenuItems = useCallback(
    async (menuId: number) => {
      try {
        const response = await fetch(
          `/api/menu-items?menuId=${menuId}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to load menu items."
          );
        }

        const loadedItems: MenuItem[] =
          Array.isArray(data) ? data : [];

        setItems(loadedItems);

        /* -----------------------------------------------
           Parent menus default OPEN
        ------------------------------------------------ */

        const parentIds = loadedItems
          .filter((item) =>
            loadedItems.some(
              (child) =>
                child.parentId === item.id
            )
          )
          .map((item) => item.id);

        setExpandedItems(
          new Set(parentIds)
        );
      } catch (err) {
        console.error(
          "LOAD MENU ITEMS ERROR:",
          err
        );

        setItems([]);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load menu items."
        );
      }
    },
    []
  );

  /* =======================================================
     LOAD MENUS
  ======================================================= */

  const loadMenus = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/menus",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to load menus."
        );
      }

      const menuData: Menu[] =
        Array.isArray(data) ? data : [];

      setMenus(menuData);

      if (menuData.length > 0) {
        const firstMenu = menuData[0];

        setSelectedMenuId(
          firstMenu.id
        );

        setMenuName(
          firstMenu.name
        );

        setMenuLocation(
          firstMenu.location || ""
        );

        await loadMenuItems(
          firstMenu.id
        );
      } else {
        setSelectedMenuId(null);
        setItems([]);
      }
    } catch (err) {
      console.error(
        "LOAD MENUS ERROR:",
        err
      );

      setMenus([]);
      setItems([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load menus."
      );
    }
  }, [loadMenuItems]);

  /* =======================================================
     LOAD PAGES
  ======================================================= */

  const loadPages = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/pages",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to load pages."
        );
      }

      setPages(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "LOAD PAGES ERROR:",
        err
      );

      setPages([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load pages."
      );
    }
  }, []);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      await Promise.all([
        loadMenus(),
        loadPages(),
      ]);

      setLoading(false);
    };

    initialize();
  }, [loadMenus, loadPages]);

  /* =======================================================
     PAGE TITLE
  ======================================================= */

  useEffect(() => {
    document.title = "Menus";
  }, []);

  /* =======================================================
     SELECT MENU
  ======================================================= */

  const handleMenuChange = async (
    menuId: number
  ) => {
    const menu = menus.find(
      (item) =>
        item.id === menuId
    );

    setSelectedMenuId(menuId);

    setMenuName(
      menu?.name || ""
    );

    setMenuLocation(
      menu?.location || ""
    );

    setSelectedPageIds([]);
    setEditingItem(null);

    setError("");
    setSuccess("");

    await loadMenuItems(menuId);
  };

  /* =======================================================
     TOGGLE PARENT DROPDOWN
  ======================================================= */

  const toggleExpanded = (
    itemId: number
  ) => {
    setExpandedItems((current) => {
      const next = new Set(current);

      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }

      return next;
    });
  };

  /* =======================================================
     EXPAND ALL
  ======================================================= */

  const expandAll = () => {
    const parentIds = items
      .filter((item) =>
        items.some(
          (child) =>
            child.parentId === item.id
        )
      )
      .map((item) => item.id);

    setExpandedItems(
      new Set(parentIds)
    );
  };

  /* =======================================================
     COLLAPSE ALL
  ======================================================= */

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  /* =======================================================
     ADDED PAGE IDS
  ======================================================= */

  const addedPageIds = useMemo(() => {
    return new Set(
      items
        .filter(
          (item) =>
            item.pageId !== null
        )
        .map(
          (item) =>
            item.pageId as number
        )
    );
  }, [items]);

  /* =======================================================
     FILTER PAGES
  ======================================================= */

  const filteredPages = useMemo(() => {
    const search =
      pageSearch
        .trim()
        .toLowerCase();

    if (!search) {
      return pages;
    }

    return pages.filter((page) =>
      page.title
        .toLowerCase()
        .includes(search)
    );
  }, [pages, pageSearch]);

  /* =======================================================
     TOGGLE PAGE
  ======================================================= */

  const togglePage = (
    pageId: number
  ) => {
    setSelectedPageIds(
      (current) =>
        current.includes(pageId)
          ? current.filter(
              (id) =>
                id !== pageId
            )
          : [
              ...current,
              pageId,
            ]
    );
  };

  /* =======================================================
     SELECT ALL
  ======================================================= */

  const selectAllPages = () => {
    const availableIds =
      filteredPages
        .filter(
          (page) =>
            !addedPageIds.has(
              page.id
            )
        )
        .map(
          (page) => page.id
        );

    setSelectedPageIds(
      availableIds
    );
  };

  /* =======================================================
     CLEAR
  ======================================================= */

  const clearSelection = () => {
    setSelectedPageIds([]);
  };

  /* =======================================================
     ADD SELECTED PAGES
  ======================================================= */

  const addSelectedPages =
    async () => {
      if (!selectedMenuId) {
        setError(
          "Please select a menu."
        );
        return;
      }

      if (
        selectedPageIds.length ===
        0
      ) {
        setError(
          "Please select at least one page."
        );
        return;
      }

      setSaving(true);
      setError("");
      setSuccess("");

      try {
        let added = 0;

        for (const pageId of selectedPageIds) {
          const page =
            pages.find(
              (item) =>
                item.id === pageId
            );

          if (!page) continue;

          const response =
            await fetch(
              "/api/menu-items",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  menuId:
                    selectedMenuId,
                  title:
                    page.title,
                  type: "page",
                  url: `/${page.slug}`,
                  pageId:
                    page.id,
                  parentId: null,
                  sortOrder:
                    items.length +
                    added,
                  status: "active",
                  megaMenu: false,
                }),
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data?.error ||
                `Failed to add ${page.title}.`
            );
          }

          added++;
        }

        setSelectedPageIds([]);

        setSuccess(
          `${added} page${
            added === 1
              ? ""
              : "s"
          } added successfully.`
        );

        await loadMenuItems(
          selectedMenuId
        );
      } catch (err) {
        console.error(
          "ADD MENU ITEMS ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to add pages."
        );
      } finally {
        setSaving(false);
      }
    };

  /* =======================================================
     OPEN EDIT
  ======================================================= */

  const openEdit = (
    item: MenuItem
  ) => {
    setEditingItem({
      ...item,
    });

    setError("");
    setSuccess("");
  };

  /* =======================================================
     SAVE ITEM
  ======================================================= */

  const saveItem = async () => {
    if (
      !selectedMenuId ||
      !editingItem
    ) {
      return;
    }

    const title =
      editingItem.title.trim();

    if (!title) {
      setError(
        "Title is required."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/menus/${selectedMenuId}/items/${editingItem.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              title,
              url:
                editingItem.url?.trim() ||
                null,
              pageId:
                editingItem.pageId,
              parentId:
                editingItem.parentId,
              sortOrder:
                editingItem.sortOrder,
              status:
                editingItem.status,
              megaMenu:
                editingItem.megaMenu,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to update menu item."
        );
      }

      setEditingItem(null);

      await loadMenuItems(
        selectedMenuId
      );

      setSuccess(
        "Menu item updated successfully."
      );
    } catch (err) {
      console.error(
        "UPDATE MENU ITEM ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update menu item."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE ITEM
  ======================================================= */

  const deleteItem = async (
    itemId: number
  ) => {
    if (!selectedMenuId) {
      setError(
        "Please select a menu."
      );
      return;
    }

    const item =
      items.find(
        (menuItem) =>
          menuItem.id === itemId
      );

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${item?.title || "this menu item"}"?`
      );

    if (!confirmed) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/menus/${selectedMenuId}/items/${itemId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to delete menu item."
        );
      }

      if (
        editingItem?.id ===
        itemId
      ) {
        setEditingItem(null);
      }

      await loadMenuItems(
        selectedMenuId
      );

      setSuccess(
        data?.message ||
          "Menu item deleted successfully."
      );
    } catch (err) {
      console.error(
        "DELETE MENU ITEM ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete menu item."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     UPDATE MENU
  ======================================================= */

  const updateMenu = async () => {
    if (!selectedMenuId)
      return;

    if (!menuName.trim()) {
      setError(
        "Menu name is required."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/menus/${selectedMenuId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name:
                menuName.trim(),
              location:
                menuLocation.trim() ||
                null,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to update menu."
        );
      }

      setSuccess(
        "Menu updated successfully."
      );

      await loadMenus();
    } catch (err) {
      console.error(
        "UPDATE MENU ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update menu."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DRAG START
  ======================================================= */

  const handleDragStart = (
    item: MenuItem
  ) => {
    setDraggedItem(item);
  };

  /* =======================================================
     DRAG END
  ======================================================= */

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  /* =======================================================
     DROP ITEM
  ======================================================= */

  const moveItem = async (
    dragged: MenuItem,
    target: MenuItem
  ) => {
    if (!selectedMenuId)
      return;

    if (
      dragged.id ===
      target.id
    ) {
      return;
    }

    if (
      isDescendant(
        target.id,
        dragged.id,
        items
      )
    ) {
      setError(
        "An item cannot be placed inside its own child."
      );

      setDraggedItem(null);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/menus/${selectedMenuId}/items/${dragged.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              title:
                dragged.title,
              url:
                dragged.url,
              pageId:
                dragged.pageId,
              parentId:
                target.id,
              sortOrder: 0,
              status:
                dragged.status,
              megaMenu:
                dragged.megaMenu,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to move item."
        );
      }

      /*
       * Automatically open target parent
       * after an item is dropped inside it.
       */
      setExpandedItems(
        (current) => {
          const next =
            new Set(current);

          next.add(target.id);

          return next;
        }
      );

      setSuccess(
        `"${dragged.title}" moved under "${target.title}".`
      );

      await loadMenuItems(
        selectedMenuId
      );
    } catch (err) {
      console.error(
        "MOVE ITEM ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to move item."
      );
    } finally {
      setSaving(false);
      setDraggedItem(null);
    }
  };

  /* =======================================================
     MAKE TOP LEVEL
  ======================================================= */

  const makeTopLevel = async (
    item: MenuItem
  ) => {
    if (!selectedMenuId)
      return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/menus/${selectedMenuId}/items/${item.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              title: item.title,
              url: item.url,
              pageId: item.pageId,
              parentId: null,
              sortOrder:
                items.length,
              status: item.status,
              megaMenu:
                item.megaMenu,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to move item."
        );
      }

      setSuccess(
        `"${item.title}" moved to top level.`
      );

      await loadMenuItems(
        selectedMenuId
      );
    } catch (err) {
      console.error(
        "TOP LEVEL ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to move item."
      );
    } finally {
      setSaving(false);
      setDraggedItem(null);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-pulse rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 shadow-lg shadow-blue-500/20" />

            <div className="absolute inset-0 flex items-center justify-center text-white">
              <Icon
                name="menu"
                size={22}
              />
            </div>
          </div>

          <div className="text-sm font-medium text-slate-500">
            Loading menus...
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      <style jsx global>{`
        @keyframes menuFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes menuModalIn {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes menuShine {
          0% {
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(120%);
          }
        }

        @keyframes childrenOpen {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .menu-page-wrapper {
          animation: menuFadeIn 0.35s ease-out;
        }

        .menu-page-row {
          animation: menuFadeIn 0.3s ease-out both;
        }

        .menu-modal {
          animation: menuModalIn 0.25s ease-out;
        }

        .menu-children-open {
          animation: childrenOpen 0.22s ease-out;
        }

        .menu-shine {
          position: relative;
          overflow: hidden;
        }

        .menu-shine::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 40%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.18),
            transparent
          );
          transform: translateX(-120%);
          pointer-events: none;
        }

        .menu-shine:hover::after {
          animation: menuShine 0.8s ease;
        }

        .menu-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .menu-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .menu-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }

        .menu-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <div className="menu-page-wrapper relative mx-auto max-w-[1440px] space-y-6 overflow-hidden pb-8">

        {/* BACKGROUND */}
        <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="pointer-events-none absolute -left-32 top-[420px] h-80 w-80 rounded-full bg-violet-400/10 blur-3xl" />

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="menu-shine flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:rotate-2">
              <Icon
                name="menu"
                size={22}
              />
            </div>

            <div>
              <h1 className="text-[27px] font-bold tracking-tight text-slate-900">
                Menus
              </h1>

              <p className="mt-0.5 text-[13px] text-slate-500">
                Manage your website navigation and menu structure.
              </p>
            </div>

          </div>

          {menus.length > 0 && (
            <div className="flex items-center gap-3">

              <span className="hidden text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:block">
                Active Menu
              </span>

              <div className="relative">

                <select
                  value={
                    selectedMenuId ??
                    ""
                  }
                  onChange={(e) => {
                    const id =
                      Number(
                        e.target.value
                      );

                    if (id) {
                      handleMenuChange(
                        id
                      );
                    }
                  }}
                  className="h-11 min-w-[220px] appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-11 text-[14px] font-semibold text-slate-700 shadow-sm outline-none transition-all duration-200 hover:border-blue-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  {menus.map(
                    (menu) => (
                      <option
                        key={menu.id}
                        value={menu.id}
                      >
                        {menu.name}
                      </option>
                    )
                  )}
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400">
                  <Icon
                    name="chevron"
                    size={15}
                  />
                </span>

              </div>

            </div>
          )}

        </div>

        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 px-4 py-3.5 text-[13px] text-red-700 shadow-sm">

            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
              !
            </div>

            <span className="flex-1 pt-0.5">
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-700"
            >
              <Icon
                name="close"
                size={15}
              />
            </button>

          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3.5 text-[13px] text-emerald-700 shadow-sm">

            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Icon
                name="check"
                size={14}
              />
            </div>

            <span className="flex-1 pt-0.5">
              {success}
            </span>

            <button
              type="button"
              onClick={() =>
                setSuccess("")
              }
              className="rounded-lg p-1 text-emerald-400 transition hover:bg-emerald-100 hover:text-emerald-700"
            >
              <Icon
                name="close"
                size={15}
              />
            </button>

          </div>
        )}

        {/* =================================================
            NO MENUS
        ================================================= */}

        {!selectedMenuId ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 text-blue-500 shadow-inner">
              <Icon
                name="menu"
                size={27}
              />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-800">
              No menus available
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create a menu first to start building your website navigation.
            </p>

          </div>
        ) : (
          <>
            {/* =================================================
                MENU SETTINGS
            ================================================= */}

            <section className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(37,99,235,0.10)]">

              <div className="absolute right-0 top-0 h-1 w-1/3 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
                  <Icon
                    name="settings"
                    size={18}
                  />
                </div>

                <div>
                  <h2 className="text-[15px] font-bold text-slate-800">
                    Menu Settings
                  </h2>

                  <p className="mt-0.5 text-[12px] text-slate-500">
                    Update the name and display location.
                  </p>
                </div>

              </div>

              <div className="grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">

                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    Menu Name
                  </label>

                  <input
                    value={menuName}
                    onChange={(e) =>
                      setMenuName(
                        e.target.value
                      )
                    }
                    className={inputClass}
                    placeholder="Main Navigation"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    Location
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Icon
                        name="location"
                        size={16}
                      />
                    </span>

                    <input
                      value={
                        menuLocation
                      }
                      onChange={(e) =>
                        setMenuLocation(
                          e.target.value
                        )
                      }
                      placeholder="header"
                      className={`${inputClass} pl-10`}
                    />

                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    updateMenu
                  }
                  disabled={saving}
                  className={`${buttonPrimary} menu-shine md:px-6`}
                >
                  <Icon
                    name="save"
                    size={16}
                  />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>
            </section>

            {/* =================================================
                BUILDER
            ================================================= */}

            <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">

              {/* =================================================
                  LEFT — ADD ITEMS
              ================================================= */}

              <section className="group flex min-h-[650px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">

                <div className="relative border-b border-slate-100 px-5 py-4">

                  <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500" />

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20">
                      <Icon
                        name="plus"
                        size={19}
                      />
                    </div>

                    <div>
                      <h2 className="text-[15px] font-bold text-slate-800">
                        Add Menu Items
                      </h2>

                      <p className="mt-0.5 text-[12px] text-slate-500">
                        Select pages to add to this menu.
                      </p>
                    </div>

                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">

                  <div className="relative">

                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Icon
                        name="search"
                        size={17}
                      />
                    </span>

                    <input
                      type="text"
                      value={pageSearch}
                      onChange={(e) =>
                        setPageSearch(
                          e.target.value
                        )
                      }
                      placeholder="Search pages..."
                      className={`${inputClass} pl-10`}
                    />

                  </div>

                  <div className="mt-4 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <button
                        type="button"
                        onClick={
                          selectAllPages
                        }
                        className="rounded-lg px-2 py-1.5 text-[12px] font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        Select all
                      </button>

                      <span className="text-slate-300">
                        /
                      </span>

                      <button
                        type="button"
                        onClick={
                          clearSelection
                        }
                        className="rounded-lg px-2 py-1.5 text-[12px] font-medium text-slate-500 transition hover:bg-slate-100"
                      >
                        Clear
                      </button>

                    </div>

                    <span className="rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 text-[11px] font-bold text-blue-600">
                      {
                        selectedPageIds.length
                      }{" "}
                      selected
                    </span>

                  </div>

                  <div className="menu-scroll mt-4 max-h-[430px] flex-1 space-y-2 overflow-y-auto pr-1">

                    {filteredPages.map(
                      (page) => {
                        const alreadyAdded =
                          addedPageIds.has(
                            page.id
                          );

                        const checked =
                          selectedPageIds.includes(
                            page.id
                          );

                        return (
                          <label
                            key={
                              page.id
                            }
                            className={`menu-page-row group flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition-all duration-200 ${
                              alreadyAdded
                                ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-60"
                                : checked
                                ? "border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm"
                                : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-md"
                            }`}
                          >

                            <input
                              type="checkbox"
                              checked={
                                checked
                              }
                              disabled={
                                alreadyAdded
                              }
                              onChange={() =>
                                togglePage(
                                  page.id
                                )
                              }
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500">
                              <Icon
                                name="home"
                                size={16}
                              />
                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="truncate text-[14px] font-semibold text-slate-700">
                                {
                                  page.title
                                }
                              </div>

                              <div className="mt-1 truncate text-[11px] text-slate-400">
                                /
                                {
                                  page.slug
                                }
                              </div>

                            </div>

                            {alreadyAdded ? (
                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                                Added
                              </span>
                            ) : checked ? (
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                                <Icon
                                  name="check"
                                  size={12}
                                />
                              </span>
                            ) : null}

                          </label>
                        );
                      }
                    )}

                    {filteredPages.length ===
                      0 && (
                      <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-slate-400">
                          <Icon
                            name="search"
                            size={19}
                          />
                        </div>

                        <p className="mt-3 text-[13px] font-semibold text-slate-500">
                          No pages found
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          Try another search term.
                        </p>

                      </div>
                    )}

                  </div>

                  <button
                    type="button"
                    onClick={
                      addSelectedPages
                    }
                    disabled={
                      saving ||
                      selectedPageIds.length ===
                        0
                    }
                    className={`${buttonPrimary} menu-shine mt-4 w-full`}
                  >
                    <Icon
                      name="plus"
                      size={17}
                    />

                    {saving
                      ? "Adding..."
                      : selectedPageIds.length
                      ? `Add Selected (${selectedPageIds.length})`
                      : "Add Selected"}
                  </button>

                </div>
              </section>

              {/* =================================================
                  RIGHT — MENU STRUCTURE
              ================================================= */}

              <section className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">

                <div className="relative flex items-center justify-between border-b border-slate-100 px-5 py-4">

                  <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-500/20">
                      <Icon
                        name="layers"
                        size={19}
                      />
                    </div>

                    <div>
                      <h2 className="text-[15px] font-bold text-slate-800">
                        Menu Structure
                      </h2>

                      <p className="mt-0.5 text-[12px] text-slate-500">
                        Manage your navigation hierarchy.
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-2">

                    <button
                      type="button"
                      onClick={
                        expandAll
                      }
                      className="hidden rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-blue-600 transition hover:bg-blue-50 sm:block"
                    >
                      Expand All
                    </button>

                    <button
                      type="button"
                      onClick={
                        collapseAll
                      }
                      className="hidden rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-100 sm:block"
                    >
                      Collapse All
                    </button>

                    <span className="rounded-full bg-gradient-to-r from-violet-50 to-fuchsia-50 px-3 py-1.5 text-[11px] font-bold text-violet-600">
                      {items.length}{" "}
                      {items.length ===
                      1
                        ? "item"
                        : "items"}
                    </span>

                  </div>

                </div>

                <div className="p-5">

                  {/* TOP LEVEL DROP */}

                  <div
                    onDragOver={(e) =>
                      e.preventDefault()
                    }
                    onDrop={() => {
                      if (
                        draggedItem
                      ) {
                        makeTopLevel(
                          draggedItem
                        );
                      }
                    }}
                    className="group mb-4 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30 px-4 py-4 text-[12px] font-medium text-slate-400 transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/70 hover:text-blue-600"
                  >

                    <Icon
                      name="layers"
                      size={16}
                    />

                    Drop here to make an item top-level

                  </div>

                  {/* ITEMS */}

                  {items.length ===
                  0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-20 text-center">

                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 text-violet-500">
                        <Icon
                          name="menu"
                          size={27}
                        />
                      </div>

                      <h3 className="mt-5 text-[15px] font-bold text-slate-700">
                        No menu items yet
                      </h3>

                      <p className="mx-auto mt-2 max-w-sm text-[12px] leading-5 text-slate-400">
                        Select pages from the left panel and add them to this menu.
                      </p>

                    </div>
                  ) : (
                    <div className="space-y-2.5">

                      {items
                        .filter(
                          (item) =>
                            item.parentId ===
                            null
                        )
                        .sort(
                          (a, b) =>
                            a.sortOrder -
                            b.sortOrder
                        )
                        .map(
                          (item) => (
                            <MenuItemRow
                              key={
                                item.id
                              }
                              item={
                                item
                              }
                              items={
                                items
                              }
                              draggedItem={
                                draggedItem
                              }
                              expandedItems={
                                expandedItems
                              }
                              onToggle={
                                toggleExpanded
                              }
                              onDragStart={
                                handleDragStart
                              }
                              onDragEnd={
                                handleDragEnd
                              }
                              onDrop={
                                moveItem
                              }
                              onEdit={
                                openEdit
                              }
                              onDelete={
                                deleteItem
                              }
                            />
                          )
                        )}

                    </div>
                  )}

                </div>
              </section>

            </div>
          </>
        )}

        {/* =================================================
            EDIT MODAL
        ================================================= */}

        {editingItem && (
          <EditItemModal
            item={
              editingItem
            }
            items={items}
            saving={saving}
            onChange={
              setEditingItem
            }
            onClose={() =>
              setEditingItem(null)
            }
            onSave={
              saveItem
            }
          />
        )}

      </div>
    </>
  );
}

/* =========================================================
   MENU ITEM ROW
   WITH OPEN / CLOSE DROPDOWN
========================================================= */

function MenuItemRow({
  item,
  items,
  draggedItem,
  expandedItems,
  onToggle,
  onDragStart,
  onDragEnd,
  onDrop,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  items: MenuItem[];
  draggedItem: MenuItem | null;
  expandedItems: Set<number>;
  onToggle: (
    id: number
  ) => void;
  onDragStart: (
    item: MenuItem
  ) => void;
  onDragEnd: () => void;
  onDrop: (
    dragged: MenuItem,
    target: MenuItem
  ) => void;
  onEdit: (
    item: MenuItem
  ) => void;
  onDelete: (
    id: number
  ) => void;
}) {
  const children =
    items
      .filter(
        (child) =>
          child.parentId ===
          item.id
      )
      .sort(
        (a, b) =>
          a.sortOrder -
          b.sortOrder
      );

  const hasChildren =
    children.length > 0;

  const isExpanded =
    expandedItems.has(
      item.id
    );

  const isDragging =
    draggedItem?.id ===
    item.id;

  return (
    <div className="menu-page-row">

      {/* =================================================
          MAIN ITEM
      ================================================= */}

      <div
        draggable
        onDragStart={() =>
          onDragStart(item)
        }
        onDragEnd={
          onDragEnd
        }
        onDragOver={(e) =>
          e.preventDefault()
        }
        onDrop={(e) => {
          e.stopPropagation();

          if (
            draggedItem &&
            draggedItem.id !==
              item.id
          ) {
            onDrop(
              draggedItem,
              item
            );
          }
        }}
        className={`group flex min-h-[72px] items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-all duration-250 ${
          isDragging
            ? "scale-[0.98] border-blue-300 bg-blue-50/60 opacity-40"
            : "border-slate-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-gradient-to-r hover:from-white hover:to-blue-50/40 hover:shadow-lg hover:shadow-blue-500/5"
        }`}
      >

        {/* =================================================
            DROPDOWN ARROW
        ================================================= */}

        <div className="flex w-7 shrink-0 items-center justify-center">

          {hasChildren ? (
            <button
              type="button"
              draggable={false}
              onMouseDown={(e) =>
                e.stopPropagation()
              }
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                onToggle(
                  item.id
                );
              }}
              title={
                isExpanded
                  ? "Collapse submenu"
                  : "Expand submenu"
              }
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-blue-100 hover:text-blue-600 ${
                isExpanded
                  ? "bg-blue-50 text-blue-600"
                  : ""
              }`}
            >
              <span
                className={`transition-transform duration-300 ${
                  isExpanded
                    ? "rotate-90"
                    : "rotate-0"
                }`}
              >
                <Icon
                  name="chevron"
                  size={15}
                />
              </span>
            </button>
          ) : (
            <span className="block h-7 w-7" />
          )}

        </div>

        {/* =================================================
            DRAG HANDLE
        ================================================= */}

        <div
          className="flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-all duration-200 hover:scale-105 hover:bg-blue-100 hover:text-blue-600 active:cursor-grabbing"
          title="Drag to move"
        >
          <Icon
            name="grip"
            size={16}
          />
        </div>

        {/* =================================================
            ITEM ICON
        ================================================= */}

        <div
          className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-all duration-200 group-hover:scale-105 sm:flex ${
            item.type ===
            "page"
              ? "bg-gradient-to-br from-blue-500 to-cyan-500"
              : "bg-gradient-to-br from-violet-500 to-fuchsia-500"
          }`}
        >
          <Icon
            name={
              item.type ===
              "page"
                ? "home"
                : "link"
            }
            size={17}
          />
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <span className="truncate text-[14px] font-bold text-slate-800 transition-colors group-hover:text-blue-700">
              {item.title}
            </span>

            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold capitalize text-slate-500">
              {item.type}
            </span>

            {hasChildren && (
              <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">
                {children.length}{" "}
                {children.length ===
                1
                  ? "child"
                  : "children"}
              </span>
            )}

            {item.megaMenu && (
              <span className="rounded-full bg-gradient-to-r from-violet-50 to-fuchsia-50 px-2 py-1 text-[10px] font-bold text-violet-600">
                Mega Menu
              </span>
            )}

            <span
              className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                item.status ===
                "active"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {item.status ===
              "active"
                ? "Active"
                : "Inactive"}
            </span>

          </div>

          <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[11px] text-slate-400">

            <Icon
              name="link"
              size={11}
            />

            <span className="truncate">
              {item.url || "#"}
            </span>

          </div>

        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="flex shrink-0 items-center gap-1">

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(item);
            }}
            onMouseDown={(e) =>
              e.stopPropagation()
            }
            draggable={false}
            title="Edit"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-blue-100 hover:text-blue-600"
          >
            <Icon
              name="edit"
              size={15}
            />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(
                item.id
              );
            }}
            onMouseDown={(e) =>
              e.stopPropagation()
            }
            draggable={false}
            title="Delete"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-red-100 hover:text-red-600"
          >
            <Icon
              name="trash"
              size={15}
            />
          </button>

        </div>

      </div>

      {/* =================================================
          CHILDREN
          ONLY RENDER WHEN OPEN
      ================================================= */}

      {hasChildren &&
        isExpanded && (
          <div className="menu-children-open ml-7 mt-2 space-y-2 border-l-2 border-slate-200 pl-4">

            {children.map(
              (child) => (
                <MenuItemRow
                  key={
                    child.id
                  }
                  item={
                    child
                  }
                  items={
                    items
                  }
                  draggedItem={
                    draggedItem
                  }
                  expandedItems={
                    expandedItems
                  }
                  onToggle={
                    onToggle
                  }
                  onDragStart={
                    onDragStart
                  }
                  onDragEnd={
                    onDragEnd
                  }
                  onDrop={
                    onDrop
                  }
                  onEdit={
                    onEdit
                  }
                  onDelete={
                    onDelete
                  }
                />
              )
            )}

          </div>
        )}

    </div>
  );
}

/* =========================================================
   EDIT MODAL
========================================================= */

function EditItemModal({
  item,
  items,
  saving,
  onChange,
  onClose,
  onSave,
}: {
  item: MenuItem;
  items: MenuItem[];
  saving: boolean;
  onChange: (
    item: MenuItem
  ) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const possibleParents =
    items.filter(
      (candidate) =>
        candidate.id !==
          item.id &&
        !isDescendant(
          candidate.id,
          item.id,
          items
        )
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-md">

      <div className="menu-modal w-full max-w-[540px] overflow-hidden rounded-2xl border border-white/60 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.25)]">

        {/* HEADER */}

        <div className="relative flex items-center justify-between border-b border-slate-100 px-6 py-5">

          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Icon
                name="edit"
                size={18}
              />
            </div>

            <div>
              <h2 className="text-[16px] font-bold text-slate-800">
                Edit Menu Item
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Update navigation item settings.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:rotate-90 hover:bg-slate-100 hover:text-slate-700"
          >
            <Icon
              name="close"
              size={17}
            />
          </button>

        </div>

        {/* BODY */}

        <div className="space-y-5 p-6">

          {/* TITLE */}

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
              Title
            </label>

            <input
              value={
                item.title
              }
              onChange={(e) =>
                onChange({
                  ...item,
                  title:
                    e.target
                      .value,
                })
              }
              className={
                inputClass
              }
              autoFocus
            />
          </div>

          {/* URL */}

          <div>

            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
              URL
            </label>

            <div className="relative">

              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon
                  name="link"
                  size={16}
                />
              </span>

              <input
                value={
                  item.url ||
                  ""
                }
                onChange={(e) =>
                  onChange({
                    ...item,
                    url:
                      e.target
                        .value,
                  })
                }
                className={`${inputClass} pl-10`}
                placeholder="/about"
              />

            </div>

          </div>

          {/* PARENT */}

          <div>

            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
              Parent Item
            </label>

            <select
              value={
                item.parentId ??
                ""
              }
              onChange={(e) =>
                onChange({
                  ...item,
                  parentId:
                    e.target
                      .value
                      ? Number(
                          e.target
                            .value
                        )
                      : null,
                })
              }
              className={
                inputClass
              }
            >

              <option value="">
                Top Level
              </option>

              {possibleParents.map(
                (parent) => (
                  <option
                    key={
                      parent.id
                    }
                    value={
                      parent.id
                    }
                  >
                    {parent.title}
                  </option>
                )
              )}

            </select>

          </div>

          {/* STATUS + TYPE */}

          <div className="grid gap-4 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                Status
              </label>

              <select
                value={
                  item.status
                }
                onChange={(e) =>
                  onChange({
                    ...item,
                    status:
                      e.target
                        .value,
                  })
                }
                className={
                  inputClass
                }
              >

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>

              </select>

            </div>

            <div>

              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                Type
              </label>

              <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/40 px-3.5 text-[13px] font-semibold capitalize text-slate-600">
                {
                  item.type
                }
              </div>

            </div>

          </div>

          {/* MEGA MENU */}

          <label
            className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-4 transition-all duration-200 ${
              item.megaMenu
                ? "border-violet-200 bg-gradient-to-r from-violet-50 to-fuchsia-50 shadow-sm"
                : "border-slate-200 bg-slate-50/60 hover:border-violet-200 hover:bg-violet-50/40"
            }`}
          >

            <div>

              <div className="text-[13px] font-bold text-slate-700">
                Enable Mega Menu
              </div>

              <div className="mt-1 text-[11px] text-slate-400">
                Use a larger dropdown layout for this item.
              </div>

            </div>

            <span
              className={`relative flex h-6 w-11 items-center rounded-full p-1 transition-all duration-300 ${
                item.megaMenu
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  : "bg-slate-300"
              }`}
            >

              <input
                type="checkbox"
                checked={
                  item.megaMenu
                }
                onChange={(e) =>
                  onChange({
                    ...item,
                    megaMenu:
                      e.target
                        .checked,
                  })
                }
                className="sr-only"
              />

              <span
                className={`h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  item.megaMenu
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />

            </span>

          </label>

        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30 px-6 py-4">

          <button
            type="button"
            onClick={
              onClose
            }
            className={
              buttonSecondary
            }
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              onSave
            }
            disabled={
              saving
            }
            className={`${buttonPrimary} menu-shine`}
          >

            <Icon
              name="save"
              size={15}
            />

            {saving
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   CHECK DESCENDANT
========================================================= */

function isDescendant(
  possibleChildId: number,
  parentId: number,
  items: MenuItem[]
): boolean {
  const children =
    items.filter(
      (item) =>
        item.parentId ===
        parentId
    );

  for (const child of children) {

    if (
      child.id ===
      possibleChildId
    ) {
      return true;
    }

    if (
      isDescendant(
        possibleChildId,
        child.id,
        items
      )
    ) {
      return true;
    }

  }

  return false;
}