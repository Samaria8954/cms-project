import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { notFound } from "next/navigation";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/* =====================================================
   CONTENT BLOCK TYPES
===================================================== */

type SummernoteBlock = {
  id: string;
  type: "summernote";
  content: string;
};

type CustomBlock = {
  id: string;
  type: "custom";
  sectionId: string;
};

type ContentBlock = SummernoteBlock | CustomBlock;

/* =====================================================
   CUSTOM SECTION
===================================================== */

type CodeSection = {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  enabled: boolean;
};

/* =====================================================
   MARKERS
===================================================== */

const SECTION_START = "CMS_CUSTOM_SECTION_START";
const SECTION_END = "CMS_CUSTOM_SECTION_END";

/* =====================================================
   PARSE CONTENT BLOCKS
===================================================== */

function parseContentBlocks(
  value: string | null | undefined
): ContentBlock[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((block): block is ContentBlock => {
      if (!block || typeof block !== "object") {
        return false;
      }

      if (
        block.type === "summernote" &&
        typeof block.id === "string" &&
        typeof block.content === "string"
      ) {
        return true;
      }

      if (
        block.type === "custom" &&
        typeof block.id === "string" &&
        typeof block.sectionId === "string"
      ) {
        return true;
      }

      return false;
    });
  } catch (error) {
    console.error("CONTENT BLOCKS PARSE ERROR:", error);
    return [];
  }
}

/* =====================================================
   PARSE CUSTOM SECTIONS
===================================================== */

function parseCustomSections(
  customHtml: string | null | undefined,
  customCss: string | null | undefined,
  customJs: string | null | undefined
): CodeSection[] {
  const sections = new Map<string, CodeSection>();

  const html = customHtml || "";
  const css = customCss || "";
  const js = customJs || "";

  function getSection(
    id: string,
    name = "Custom Section"
  ): CodeSection {
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
  }

  /* ===================================================
     HTML

     EXACT FORMAT:

     <!-- CMS_CUSTOM_SECTION_START:id:name -->
     HTML
     <!-- CMS_CUSTOM_SECTION_END:id -->
  =================================================== */

  const htmlRegex =
    /<!--\s*CMS_CUSTOM_SECTION_START:([^:]+):([\s\S]*?)\s*-->([\s\S]*?)<!--\s*CMS_CUSTOM_SECTION_END:\1\s*-->/g;

  let htmlMatch: RegExpExecArray | null;

  while ((htmlMatch = htmlRegex.exec(html)) !== null) {
    const id = htmlMatch[1].trim();

    const name =
      htmlMatch[2].trim() || "Custom Section";

    const sectionHtml =
      htmlMatch[3].trim();

    const section = getSection(id, name);

    section.name = name;
    section.html = sectionHtml;
  }

  

  const cssRegex =
    /\/\*\s*CMS_CUSTOM_SECTION_START:([^:]+):([\s\S]*?)\s*\*\/([\s\S]*?)\/\*\s*CMS_CUSTOM_SECTION_END:\1\s*\*\//g;

  let cssMatch: RegExpExecArray | null;

  while ((cssMatch = cssRegex.exec(css)) !== null) {
    const id = cssMatch[1].trim();

    const name =
      cssMatch[2].trim() || "Custom Section";

    const sectionCss =
      cssMatch[3].trim();

    const section = getSection(id, name);

    section.name = name;
    section.css = sectionCss;
  }

 

  const jsRegex =
    /\/\*\s*CMS_CUSTOM_SECTION_START:([^:]+):([\s\S]*?)\s*\*\/([\s\S]*?)\/\*\s*CMS_CUSTOM_SECTION_END:\1\s*\*\//g;

  let jsMatch: RegExpExecArray | null;

  while ((jsMatch = jsRegex.exec(js)) !== null) {
    const id = jsMatch[1].trim();

    const name =
      jsMatch[2].trim() || "Custom Section";

    const sectionJs =
      jsMatch[3].trim();

    const section = getSection(id, name);

    section.name = name;
    section.js = sectionJs;
  }

  /* ===================================================
     LEGACY CUSTOM CODE

     Agar markers nahi hain aur old page mein direct
     custom HTML/CSS/JS hai.
  =================================================== */

  if (
    sections.size === 0 &&
    (
      html.trim() ||
      css.trim() ||
      js.trim()
    )
  ) {
    sections.set("legacy", {
      id: "legacy",
      name: "Custom Code",
      html: html.trim(),
      css: css.trim(),
      js: js.trim(),
      enabled: true,
    });
  }

  return Array.from(sections.values());
}

/* =====================================================
   PUBLIC PAGE
===================================================== */

