"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import styles from "./page.module.css";

interface Category {
  id: number;
  name: string;
}

interface UploadResponse {
  data: {
    url: string;
  };
}

const MAX_IMAGES = 6;

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [oldPrice, setOldPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [images, setImages] =
    useState<File[]>([]);

  const [categoryId, setCategoryId] =
    useState("");

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const loadCategories =
      async () => {
        try {
          const response =
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
            );

          if (!response.ok) {
            return;
          }

          const result =
            await response.json();

          setCategories(
            result.data ?? []
          );
        } catch {
          setCategories([]);
        }
      };

    loadCategories();
  }, []);

  const previews = useMemo(
    () =>
      images.map((file) => ({
        file,
        url:
          URL.createObjectURL(
            file
          ),
      })),
    [images]
  );

  useEffect(() => {
    return () => {
      previews.forEach(
        (preview) => {
          URL.revokeObjectURL(
            preview.url
          );
        }
      );
    };
  }, [previews]);

  const handleImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles =
      Array.from(
        event.target.files ?? []
      );

    const validFiles =
      selectedFiles.filter(
        (file) =>
          [
            "image/png",
            "image/jpeg",
            "image/webp",
          ].includes(file.type)
      );

    setImages((current) => {
      const combined = [
        ...current,
        ...validFiles,
      ];

      return combined.slice(
        0,
        MAX_IMAGES
      );
    });

    event.target.value = "";
  };

  const handleRemoveImage = (
    index: number
  ) => {
    setImages((current) =>
      current.filter(
        (_, currentIndex) =>
          currentIndex !== index
      )
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const uploadedUrls: string[] =
        [];

      for (const image of images) {
        const formData =
          new FormData();

        formData.append(
          "file",
          image
        );

        const uploadResponse =
          await fetch(
            "/api/admin/upload",
            {
              method: "POST",
              body: formData,
            }
          );

        if (!uploadResponse.ok) {
          throw new Error(
            "Не вдалося завантажити одне з фото"
          );
        }

        const uploadResult: UploadResponse =
          await uploadResponse.json();

        uploadedUrls.push(
          uploadResult.data.url
        );
      }

      const response =
        await fetch(
          "/api/admin/products",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name,
              slug,
              description,

              price:
                Number(price),

              oldPrice:
                oldPrice
                  ? Number(
                      oldPrice
                    )
                  : undefined,

              stock:
                Number(stock),

              images:
                uploadedUrls,

              categoryId:
                Number(
                  categoryId
                ),
            }),
          }
        );

      if (!response.ok) {
        const data =
          await response.json();

        throw new Error(
          data.message ||
            "Не вдалося створити товар"
        );
      }

      router.push(
        "/admin/products"
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Помилка при створенні товару"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={styles.container}
    >
      <div className={styles.header}>
        <div>
          <h1
            className={styles.title}
          >
            Додати товар
          </h1>

          <p
            className={
              styles.subtitle
            }
          >
            Заповніть інформацію про
            новий товар
          </p>
        </div>

        <button
          type="button"
          className={
            styles.backButton
          }
          onClick={() =>
            router.push(
              "/admin/products"
            )
          }
        >
          ← Назад
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <div
          className={styles.field}
        >
          <label htmlFor="name">
            Назва товару
          </label>

          <input
            id="name"
            type="text"
            placeholder="Наприклад: Lock-On гріпси"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            required
          />
        </div>

        <div
          className={styles.field}
        >
          <label htmlFor="slug">
            Slug
          </label>

          <input
            id="slug"
            type="text"
            placeholder="lock-on-grips"
            value={slug}
            onChange={(event) =>
              setSlug(
                event.target.value
              )
            }
            required
          />
        </div>

        <div
          className={`${styles.field} ${styles.fullWidth}`}
        >
          <label
            htmlFor="description"
          >
            Опис
          </label>

          <textarea
            id="description"
            placeholder="Опис товару..."
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            required
          />
        </div>

        <div
          className={styles.field}
        >
          <label htmlFor="price">
            Ціна
          </label>

          <input
            id="price"
            type="number"
            min="1"
            placeholder="449"
            value={price}
            onChange={(event) =>
              setPrice(
                event.target.value
              )
            }
            required
          />
        </div>

        <div
          className={styles.field}
        >
          <label
            htmlFor="oldPrice"
          >
            Стара ціна
          </label>

          <input
            id="oldPrice"
            type="number"
            min="1"
            placeholder="499"
            value={oldPrice}
            onChange={(event) =>
              setOldPrice(
                event.target.value
              )
            }
          />
        </div>

        <div
          className={styles.field}
        >
          <label htmlFor="stock">
            Залишок
          </label>

          <input
            id="stock"
            type="number"
            min="0"
            placeholder="10"
            value={stock}
            onChange={(event) =>
              setStock(
                event.target.value
              )
            }
            required
          />
        </div>

        <div
          className={styles.field}
        >
          <label
            htmlFor="category"
          >
            Категорія
          </label>

          <select
            id="category"
            value={categoryId}
            onChange={(event) =>
              setCategoryId(
                event.target.value
              )
            }
            required
          >
            <option value="">
              Оберіть категорію
            </option>

            {categories.map(
              (category) => (
                <option
                  key={
                    category.id
                  }
                  value={
                    category.id
                  }
                >
                  {
                    category.name
                  }
                </option>
              )
            )}
          </select>
        </div>

        <div
          className={`${styles.field} ${styles.fullWidth}`}
        >
          <label
            htmlFor="images"
          >
            Фото товару
          </label>

          <p
            className={
              styles.imageHint
            }
          >
            До {MAX_IMAGES} фото.
            Перше фото буде головним.
          </p>

          <input
            id="images"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={
              handleImagesChange
            }
            disabled={
              images.length >=
              MAX_IMAGES
            }
          />

          {images.length > 0 && (
            <div
              className={
                styles.previewGrid
              }
            >
              {previews.map(
                (
                  preview,
                  index
                ) => (
                  <div
                    key={`${preview.file.name}-${index}`}
                    className={
                      styles.previewItem
                    }
                  >
                    <img
                      src={
                        preview.url
                      }
                      alt={`Фото ${
                        index + 1
                      }`}
                      className={
                        styles.previewImage
                      }
                    />

                    {index ===
                      0 && (
                      <span
                        className={
                          styles.mainBadge
                        }
                      >
                        Головне
                      </span>
                    )}

                    <button
                      type="button"
                      className={
                        styles.removeImage
                      }
                      onClick={() =>
                        handleRemoveImage(
                          index
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          <p
            className={
              styles.imageCount
            }
          >
            {images.length} /{" "}
            {MAX_IMAGES}
          </p>
        </div>

        {error && (
          <p
            className={
              styles.error
            }
          >
            {error}
          </p>
        )}

        <div
          className={
            styles.actions
          }
        >
          <button
            type="button"
            className={
              styles.cancelButton
            }
            onClick={() =>
              router.push(
                "/admin/products"
              )
            }
            disabled={loading}
          >
            Скасувати
          </button>

          <button
            type="submit"
            className={
              styles.submitButton
            }
            disabled={loading}
          >
            {loading
              ? "Створення..."
              : "Створити товар"}
          </button>
        </div>
      </form>
    </section>
  );
}