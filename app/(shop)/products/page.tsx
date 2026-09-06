import Link from "next/link";

import ProductCard from "@/components/ProductCard/ProductCard";
import ProductFilters from "@/components/ProductFilters/ProductFilters";

import styles from "./page.module.css";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  images: string[];
  rating?: number;

  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    discount?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  /* =========================
     CURRENT PAGE
  ========================= */

  const parsedPage = Number(
    params.page ?? "1"
  );

  const currentPage =
    Number.isInteger(parsedPage) &&
    parsedPage > 0
      ? parsedPage
      : 1;

  /* =========================
     API QUERY
  ========================= */

  const apiParams =
    new URLSearchParams();

  apiParams.set(
    "page",
    String(currentPage)
  );

  apiParams.set(
    "limit",
    "12"
  );

  if (params.search?.trim()) {
    apiParams.set(
      "search",
      params.search.trim()
    );
  }

  if (params.category) {
    apiParams.set(
      "category",
      params.category
    );
  }

  if (params.minPrice) {
    apiParams.set(
      "minPrice",
      params.minPrice
    );
  }

  if (params.maxPrice) {
    apiParams.set(
      "maxPrice",
      params.maxPrice
    );
  }

  if (params.discount === "true") {
    apiParams.set(
      "discount",
      "true"
    );
  }

  if (params.sort) {
    apiParams.set(
      "sort",
      params.sort
    );
  }

  /* =========================
     FETCH
  ========================= */

  const [
    productsResponse,
    categoriesResponse,
  ] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?${apiParams.toString()}`,
      {
        cache: "no-store",
      }
    ),

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
      {
        cache: "no-store",
      }
    ),
  ]);

  if (!productsResponse.ok) {
    throw new Error(
      "Не вдалося завантажити товари"
    );
  }

  if (!categoriesResponse.ok) {
    throw new Error(
      "Не вдалося завантажити категорії"
    );
  }

  const productsResult =
    await productsResponse.json();

  const categoriesResult =
    await categoriesResponse.json();

  const products: Product[] =
    productsResult.data ?? [];

  const categories: Category[] =
    categoriesResult.data ?? [];

  const pagination: Pagination =
    productsResult.pagination ?? {
      page: currentPage,
      limit: 12,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };

  /* =========================
     PAGE URL
  ========================= */

  const createPageHref = (
    page: number
  ) => {
    const query =
      new URLSearchParams();

    if (params.search?.trim()) {
      query.set(
        "search",
        params.search.trim()
      );
    }

    if (params.category) {
      query.set(
        "category",
        params.category
      );
    }

    if (params.minPrice) {
      query.set(
        "minPrice",
        params.minPrice
      );
    }

    if (params.maxPrice) {
      query.set(
        "maxPrice",
        params.maxPrice
      );
    }

    if (
      params.discount === "true"
    ) {
      query.set(
        "discount",
        "true"
      );
    }

    if (params.sort) {
      query.set(
        "sort",
        params.sort
      );
    }

    query.set(
      "page",
      String(page)
    );

    return `/products?${query.toString()}`;
  };

  /* =========================
     PAGE NUMBERS
  ========================= */

  const pageNumbers =
    Array.from(
      {
        length:
          pagination.totalPages,
      },
      (_, index) =>
        index + 1
    );

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* HEADER */}

        <div className={styles.heading}>
          <div>
            <span
              className={styles.label}
            >
              Магазин
            </span>

            <h1>
              Каталог товарів
            </h1>

            <p>
              Компоненти, аксесуари та все
              необхідне для твого
              мотоцикла.
            </p>
          </div>

          <span
            className={styles.count}
          >
            Знайдено:{" "}
            {pagination.total}
          </span>
        </div>

        {/* CONTENT */}

        <div className={styles.layout}>
          <aside
            className={styles.sidebar}
          >
            <ProductFilters
              categories={categories}
            />
          </aside>

          <section
            className={styles.products}
          >
            {products.length > 0 ? (
              <>
                {/* PRODUCTS */}

                <div
                  className={styles.grid}
                >
                  {products.map(
                    (product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    )
                  )}
                </div>

                {/* PAGINATION */}

                {pagination.totalPages >
                  1 && (
                  <div
                    className={
                      styles.pagination
                    }
                  >
                    {/* PREVIOUS */}

                    {pagination.hasPrevPage ? (
                      <Link
                        href={createPageHref(
                          pagination.page -
                            1
                        )}
                        className={
                          styles.pageButton
                        }
                      >
                        ←
                      </Link>
                    ) : (
                      <span
                        className={`${styles.pageButton} ${styles.disabledPage}`}
                      >
                        ←
                      </span>
                    )}

                    {/* NUMBERS */}

                    {pageNumbers.map(
                      (pageNumber) => (
                        <Link
                          key={
                            pageNumber
                          }
                          href={createPageHref(
                            pageNumber
                          )}
                          className={`${styles.pageButton} ${
                            pageNumber ===
                            pagination.page
                              ? styles.activePage
                              : ""
                          }`}
                        >
                          {pageNumber}
                        </Link>
                      )
                    )}

                    {/* NEXT */}

                    {pagination.hasNextPage ? (
                      <Link
                        href={createPageHref(
                          pagination.page +
                            1
                        )}
                        className={
                          styles.pageButton
                        }
                      >
                        →
                      </Link>
                    ) : (
                      <span
                        className={`${styles.pageButton} ${styles.disabledPage}`}
                      >
                        →
                      </span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div
                className={styles.empty}
              >
                <span>🔎</span>

                <h2>
                  Товарів не знайдено
                </h2>

                <p>
                  Спробуй змінити або
                  скинути параметри
                  фільтрації.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}