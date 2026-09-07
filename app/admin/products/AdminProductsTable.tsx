"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type { Product } from "@/src/types/product";

import DeleteProductButton from "./DeleteProductButton";

import styles from "./page.module.css";

interface Props {
  products: Product[];
}

export default function AdminProductsTable({
  products,
}: Props) {
  const router = useRouter();

  const [selectedIds, setSelectedIds] =
    useState<number[]>([]);

  const [deleting, setDeleting] =
    useState(false);

  const allSelected =
    products.length > 0 &&
    products.every((product) =>
      selectedIds.includes(product.id)
    );

  const toggleProduct = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter(
            (productId) =>
              productId !== id
          )
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(
      products.map(
        (product) => product.id
      )
    );
  };

  const handleBulkDelete =
    async () => {
      if (
        selectedIds.length === 0
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Видалити вибрані товари (${selectedIds.length})?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeleting(true);

        const response =
          await fetch(
            "/api/admin/products/bulk",
            {
              method: "DELETE",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                ids: selectedIds,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Не вдалося видалити товари"
          );
        }

        setSelectedIds([]);

        router.refresh();
      } catch (error) {
        console.error(
          "BULK DELETE ERROR:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Помилка видалення товарів"
        );
      } finally {
        setDeleting(false);
      }
    };

  return (
    <>
      <div
        className={
          styles.bulkActions
        }
      >
        <label
          className={
            styles.selectAll
          }
        >
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
          />

          <span>
            Вибрати всі на сторінці
          </span>
        </label>

        {selectedIds.length >
          0 && (
          <button
            type="button"
            className={
              styles.bulkDeleteButton
            }
            onClick={
              handleBulkDelete
            }
            disabled={deleting}
          >
            {deleting
              ? "Видалення..."
              : `Видалити вибрані (${selectedIds.length})`}
          </button>
        )}
      </div>

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
              <th
                className={
                  styles.checkboxColumn
                }
              ></th>

              <th>Товар</th>
              <th>Ціна</th>
              <th>Стара ціна</th>
              <th>Залишок</th>
              <th>Категорія</th>
              <th>Дії</th>
            </tr>
          </thead>

          <tbody>
            {products.map(
              (product) => {
                const selected =
                  selectedIds.includes(
                    product.id
                  );

                return (
                  <tr
                    key={product.id}
                    className={
                      selected
                        ? styles.selectedRow
                        : ""
                    }
                  >
                    <td
                      className={
                        styles.checkboxColumn
                      }
                    >
                      <input
                        type="checkbox"
                        checked={
                          selected
                        }
                        onChange={() =>
                          toggleProduct(
                            product.id
                          )
                        }
                        aria-label={`Вибрати ${product.name}`}
                      />
                    </td>

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
                            Немає фото
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
                      {product.price} грн
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
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}