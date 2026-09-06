import Link from "next/link";

import ProductCard from "@/components/ProductCard/ProductCard";
import type { Product } from "@/src/types/product";

import styles from "./page.module.css";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProductsResponse {
  data: Product[];

  pagination: Pagination;
}

interface SalesPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function SalesPage({
  searchParams,
}: SalesPageProps) {
  const params = await searchParams;

  const parsedPage = Number(
    params.page ?? "1"
  );

  const currentPage =
    Number.isInteger(parsedPage) &&
    parsedPage > 0
      ? parsedPage
      : 1;

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

  apiParams.set(
    "discount",
    "true"
  );

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?${apiParams.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <span>⚠️</span>

            <h1>
              Не вдалося завантажити акції
            </h1>

            <p>
              Спробуй оновити сторінку трохи
              пізніше.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const result: ProductsResponse =
    await response.json();

  const saleProducts =
    result.data ?? [];

  const pagination =
    result.pagination ?? {
      page: currentPage,
      limit: 12,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };

  const createPageHref = (
    page: number
  ) => {
    return `/sales?page=${page}`;
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <span className={styles.label}>
            Спеціальні пропозиції
          </span>

          <h1>
            Акції та знижки
          </h1>

          <p>
            Вигідні пропозиції на
            мототовари, екіпірування та
            аксесуари.
          </p>
        </section>

        <div className={styles.heading}>
          <div>
            <h2>
              Товари зі знижкою
            </h2>

            <p>
              Знайдено:{" "}
              {pagination.total}
            </p>
          </div>
        </div>

        {saleProducts.length > 0 ? (
          <>
            <div className={styles.products}>
              {saleProducts.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                )
              )}
            </div>

            {pagination.totalPages >
              1 && (
              <nav
                className={
                  styles.pagination
                }
                aria-label="Пагінація акцій"
              >
                {pagination.hasPrevPage ? (
                  <Link
                    href={createPageHref(
                      pagination.page - 1
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

                {Array.from(
                  {
                    length:
                      pagination.totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map(
                  (pageNumber) => (
                    <Link
                      key={
                        pageNumber
                      }
                      href={createPageHref(
                        pageNumber
                      )}
                      className={`${styles.pageButton} ${
                        pagination.page ===
                        pageNumber
                          ? styles.activePage
                          : ""
                      }`}
                    >
                      {pageNumber}
                    </Link>
                  )
                )}

                {pagination.hasNextPage ? (
                  <Link
                    href={createPageHref(
                      pagination.page + 1
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
              </nav>
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <span>🏷️</span>

            <h2>
              Акцій поки немає
            </h2>

            <p>
              Нові спеціальні пропозиції
              з&apos;являться тут.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}