
"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX_IMAGES = 6;

type Category = {
  id: number;
  name: string;
};

type UploadResponse = {
  url?: string;
  data?: {
    url?: string;
    imageUrl?: string;
  };
  message?: string;
};

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [stock, setStock] = useState("0");

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        if (!API_URL) {
          throw new Error("Не налаштовано NEXT_PUBLIC_API_URL");
        }

        const response = await fetch(`${API_URL}/api/categories`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error("Не вдалося завантажити категорії");
        }

        setCategories(result.data ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Помилка завантаження категорій"
        );
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    const urls = images.map((image) => URL.createObjectURL(image));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const filteredCategories = useMemo(() => {
    const query = categoryInput.trim().toLowerCase();

    if (!query) return categories;

    return categories.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
  }, [categories, categoryInput]);

  const exactCategory = categories.find(
    (category) =>
      category.name.toLowerCase() ===
      categoryInput.trim().toLowerCase()
  );

  function handleCategoryChange(value: string) {
    setCategoryInput(value);
    setError("");

    const existing = categories.find(
      (category) =>
        category.name.toLowerCase() === value.trim().toLowerCase()
    );

    setCategoryId(existing ? String(existing.id) : "");
  }

  async function handleCreateCategory() {
    const value = categoryInput.trim();

    if (!value) {
      setError("Введи назву категорії");
      return;
    }

    if (exactCategory) {
      setCategoryId(String(exactCategory.id));
      setCategoryInput(exactCategory.name);
      setError("");
      return;
    }

    if (!API_URL) {
      setError("Не налаштовано адресу API");
      return;
    }

    setCategoryLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/categories",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: value }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Немає авторизації для створення категорії. Потрібно перевірити API-маршрут."
          );
        }

        throw new Error(
          result.message || "Не вдалося створити категорію"
        );
      }

      const created: Category | undefined = result.data;

      if (!created?.id || !created?.name) {
        throw new Error("Сервер не повернув створену категорію");
      }

      setCategories((current) => [...current, created]);
      setCategoryInput(created.name);
      setCategoryId(String(created.id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Помилка створення категорії"
      );
    } finally {
      setCategoryLoading(false);
    }
  }

  function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (files.length > MAX_IMAGES) {
      setError(`Можна вибрати не більше ${MAX_IMAGES} фотографій`);
      event.target.value = "";
      return;
    }

    if (files.some((file) => !allowedTypes.includes(file.type))) {
      setError("Дозволені формати фотографій: JPG, PNG, WEBP");
      event.target.value = "";
      return;
    }

    setImages(files);
    setError("");
  }

  function removeImage(index: number) {
    setImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!API_URL) {
      setError("Не налаштовано NEXT_PUBLIC_API_URL");
      return;
    }

    if (!categoryId) {
      setError("Вибери наявну категорію або створи нову");
      return;
    }

    if (images.length === 0) {
      setError("Додай хоча б одну фотографію товару");
      return;
    }

    setLoading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const image of images) {
        const formData = new FormData();
        formData.append("file", image);

        const uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const uploadResult: UploadResponse =
          await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadResult.message || "Не вдалося завантажити фото"
          );
        }

        const url =
          uploadResult.url ??
          uploadResult.data?.url ??
          uploadResult.data?.imageUrl;

        if (!url) {
          throw new Error("Сервер не повернув URL фотографії");
        }

        uploadedUrls.push(url);
      }

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          price: Number(price),
          oldPrice: oldPrice ? Number(oldPrice) : null,
          stock: Number(stock),
          images: uploadedUrls,
          categoryId: Number(categoryId),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Не вдалося створити товар"
        );
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Сталася помилка під час створення товару"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Створення товару</h1>
          <p className={styles.subtitle}>
            Заповни інформацію про новий товар
          </p>
        </div>

        <button
          type="button"
          className={styles.backButton}
          onClick={() => router.push("/admin/products")}
        >
          Назад до товарів
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="name">Назва товару</label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Наприклад, Мотоциклетні гріпси"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="mototsykletni-gripsy"
            required
          />
        </div>

        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label htmlFor="description">Опис товару</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Опиши характеристики товару..."
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="price">Ціна, грн</label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="oldPrice">Стара ціна, грн</label>
          <input
            id="oldPrice"
            type="number"
            min="0"
            step="0.01"
            value={oldPrice}
            onChange={(event) => setOldPrice(event.target.value)}
            placeholder="Необов'язково"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="stock">Кількість на складі</label>
          <input
            id="stock"
            type="number"
            min="0"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="category">Категорія</label>
          <input
            id="category"
            list="category-options"
            value={categoryInput}
            onChange={(event) =>
              handleCategoryChange(event.target.value)
            }
            placeholder="Знайти або ввести категорію"
            autoComplete="off"
            required
          />

          <datalist id="category-options">
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.name} />
            ))}
          </datalist>

          {categoryInput.trim() && !exactCategory && (
            <button
              type="button"
              className={styles.backButton}
              onClick={handleCreateCategory}
              disabled={categoryLoading}
            >
              {categoryLoading
                ? "Створення..."
                : `+ Створити категорію «${categoryInput.trim()}»`}
            </button>
          )}

          {exactCategory && (
            <p className={styles.fileName}>
              Вибрано: {exactCategory.name}
            </p>
          )}
        </div>

        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label htmlFor="images">Фотографії товару</label>
          <input
            id="images"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={handleImagesChange}
          />

          <p className={styles.imageHint}>
            JPG, PNG або WEBP. До {MAX_IMAGES} фотографій.
            Перше фото буде головним.
          </p>

          {images.length > 0 && (
            <>
              <div className={styles.previewGrid}>
                {previews.map((preview, index) => (
                  <div
                    className={styles.previewItem}
                    key={`${images[index].name}-${index}`}
                  >
                    <img
                      className={styles.previewImage}
                      src={preview}
                      alt={`Фото товару ${index + 1}`}
                    />

                    {index === 0 && (
                      <span className={styles.mainBadge}>
                        ГОЛОВНЕ
                      </span>
                    )}

                    <button
                      type="button"
                      className={styles.removeImage}
                      onClick={() => removeImage(index)}
                      aria-label={`Видалити фото ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <p className={styles.imageCount}>
                Вибрано фото: {images.length} / {MAX_IMAGES}
              </p>
            </>
          )}
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => router.push("/admin/products")}
          >
            Скасувати
          </button>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || categoryLoading}
          >
            {loading ? "Створення товару..." : "Створити товар"}
          </button>
        </div>
      </form>
    </main>
  );
}