export default async function PublicPage({
  params,
}: PageProps) {
  const { slug } = await params;

  /* ===================================================
     FIND PUBLISHED PAGE
  =================================================== */

  const page = await prisma.page.findFirst({
    where: {
      slug,
      status: "published",
    },
  });

  if (!page) {
    notFound();
  }

  /* ===================================================
     PARSE ORDERED CONTENT BLOCKS
  =================================================== */

  const storedBlocks = parseContentBlocks(
    page.contentBlocks
  );

  /* ===================================================
     PARSE CUSTOM SECTIONS
  =================================================== */

  const sections = parseCustomSections(
    page.customHtml,
    page.customCss,
    page.customJs
  );

  /* ===================================================
     FINAL BLOCKS

     IMPORTANT:
     New pages:
       contentBlocks is source of truth.

     Old pages:
       fallback to content + custom sections.
  =================================================== */

  let blocks: ContentBlock[] = [...storedBlocks];

  if (blocks.length === 0) {
    /* -----------------------------------------------
       OLD SUMMERNOTE
    ----------------------------------------------- */

    if (page.content?.trim()) {
      blocks.push({
        id: "legacy-summernote",
        type: "summernote",
        content: page.content,
      });
    }

    /* -----------------------------------------------
       OLD CUSTOM SECTIONS
    ----------------------------------------------- */

    sections.forEach((section) => {
      blocks.push({
        id: `legacy-custom-${section.id}`,
        type: "custom",
        sectionId: section.id,
      });
    });
  }

  /* ===================================================
     FIND SECTION
  =================================================== */

  function findSection(sectionId: string) {
    return sections.find(
      (section) => section.id === sectionId
    );
  }

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <>
      {/* =================================================
          PAGE
      ================================================= */}

      <main className="min-h-screen w-full bg-white">
        <article className="w-full">

          {/* =================================================
              HERO
          ================================================= */}

          {page.featuredImage ? (
            <section className="relative h-[300px] w-full overflow-hidden md:h-[400px] lg:h-[450px]">

              <img
                src={page.featuredImage}
                alt={page.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/45" />

              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                  {page.title}
                </h1>
              </div>

            </section>
          ) : (
            <section className="flex min-h-[220px] w-full items-center justify-center bg-gray-100 px-6 py-12 text-center md:min-h-[280px]">

              <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                {page.title}
              </h1>

            </section>
          )}

          {/* =================================================
              ORDERED CONTENT
          ================================================= */}

          <div className="w-full">

            {blocks.map((block) => {

              /* =================================================
                 SUMMERNOTE
              ================================================= */

              if (block.type === "summernote") {
                return (
                  <section
                    key={block.id}
                    className="summernote-public-content w-full"
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: block.content || "",
                      }}
                    />
                  </section>
                );
              }

              /* =================================================
                 CUSTOM CODE
              ================================================= */

              if (block.type === "custom") {
                const section = findSection(
                  block.sectionId
                );

                /*
                 * Agar contentBlocks mein sectionId hai
                 * lekin customHtml mein section nahi mil raha,
                 * to section silently disappear nahi hoga.
                 */

                if (!section) {
                  console.warn(
                    "CUSTOM SECTION NOT FOUND:",
                    block.sectionId,
                    "Available sections:",
                    sections.map((item) => item.id)
                  );

                  return null;
                }

                if (!section.enabled) {
                  return null;
                }

                return (
                  <section
                    key={block.id}
                    className="custom-public-section w-full"
                  >

                    {/* =================================================
                        SECTION CSS
                    ================================================= */}

                    {section.css ? (
                      <style
                        dangerouslySetInnerHTML={{
                          __html: section.css,
                        }}
                      />
                    ) : null}

                    {/* =================================================
                        SECTION HTML
                    ================================================= */}

                    {section.html ? (
                      <div
                        className="w-full"
                        dangerouslySetInnerHTML={{
                          __html: section.html,
                        }}
                      />
                    ) : null}

                    {/* =================================================
                        SECTION JS
                    ================================================= */}

                    {section.js ? (
                      <script
                        dangerouslySetInnerHTML={{
                          __html: `
                            (() => {
                              try {
                                ${section.js}
                              } catch (error) {
                                console.error(
                                  "Custom section JavaScript error:",
                                  error
                                );
                              }
                            })();
                          `,
                        }}
                      />
                    ) : null}

                  </section>
                );
              }

              return null;
            })}

          </div>

        </article>
      </main>

      {/* =================================================
          GLOBAL CUSTOM CSS

          Ye sirf un pages ke liye hai jahan custom CSS
          direct legacy/global format mein save hai.

          Marker based CSS ko bhi yahan inject karna safe
          hai because comments + CSS content valid hai.
      ================================================= */}

      {page.customCss ? (
        <style
          dangerouslySetInnerHTML={{
            __html: page.customCss,
          }}
        />
      ) : null}

      {/* =================================================
          LEGACY GLOBAL JS

          Sirf old pages ke liye.
      ================================================= */}

      {storedBlocks.length === 0 && page.customJs ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  ${page.customJs}
                } catch (error) {
                  console.error(
                    "Custom page JavaScript error:",
                    error
                  );
                }
              })();
            `,
          }}
        />
      ) : null}
    </>
  );
}