"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Page = {
  id: number;
  title: string;
  slug: string;
  status: string;
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

type Menu = {
  id: number;
  name?: string;
  location?: string | null;
  items?: MenuItem[];
};

export default function EditMenuPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [menu, setMenu] = useState<Menu | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [pages, setPages] = useState<Page[]>([]);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("page");
  const [url, setUrl] = useState("");
  const [pageId, setPageId] = useState("");
  const [parentId, setParentId] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [status, setStatus] = useState("active");
  const [megaMenu, setMegaMenu] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * LOAD DATA
   *
   * Important:
   * State updates are inside the async function.
   * This avoids the react-hooks/set-state-in-effect error.
   */
  useEffect(() => {
    if (!Number.isInteger(id) || id <= 0) {
      return;
    }

    let cancelled = false;

    const loadData = async () => {
      try {
        const [menusResponse, pagesResponse] = await Promise.all([
          fetch("/api/menus", {
            cache: "no-store",
          }),

          fetch("/api/pages", {
            cache: "no-store",
          }),
        ]);

        const menusData = await menusResponse.json();
        const pagesData = await pagesResponse.json();

        if (!menusResponse.ok) {
          throw new Error(
            menusData?.error || "Failed to load menu items."
          );
        }

        if (!pagesResponse.ok) {
          throw new Error(
            pagesData?.error || "Failed to load pages."
          );
        }

        if (cancelled) {
          return;
        }

        /*
         * /api/menus returns menu items.
         * Find the item being edited using the URL id.
         */
        const allItems: MenuItem[] = Array.isArray(menusData)
          ? menusData
          : [];

        const currentItem = allItems.find(
          (item) => Number(item.id) === id
        );

        if (!currentItem) {
          setError("Menu item not found.");
          setLoading(false);
          return;
        }

        const availablePages: Page[] = Array.isArray(pagesData)
          ? pagesData
          : [];

        setItems(allItems);
        setPages(availablePages);

        setMenu({
          id: currentItem.menuId,
          items: allItems,
        });

        setTitle(currentItem.title || "");
        setType(currentItem.type || "page");
        setUrl(currentItem.url || "");
        setPageId(
          currentItem.pageId !== null &&
          currentItem.pageId !== undefined
            ? String(currentItem.pageId)
            : ""
        );

        setParentId(
          currentItem.parentId !== null &&
          currentItem.parentId !== undefined
            ? String(currentItem.parentId)
            : ""
        );

        setSortOrder(String(currentItem.sortOrder ?? 0));
        setStatus(currentItem.status || "active");
        setMegaMenu(Boolean(currentItem.megaMenu));

        setLoading(false);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error("LOAD MENU ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load menu item."
        );

        setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  /*
   * UPDATE MENU ITEM
   */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Menu item title is required.");
      return;
    }

    if (type === "page" && !pageId) {
      setError("Please select a page.");
      return;
    }

    if (type === "custom" && !url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/menus/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: title.trim(),

          url:
            type === "custom"
              ? url.trim()
              : null,

          pageId:
            type === "page"
              ? Number(pageId)
              : null,

          parentId:
            parentId
              ? Number(parentId)
              : null,

          sortOrder:
            Number(sortOrder) || 0,

          status,

          megaMenu,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to update menu item."
        );
      }

      setSuccess("Menu item updated successfully.");

      setTimeout(() => {
        router.push("/admin/menus");
      }, 700);
    } catch (err) {
      console.error("UPDATE MENU ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update menu item."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * DELETE MENU ITEM
   */
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/menus/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to delete menu item."
        );
      }

      router.push("/admin/menus");
    } catch (err) {
      console.error("DELETE MENU ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete menu item."
      );
    }
  };

  /*
   * LOADING
   */
  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading menu item...
        </p>
      </div>
    );
  }

  /*
   * ERROR / NOT FOUND
   */
  if (error && !menu) {
    return (
      <div>
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>

        <Link
          href="/admin/menus"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Menus
        </Link>
      </div>
    );
  }

  /*
   * Current item ko parent list mein show nahi karna.
   */
  const parentOptions = items.filter(
    (item) => item.id !== id
  );

  return (
    <div className="max-w-4xl">
      {/* HEADER */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Edit Menu Item
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update your navigation menu item.
          </p>
        </div>

        <Link
          href="/admin/menus"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          ← Back to Menus
        </Link>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* FORM */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-base font-semibold text-gray-900">
            Menu Item Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Configure the menu item and its destination.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >
          {/* TITLE */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-800"
            >
              Menu Title
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              disabled={saving}
              placeholder="e.g. About Us"
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
            />
          </div>

          {/* TYPE */}
          <div>
            <label
              htmlFor="type"
              className="mb-2 block text-sm font-medium text-gray-800"
            >
              Link Type
            </label>

            <select
              id="type"
              value={type}
              onChange={(e) => {
                const value = e.target.value;

                setType(value);

                if (value === "page") {
                  setUrl("");
                } else {
                  setPageId("");
                }
              }}
              disabled={saving}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
            >
              <option value="page">
                Page
              </option>

              <option value="custom">
                Custom URL
              </option>
            </select>
          </div>

          {/* PAGE SELECT */}
          {type === "page" && (
            <div>
              <label
                htmlFor="page"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Select Page
                <span className="ml-1 text-red-500">*</span>
              </label>

              <select
                id="page"
                value={pageId}
                onChange={(e) =>
                  setPageId(e.target.value)
                }
                disabled={saving}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
              >
                <option value="">
                  Select a page
                </option>

                {pages.map((page) => (
                  <option
                    key={page.id}
                    value={page.id}
                  >
                    {page.title}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs text-gray-500">
                This menu item will automatically link to the
                selected page.
              </p>
            </div>
          )}

          {/* CUSTOM URL */}
          {type === "custom" && (
            <div>
              <label
                htmlFor="url"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                URL
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) =>
                  setUrl(e.target.value)
                }
                disabled={saving}
                placeholder="https://example.com"
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
              />
            </div>
          )}

          {/* PARENT */}
          <div>
            <label
              htmlFor="parent"
              className="mb-2 block text-sm font-medium text-gray-800"
            >
              Parent Menu Item
            </label>

            <select
              id="parent"
              value={parentId}
              onChange={(e) =>
                setParentId(e.target.value)
              }
              disabled={saving}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
            >
              <option value="">
                None — Top Level
              </option>

              {parentOptions.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.title}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-gray-500">
              Select a parent to make this item a dropdown/sub-menu item.
            </p>
          </div>

          {/* SORT ORDER */}
          <div>
            <label
              htmlFor="sortOrder"
              className="mb-2 block text-sm font-medium text-gray-800"
            >
              Sort Order
            </label>

            <input
              id="sortOrder"
              type="number"
              min="0"
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value)
              }
              disabled={saving}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
            />

            <p className="mt-2 text-xs text-gray-500">
              Lower numbers appear first.
            </p>
          </div>

          {/* STATUS */}
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-gray-800"
            >
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              disabled={saving}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>

          {/* MEGA MENU */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={megaMenu}
                onChange={(e) =>
                  setMegaMenu(e.target.checked)
                }
                disabled={saving}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400"
              />

              <span>
                <span className="block text-sm font-medium text-gray-800">
                  Enable Mega Menu
                </span>

                <span className="mt-1 block text-xs text-gray-500">
                  Display this menu item as a mega menu section.
                </span>
              </span>
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete
            </button>

            <div className="flex gap-3">
              <Link
                href="/admin/menus"
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="min-w-[130px] rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Updating..."
                  : "Update Menu"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}