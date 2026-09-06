import Link from "next/link";

import ProductFilters from "@/components/ProductFilters/ProductFilters";
import type { Product } from "@/src/types/product";

import DeleteProductButton from "./DeleteProductButton";

import styles from "./page.module.css";

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

interface ProductsResponse {
  data: Product[];
  pagination: Pagination;
}

interface CategoriesResponse {
  data: Category[];
}

interface AdminProductsPageProps {
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

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
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
    "20"
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
    return (
      <section className={styles.page}>
        <div className={styles.empty}>
          <span>⚠️</span>

          <h2>
            Не вдалося завантажити товари
          </h2>
        </div>
      </section>
    );
  }

  const productsResult: ProductsResponse =
    await productsResponse.json();

  const categoriesResult: CategoriesResponse =
    categoriesResponse.ok
      ? await categoriesResponse.json()
      : {
          data: [],
        };

  const products =
    productsResult.data ?? [];

  const categories =
    categoriesResult.data ?? [];

  const pagination =
    productsResult.pagination;

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

    return `/admin/products?${query.toString()}`;
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Товари
          </h1>

          <p className={styles.subtitle}>
            Всього товарів:{" "}
            {pagination.total}
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className={styles.addButton}
        >
          + Додати товар
        </Link>
      </div>

      <div className={styles.filters}>
        <ProductFilters
          categories={categories}
          basePath="/admin/products"
        />
      </div>

      {products.length > 0 ? (
        <>
          <div
            className={
              styles.tableWrapper
            }
          >
            <table
              className={styles.table}
            >
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Ціна</th>
                  <th>
                    Стара ціна
                  </th>
                  <th>
                    Залишок
                  </th>
                  <th>
                    Категорія
                  </th>
                  <th>
                    Дії
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map(
                  (product) => (
                    <tr
                      key={
                        product.id
                      }
                    >
                      <td>
                        <div
                          className={
                            styles.product
                          }
                        >
                          {product
                            .images?.[0] ? (
                            <img
                              src={
                                product
                                  .images[0]
                              }
                              alt={
                                product.name
                              }
                              className={
                                styles.image
                              }
                            />
                          ) : (
                            <div
                              className={
                                styles.noImage
                              }
                            >
                              Немає
                              фото
                            </div>
                          )}

                          <div>
                            <strong>
                              {
                                product.name
                              }
                            </strong>

                            <p
                              className={
                                styles.slug
                              }
                            >
                              {
                                product.slug
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>
                        {
                          product.price
                        }{" "}
                        грн
                      </td>

                      <td>
                        {product.oldPrice !==
                          null &&
                        product.oldPrice !==
                          undefined
                          ? `${product.oldPrice} грн`
                          : "—"}
                      </td>

                      <td>
                        <span
                          className={
                            product.stock >
                            0
                              ? styles.inStock
                              : styles.outOfStock
                          }
                        >
                          {
                            product.stock
                          }
                        </span>
                      </td>

                      <td>
                        {product
                          .category
                          ?.name ?? "—"}
                      </td>

                      <td>
                        <div
                          className={
                            styles.actions
                          }
                        >
                          <Link
                            href={`/admin/products/${product.id}`}
                            className={
                              styles.editButton
                            }
                          >
                            Редагувати
                          </Link>

                          <DeleteProductButton
                            id={
                              product.id
                            }
                            className={
                              styles.deleteButton
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages >
            1 && (
            <nav
              className={
                styles.pagination
              }
              aria-label="Пагінація товарів"
            >
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
                      pageNumber ===
                      pagination.page
                        ? styles.activePage
                        : ""
                    }`}
                  >
                    {
                      pageNumber
                    }
                  </Link>
                )
              )}

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
            </nav>
          )}
        </>
      ) : (
        <div className={styles.empty}>
          <span>📦</span>

          <h2>
            Товарів не знайдено
          </h2>

          <p>
            Змініть параметри
            фільтрації або додайте
            новий товар.
          </p>
        </div>
      )}
    </section>
  );
}