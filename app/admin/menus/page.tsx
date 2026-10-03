"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
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

type PendingMenuChange = {
  id: number;
  parentId: number | null;
  sortOrder: number;
};

type TrashItem = MenuItem;

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
    | "settings"
    | "restore";
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

    case "restore":
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v6h6" />
          <path d="M12 8v4l3 2" />
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

  const [pendingChanges, setPendingChanges] =
    useState<PendingMenuChange[]>([]);

  const [pendingNewItems, setPendingNewItems] =
    useState<MenuItem[]>([]);

  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [pendingTrashIds, setPendingTrashIds] = useState<number[]>([]);
  const [pendingPermanentDeleteIds, setPendingPermanentDeleteIds] = useState<number[]>([]);
  const [trashOpen, setTrashOpen] = useState(false);

  const [dropAction, setDropAction] = useState<{
    dragged: MenuItem;
    target: MenuItem;
  } | null>(null);

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
        setPendingChanges([]);
            setTrashItems([]);
        setPendingTrashIds([]);
        setPendingPermanentDeleteIds([]);
        setTrashOpen(false);

        /* -----------------------------------------------
           All menu items start collapsed.
           User can expand any parent manually.
        ------------------------------------------------ */

        setExpandedItems(new Set());
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
     ADD SELECTED PAGES — LOCAL DRAFT ONLY
  ======================================================= */

  const addSelectedPages = () => {
    if (!selectedMenuId) {
      setError(
        "Please select a menu."
      );
      return;
    }

    if (selectedPageIds.length === 0) {
      setError(
        "Please select at least one page."
      );
      return;
    }

    const selectedPages = selectedPageIds
      .map((pageId) => pages.find((page) => page.id === pageId))
      .filter(Boolean) as Page[];

    const startingSort =
      items.length > 0
        ? Math.max(...items.map((item) => item.sortOrder)) + 1
        : 0;

    const draftItems = selectedPages.map((page, index) => ({
      id: -(Date.now() + index + 1),
      menuId: selectedMenuId,
      title: page.title,
      type: "page",
      url: `/${page.slug}`,
      pageId: page.id,
      parentId: null,
      sortOrder: startingSort + index,
      status: "active",
      megaMenu: false,
      page,
    }));

    setItems((current) => [...current, ...draftItems]);
    setPendingNewItems((current) => [...current, ...draftItems]);
    setSelectedPageIds([]);
    setSuccess(
      `${draftItems.length} page${draftItems.length === 1 ? "" : "s"} added to the draft. Click Save Changes to persist them.`
    );
    setError("");
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
     SAVE ITEM — LOCAL DRAFT ONLY
  ======================================================= */

  const saveItem = () => {
    if (!editingItem) {
      return;
    }

    const title = editingItem.title.trim();

    if (!title) {
      setError("Title is required.");
      return;
    }

    const updatedItem: MenuItem = {
      ...editingItem,
      title,
      url: editingItem.url?.trim() || null,
    };

    setItems((current) =>
      current.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );

    if (updatedItem.id < 0) {
      setPendingNewItems((current) =>
        current.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );
    } else {
      setPendingChanges((current) => {
        const existing = current.find((change) => change.id === updatedItem.id);
        const change = {
          id: updatedItem.id,
          parentId: updatedItem.parentId,
          sortOrder: updatedItem.sortOrder,
        };

        return existing
          ? current.map((item) => item.id === updatedItem.id ? change : item)
          : [...current, change];
      });
    }

    setEditingItem(null);
    setError("");
    setSuccess(
      `"${updatedItem.title}" updated in the draft. Click Save Changes to persist it.`
    );
  };

  /* =======================================================
     MOVE ITEM TO TRASH — LOCAL ONLY
  ======================================================= */

  const deleteItem = (itemId: number) => {
    const item = items.find((x) => x.id === itemId);
    if (!item) return;

    const subtree: MenuItem[] = [];
    const collect = (id: number) => {
      const current = items.find((x) => x.id === id);
      if (!current) return;
      subtree.push(current);
      items.filter((x) => x.parentId === id).forEach((x) => collect(x.id));
    };
    collect(itemId);

    const confirmed = window.confirm(
      subtree.length > 1
        ? `Move "${item.title}" and its ${subtree.length - 1} child item(s) to Trash?`
        : `Move "${item.title}" to Trash?`
    );
    if (!confirmed) return;

    const ids = new Set(subtree.map((x) => x.id));
    setItems((current) => current.filter((x) => !ids.has(x.id)));
    setTrashItems((current) => [
      ...current.filter((x) => !ids.has(x.id)),
      ...subtree,
    ]);
    if (item.id > 0) {
      setPendingTrashIds((current) =>
        current.includes(item.id) ? current : [...current, item.id]
      );
    }
    setExpandedItems((current) => {
      const next = new Set(current);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    setSuccess("Item moved to Trash in the draft. Click Save Changes to persist it.");
  };

  const restoreTrashItem = (itemId: number) => {
    const item = trashItems.find((x) => x.id === itemId);
    if (!item) return;

    const subtree: TrashItem[] = [];
    const collect = (id: number) => {
      const current = trashItems.find((x) => x.id === id);
      if (!current) return;
      subtree.push(current);
      trashItems.filter((x) => x.parentId === id).forEach((x) => collect(x.id));
    };
    collect(itemId);

    const ids = new Set(subtree.map((x) => x.id));
    setTrashItems((current) => current.filter((x) => !ids.has(x.id)));
    setItems((current) => [
      ...current,
      ...subtree,
    ]);
    setPendingTrashIds((current) => current.filter((id) => !ids.has(id)));
    setPendingPermanentDeleteIds((current) => current.filter((id) => !ids.has(id)));
    setSuccess("Item restored in the draft. Click Save Changes to persist it.");
  };

  const permanentlyDeleteTrashItem = (itemId: number) => {
    const item = trashItems.find((x) => x.id === itemId);
    if (!item) return;
    if (!window.confirm(`Permanently delete "${item.title}"? This cannot be undone.`)) return;

    const ids = new Set<number>();
    const collect = (id: number) => {
      ids.add(id);
      trashItems.filter((x) => x.parentId === id).forEach((x) => collect(x.id));
    };
    collect(itemId);

    setTrashItems((current) => current.filter((x) => !ids.has(x.id)));
    setPendingTrashIds((current) => current.filter((id) => !ids.has(id)));
    setPendingPermanentDeleteIds((current) => {
      const next = current.filter((id) => !ids.has(id));
      ids.forEach((id) => {
        if (id > 0 && !next.includes(id)) next.push(id);
      });
      return next;
    });
    setSuccess("Item removed from Trash in the draft. Save Changes to persist it.");
  };

  /* =======================================================
     UPDATE MENU
  ======================================================= */

  const updateMenu = async () => {
    if (!selectedMenuId) return;

    if (!menuName.trim()) {
      setError("Menu name is required.");
      return;
    }

    await saveMenuStructureChanges();
  };

  /* =======================================================
     DRAG START
  ======================================================= */

  const handleDragStart = (
    item: MenuItem
  ) => {
    setDraggedItem(item);
    setError("");
  };

  /* =======================================================
     DRAG END
  ======================================================= */

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  /* =======================================================
     APPLY LOCAL STRUCTURE CHANGE
     UI changes immediately; DB is NOT touched here.
  ======================================================= */

  const applyLocalChange = (
    id: number,
    parentId: number | null,
    sortOrder: number
  ) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              parentId,
              sortOrder,
            }
          : item
      )
    );

    setPendingChanges((current) => {
      const existing = current.find(
        (change) => change.id === id
      );

      if (existing) {
        return current.map((change) =>
          change.id === id
            ? {
                ...change,
                parentId,
                sortOrder,
              }
            : change
        );
      }

      return [
        ...current,
        {
          id,
          parentId,
          sortOrder,
        },
      ];
    });
  };

  /* =======================================================
     DROP ITEM
     Opens placement dialog only.
  ======================================================= */

  const moveItem = (
    dragged: MenuItem,
    target: MenuItem
  ) => {
    if (!selectedMenuId) {
      return;
    }

    if (dragged.id === target.id) {
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

    setError("");
    setSuccess("");

    setDropAction({
      dragged,
      target,
    });

    setDraggedItem(null);
  };

  /* =======================================================
     MAKE CHILD
     LOCAL UI ONLY
  ======================================================= */

  const makeChild = (
    dragged: MenuItem,
    target: MenuItem
  ) => {
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
      setDropAction(null);
      return;
    }

    const children = items.filter(
      (item) =>
        item.parentId === target.id &&
        item.id !== dragged.id
    );

    const nextSortOrder =
      children.length > 0
        ? Math.max(
            ...children.map(
              (item) => item.sortOrder
            )
          ) + 1
        : 0;

    applyLocalChange(
      dragged.id,
      target.id,
      nextSortOrder
    );

    setExpandedItems((current) => {
      const next = new Set(current);
      next.add(target.id);
      return next;
    });

    setDropAction(null);

    setSuccess(
      `"${dragged.title}" placed inside "${target.title}". Click Save Changes to save it.`
    );
  };

  /* =======================================================
     SWAP POSITION
     LOCAL UI ONLY
  ======================================================= */

  const swapPosition = (
    dragged: MenuItem,
    target: MenuItem
  ) => {
    applyLocalChange(
      dragged.id,
      target.parentId,
      target.sortOrder
    );

    applyLocalChange(
      target.id,
      dragged.parentId,
      dragged.sortOrder
    );

    setDropAction(null);

    setSuccess(
      `"${dragged.title}" and "${target.title}" positions swapped. Click Save Changes to save it.`
    );
  };

  /* =======================================================
     MAKE TOP LEVEL
     LOCAL UI ONLY
  ======================================================= */

  const makeTopLevel = (
    item: MenuItem
  ) => {
    const topLevelItems = items.filter(
      (currentItem) =>
        currentItem.parentId === null &&
        currentItem.id !== item.id
    );

    const nextSortOrder =
      topLevelItems.length > 0
        ? Math.max(
            ...topLevelItems.map(
              (currentItem) =>
                currentItem.sortOrder
            )
          ) + 1
        : 0;

    applyLocalChange(
      item.id,
      null,
      nextSortOrder
    );

    setSuccess(
      `"${item.title}" moved to top level. Click Save Changes to save it.`
    );
  };

  /* =======================================================
     SAVE STRUCTURE CHANGES TO DATABASE
  ======================================================= */

  const saveMenuStructureChanges = async () => {
    if (!selectedMenuId) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // One request persists the entire draft: menu settings, new items,
      // structure edits, soft deletes, and permanent deletes.
      const response = await fetch(
        `/api/menus/${selectedMenuId}/items/bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            menu: {
              name: menuName.trim(),
              location: menuLocation.trim() || null,
            },

            // Use the current draft items rather than the original
            // pendingNewItems array so drag/drop and edits made to new
            // items are also included.
            newItems: items
              .filter((item) => item.id < 0)
              .map((item) => ({
                clientId: item.id,
                title: item.title,
                type: item.type,
                url: item.url,
                pageId: item.pageId,
                parentId: item.parentId,
                sortOrder: item.sortOrder,
                status: item.status,
                megaMenu: item.megaMenu,
              })),

            changes: pendingChanges
              .filter((change) => change.id > 0)
              .map((change) => {
                const item = items.find(
                  (currentItem) => currentItem.id === change.id
                );

                return {
                  id: change.id,
                  title: item?.title,
                  url: item?.url,
                  pageId: item?.pageId,
                  parentId: change.parentId,
                  sortOrder: change.sortOrder,
                  status: item?.status,
                  megaMenu: item?.megaMenu,
                };
              }),

            trashIds: pendingTrashIds.filter((id) => id > 0),
            permanentDeleteIds: pendingPermanentDeleteIds.filter(
              (id) => id > 0
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to save menu changes."
        );
      }

      setPendingChanges([]);
        setPendingTrashIds([]);
      setPendingPermanentDeleteIds([]);
      setTrashItems([]);
      setDropAction(null);

      // Refresh once after the single bulk transaction completes.
      await loadMenuItems(selectedMenuId);

      setSuccess(
        "Menu changes saved successfully."
      );
    } catch (err) {
      console.error("SAVE MENU STRUCTURE ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save menu changes."
      );
    } finally {
      setSaving(false);
      setDraggedItem(null);
    }
  };

  /* =======================================================
     DISCARD STRUCTURE CHANGES
  ======================================================= */

  const discardMenuStructureChanges =
    async () => {
      if (!selectedMenuId) {
        return;
      }

      const confirmed = window.confirm(
        "Discard all unsaved menu structure changes?"
      );

      if (!confirmed) {
        return;
      }

      setSaving(true);
      setError("");
      setSuccess("");
      setDropAction(null);
      setPendingChanges([]);
        setPendingTrashIds([]);
      setPendingPermanentDeleteIds([]);
      setTrashItems([]);

      const selectedMenu = menus.find(
        (menu) => menu.id === selectedMenuId
      );

      setMenuName(selectedMenu?.name || "");
      setMenuLocation(selectedMenu?.location || "");

      await loadMenuItems(
        selectedMenuId
      );

      setSaving(false);
      setSuccess(
        "Unsaved menu structure changes discarded."
      );
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

                <div className="flex items-center justify-end gap-2 whitespace-nowrap md:gap-2">

                  <button
                    type="button"
                    onClick={() => setTrashOpen((v) => !v)}
                    disabled={saving}
                    className={`inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3 text-[12px] font-semibold transition ${
                      trashOpen
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    <Icon name="trash" size={14} />
                    Trash
                    {trashItems.length > 0 && (
                      <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-600">
                        {trashItems.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={
                      discardMenuStructureChanges
                    }
                    disabled={saving}
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 text-[12px] font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Discard
                  </button>

                  <button
                    type="button"
                    onClick={
                      updateMenu
                    }
                    disabled={saving}
                    className={`${buttonPrimary} menu-shine inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 text-[12px] font-semibold`}
                  >
                    <Icon
                      name="save"
                      size={14}
                    />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

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

                {trashOpen && (
                  <TrashPanel
                    items={trashItems}
                    onRestore={restoreTrashItem}
                    onPermanentDelete={permanentlyDeleteTrashItem}
                    onClose={() => setTrashOpen(false)}
                  />
                )}

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
            DROP ACTION MODAL
        ================================================= */}

        {dropAction && (
          <DropActionModal
            dragged={dropAction.dragged}
            target={dropAction.target}
            onMakeChild={() =>
              makeChild(
                dropAction.dragged,
                dropAction.target
              )
            }
            onSwap={() =>
              swapPosition(
                dropAction.dragged,
                dropAction.target
              )
            }
            onClose={() =>
              setDropAction(null)
            }
          />
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
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", String(item.id));
          onDragStart(item);
        }}
        onDragEnd={onDragEnd}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const id = Number(e.dataTransfer.getData("text/plain"));
          const dragged = draggedItem?.id === id
            ? draggedItem
            : items.find((x) => x.id === id);
          if (dragged && dragged.id !== item.id) onDrop(dragged, item);
        }}
        className={`group flex min-h-[72px] w-full min-w-0 flex-wrap items-center gap-2.5 rounded-xl border bg-white px-3 py-3 transition-all duration-200 ${
          isDragging
            ? "scale-[0.98] border-blue-400 bg-blue-50/70 opacity-50 shadow-lg"
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

        <div className="flex min-w-0 flex-1 items-center gap-2">

          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">

            <span className="min-w-0 break-words text-[14px] font-bold leading-5 text-slate-800 transition-colors group-hover:text-blue-700">
              {item.title}
            </span>

            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold capitalize text-slate-500">
              {item.type}
            </span>

            {hasChildren && (
              <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">
                {children.length}{" "}
                {children.length === 1 ? "child" : "children"}
              </span>
            )}

            {item.megaMenu && (
              <span className="shrink-0 rounded-full bg-gradient-to-r from-violet-50 to-fuchsia-50 px-2 py-1 text-[10px] font-bold text-violet-600">
                Mega Menu
              </span>
            )}

            <span
              className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                item.status === "active"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {item.status === "active" ? "Active" : "Inactive"}
            </span>

            <span className="flex min-w-0 max-w-full items-center gap-1.5 break-all text-[11px] text-slate-400">
              <Icon name="link" size={11} />
              <span className="break-all">{item.url || "#"}</span>
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

/* =========================================================
   TRASH PANEL
========================================================= */

function TrashPanel({
  items,
  onRestore,
  onPermanentDelete,
  onClose,
}: {
  items: TrashItem[];
  onRestore: (id: number) => void;
  onPermanentDelete: (id: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="border-b border-slate-100 bg-gradient-to-br from-red-50/70 via-white to-rose-50/40 px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <Icon name="trash" size={17} />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-slate-800">Trash</h3>
            <p className="text-[10px] text-slate-500">Deleted items stay here until you restore or permanently remove them.</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-700">
          <Icon name="close" size={15} />
        </button>
      </div>

      {!items.length ? (
        <div className="mt-3 rounded-xl border border-dashed border-red-200 bg-white/70 px-4 py-6 text-center text-[11px] text-slate-400">
          Trash is empty.
        </div>
      ) : (
        <div className="mt-3 grid gap-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl border border-red-100 bg-white px-3 py-2.5 shadow-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <Icon name="trash" size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-semibold text-slate-700">{item.title}</div>
                <div className="mt-0.5 text-[9px] text-slate-400">{item.type} • {item.url || "Menu item"}</div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button type="button" onClick={() => onRestore(item.id)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 text-[10px] font-bold text-emerald-600 hover:bg-emerald-100">
                  <Icon name="restore" size={13} /> Restore
                </button>
                <button type="button" onClick={() => onPermanentDelete(item.id)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 text-[10px] font-bold text-red-600 hover:bg-red-100">
                  <Icon name="trash" size={13} /> Delete Permanently
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DROP ACTION MODAL
========================================================= */

function DropActionModal({
  dragged,
  target,
  onMakeChild,
  onSwap,
  onClose,
}: {
  dragged: MenuItem;
  target: MenuItem;
  onMakeChild: () => void;
  onSwap: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="menu-modal w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="relative border-b border-slate-100 px-6 py-5">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <Icon name="layers" size={17} />
                </div>

                <h2 className="text-lg font-bold text-slate-800">
                  Place Menu Item
                </h2>
              </div>

              <p className="mt-2 text-[12px] leading-5 text-slate-500">
                Choose how you want to place the dragged item.
                The change will appear in the menu immediately,
                but the database will only be updated after
                you click Save Changes.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-3 p-6">
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-blue-500">
              Dragged Item
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <Icon name="menu" size={16} />
              </div>

              <div className="min-w-0">
                <div className="truncate text-[14px] font-semibold text-slate-800">
                  {dragged.title}
                </div>
                <div className="mt-0.5 truncate text-[11px] text-slate-400">
                  {dragged.url || "Menu item"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center text-slate-300">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white">
              ↓
            </span>
          </div>

          <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-3.5">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-violet-500">
              Dropped On
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                <Icon name="layers" size={16} />
              </div>

              <div className="min-w-0">
                <div className="truncate text-[14px] font-semibold text-slate-800">
                  {target.title}
                </div>
                <div className="mt-0.5 truncate text-[11px] text-slate-400">
                  {target.url || "Menu item"}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={onMakeChild}
              className="group rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Icon name="chevron" size={18} />
                </div>

                <div>
                  <div className="text-[13px] font-bold text-slate-800">
                    Make Child
                  </div>
                  <div className="mt-0.5 text-[10px] leading-4 text-slate-500">
                    Put the dragged item inside the target.
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={onSwap}
              className="group rounded-xl border border-violet-200 bg-violet-50/50 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
                  <Icon name="layers" size={18} />
                </div>

                <div>
                  <div className="text-[13px] font-bold text-slate-800">
                    Swap Position
                  </div>
                  <div className="mt-0.5 text-[10px] leading-4 text-slate-500">
                    Exchange their current positions.
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}