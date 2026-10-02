"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Page = {
  id: number;
  title: string;
  slug: string;
};

type SelectedItem = {
  pageId: number | null;
  title: string;
  url: string;
  type: "page" | "custom";
};

export default function NewMenuPage() {
  const router = useRouter();

  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  const [menuName, setMenuName] = useState("");
  const [location, setLocation] = useState("");

  const [customTitle, setCustomTitle] = useState("");
  const [customUrl, setCustomUrl] = useState("");

  const [customItems, setCustomItems] = useState<
    SelectedItem[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =====================================================
  // LOAD PAGES
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadPages = async () => {
      try {
        const response = await fetch("/api/pages");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load pages."
          );
        }

        if (mounted) {
          setPages(Array.isArray(data) ? data : []);
          setLoading(false);
        }

      } catch (err) {
        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load pages."
        );

        setLoading(false);
      }
    };

    loadPages();

    return () => {
      mounted = false;
    };
  }, []);


  // =====================================================
  // PAGE CHECKBOX
  // =====================================================

  const togglePage = (pageId: number) => {
    setSelectedPages((current) =>
      current.includes(pageId)
        ? current.filter((id) => id !== pageId)
        : [...current, pageId]
    );
  };


  // =====================================================
  // ADD CUSTOM ITEM
  // =====================================================

  const addCustomItem = () => {
    setError("");

    if (!customTitle.trim()) {
      setError("Please enter a custom menu title.");
      return;
    }

    if (!customUrl.trim()) {
      setError("Please enter a custom URL.");
      return;
    }

    setCustomItems((current) => [
      ...current,
      {
        pageId: null,
        title: customTitle.trim(),
        url: customUrl.trim(),
        type: "custom",
      },
    ]);

    setCustomTitle("");
    setCustomUrl("");
  };


  // =====================================================
  // REMOVE CUSTOM ITEM
  // =====================================================

  const removeCustomItem = (index: number) => {
    setCustomItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  };


  // =====================================================
  // CREATE MENU
  // =====================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!menuName.trim()) {
      setError("Please enter a menu name.");
      return;
    }

    if (!location) {
      setError("Please select a menu location.");
      return;
    }

    if (
      selectedPages.length === 0 &&
      customItems.length === 0
    ) {
      setError(
        "Please select at least one page or add a custom link."
      );
      return;
    }

    setSaving(true);

    try {
      // -------------------------------------------------
      // CREATE MENU
      // -------------------------------------------------

      const menuResponse = await fetch("/api/menus", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: menuName.trim(),
          location,
        }),
      });

      const menuData = await menuResponse.json();

      if (!menuResponse.ok) {
        throw new Error(
          menuData.error || "Failed to create menu."
        );
      }

      const menuId = menuData.id;


      // -------------------------------------------------
      // CREATE PAGE ITEMS
      // -------------------------------------------------

      let sortOrder = 0;

      for (const pageId of selectedPages) {
        const page = pages.find(
          (item) => item.id === pageId
        );

        if (!page) continue;

        const response = await fetch("/api/menu-items", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            menuId,
            title: page.title,
            type: "page",
            pageId: page.id,
            url: `/${page.slug}`,
            parentId: null,
            sortOrder,
            status: "active",
            megaMenu: false,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to add page to menu."
          );
        }

        sortOrder++;
      }


      // -------------------------------------------------
      // CREATE CUSTOM ITEMS
      // -------------------------------------------------

      for (const item of customItems) {
        const response = await fetch("/api/menu-items", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            menuId,
            title: item.title,
            type: "custom",
            pageId: null,
            url: item.url,
            parentId: null,
            sortOrder,
            status: "active",
            megaMenu: false,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to add custom menu item."
          );
        }

        sortOrder++;
      }


      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      setSuccess("Menu created successfully.");

      setTimeout(() => {
        router.push(`/admin/menus/${menuId}`);
      }, 700);

    } catch (err) {
      console.error("CREATE MENU ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create menu."
      );

    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="mx-auto max-w-5xl">

      {/* HEADER */}

      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Create Menu
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create a dynamic navigation menu for your website.
          </p>

        </div>

        <Link
          href="/admin/menus"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          ← Back to Menus
        </Link>

      </div>


      {/* ALERTS */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="font-semibold">
            Error:
          </span>{" "}
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <span className="font-semibold">
            Success:
          </span>{" "}
          {success}
        </div>
      )}


      <form onSubmit={handleSubmit}>

        {/* BASIC INFORMATION */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">

            <h2 className="font-semibold text-gray-900">
              Menu Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Set the name and location of your menu.
            </p>

          </div>


          <div className="grid gap-6 p-6 md:grid-cols-2">

            {/* NAME */}

            <div>

              <label
                htmlFor="menuName"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Menu Name
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                id="menuName"
                type="text"
                value={menuName}
                onChange={(e) =>
                  setMenuName(e.target.value)
                }
                placeholder="Main Menu"
                disabled={saving}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
              />

            </div>


            {/* LOCATION */}

            <div>

              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Menu Location
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                id="location"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                disabled={saving}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
              >

                <option value="">
                  Select location
                </option>

                <option value="header">
                  Header
                </option>

                <option value="footer">
                  Footer
                </option>

                <option value="mobile">
                  Mobile
                </option>

              </select>

            </div>

          </div>

        </div>


        {/* PAGES */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">

            <h2 className="font-semibold text-gray-900">
              Pages
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select the pages you want to add to this menu.
            </p>

          </div>


          <div className="p-6">

            {loading ? (

              <div className="py-8 text-center text-sm text-gray-500">
                Loading pages...
              </div>

            ) : pages.length === 0 ? (

              <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">

                <p className="text-sm font-medium text-gray-700">
                  No pages available
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Create a page first before adding it to a menu.
                </p>

              </div>

            ) : (

              <div className="grid gap-3 md:grid-cols-2">

                {pages.map((page) => {

                  const checked =
                    selectedPages.includes(page.id);

                  return (
                    <label
                      key={page.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                        checked
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >

                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          togglePage(page.id)
                        }
                        disabled={saving}
                        className="h-4 w-4 rounded border-gray-300"
                      />

                      <div className="min-w-0">

                        <p className="text-sm font-medium text-gray-900">
                          {page.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          /{page.slug}
                        </p>

                      </div>

                    </label>
                  );
                })}

              </div>

            )}

          </div>

        </div>


        {/* CUSTOM LINKS */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">

            <h2 className="font-semibold text-gray-900">
              Custom Links
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add external websites or custom URLs to your menu.
            </p>

          </div>


          <div className="grid gap-4 p-6 md:grid-cols-[1fr_1fr_auto]">

            <input
              type="text"
              value={customTitle}
              onChange={(e) =>
                setCustomTitle(e.target.value)
              }
              placeholder="Link title"
              disabled={saving}
              className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-gray-500"
            />

            <input
              type="text"
              value={customUrl}
              onChange={(e) =>
                setCustomUrl(e.target.value)
              }
              placeholder="https://example.com"
              disabled={saving}
              className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-gray-500"
            />

            <button
              type="button"
              onClick={addCustomItem}
              disabled={saving}
              className="h-11 rounded-lg border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Add Link
            </button>

          </div>


          {/* CUSTOM ITEMS */}

          {customItems.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-5">

              <div className="space-y-2">

                {customItems.map((item, index) => (

                  <div
                    key={`${item.title}-${index}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
                  >

                    <div>

                      <p className="text-sm font-medium text-gray-900">
                        {item.title}
                      </p>

                      <p className="text-xs text-gray-500">
                        {item.url}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeCustomItem(index)
                      }
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>

                  </div>

                ))}

              </div>

            </div>
          )}

        </div>


        {/* ACTIONS */}

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">

          <Link
            href="/admin/menus"
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="min-w-[130px] rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Creating..."
              : "Create Menu"}
          </button>

        </div>

      </form>

    </div>
  );
}