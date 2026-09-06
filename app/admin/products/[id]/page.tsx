"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Product } from "@/src/types/product";
import styles from "./page.module.css";

interface Category {
id: number;
name: string;
slug: string;
createdAt: string;
}

interface ProductResponse {
data: Product;
}

interface UploadResponse {
data: {
url: string;
};
}

export default function EditProductPage() {
const router = useRouter();
const params = useParams();

const id = params.id as string;

const [product, setProduct] = useState<Product | null>(null);
const [categories, setCategories] = useState<Category[]>([]);

const [name, setName] = useState("");
const [slug, setSlug] = useState("");
const [description, setDescription] = useState("");

const [price, setPrice] = useState("");
const [oldPrice, setOldPrice] = useState("");
const [stock, setStock] = useState("");

const [categoryId, setCategoryId] = useState("");

const [currentImage, setCurrentImage] = useState("");
const [newImage, setNewImage] = useState<File | null>(null);

const [error, setError] = useState("");
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

useEffect(() => {
    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [productResponse, categoriesResponse] =
                await Promise.all([
                    fetch(`/api/admin/products/${id}`, {
                        cache: "no-store",
                    }),

                    fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
                        {
                            cache: "no-store",
                        }
                    ),
                ]);

            if (!productResponse.ok) {
                throw new Error("Не вдалося завантажити товар");
            }

            if (!categoriesResponse.ok) {
                throw new Error("Не вдалося завантажити категорії");
            }

            const productResult: ProductResponse =
                await productResponse.json();

            const categoriesResult =
                await categoriesResponse.json();

            const loadedProduct = productResult.data;

            setProduct(loadedProduct);
            setCategories(categoriesResult.data);

            setName(loadedProduct.name);
            setSlug(loadedProduct.slug);
            setDescription(loadedProduct.description);

            setPrice(String(loadedProduct.price));

            setOldPrice(
                loadedProduct.oldPrice !== null
                    ? String(loadedProduct.oldPrice)
                    : ""
            );

            setStock(String(loadedProduct.stock));

            setCategoryId(String(loadedProduct.categoryId));

            setCurrentImage(
                loadedProduct.images?.[0] ?? ""
            );
        } catch (error) {
            console.error("LOAD PRODUCT ERROR:", error);

            setError("Не вдалося завантажити товар");
        } finally {
            setLoading(false);
        }
    };

    if (id) {
        loadData();
    }
}, [id]);

const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
) => {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
        let imageUrl = currentImage;

        // Завантажуємо нове фото, якщо воно вибране
        if (newImage) {
            const formData = new FormData();

            formData.append("file", newImage);

            const uploadResponse = await fetch(
                "/api/admin/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const uploadResult: UploadResponse | {
                message?: string;
            } = await uploadResponse.json();

            console.log(
                "UPLOAD RESPONSE:",
                uploadResult
            );

            if (!uploadResponse.ok) {
                setError(
                    "message" in uploadResult
                        ? uploadResult.message ||
                          "Не вдалося завантажити нове фото"
                        : "Не вдалося завантажити нове фото"
                );

                return;
            }

            if (
                !("data" in uploadResult) ||
                !uploadResult.data?.url
            ) {
                console.error(
                    "Некоректна відповідь upload:",
                    uploadResult
                );

                setError(
                    "Сервер не повернув URL фотографії"
                );

                return;
            }

            imageUrl = uploadResult.data.url;
        }

        // Оновлюємо товар
        const response = await fetch(
            `/api/admin/products/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    slug,
                    description,
                    price: Number(price),
                    oldPrice: oldPrice
                        ? Number(oldPrice)
                        : null,
                    stock: Number(stock),
                    images: imageUrl
                        ? [imageUrl]
                        : [],
                    categoryId: Number(categoryId),
                }),
            }
        );

        const result = await response.json();

        console.log(
            "UPDATE PRODUCT RESPONSE:",
            result
        );

        if (!response.ok) {
            setError(
                result.message ||
                "Не вдалося оновити товар"
            );

            return;
        }

        router.push("/admin/products");
        router.refresh();
    } catch (error) {
        console.error(
            "UPDATE PRODUCT ERROR:",
            error
        );

        setError(
            "Помилка при оновленні товару"
        );
    } finally {
        setSaving(false);
    }
};

if (loading) {
    return (
        <section className={styles.container}>
            <div className={styles.loading}>
                Завантаження товару...
            </div>
        </section>
    );
}

if (!product) {
    return (
        <section className={styles.container}>
            <div className={styles.error}>
                {error || "Товар не знайдено"}
            </div>

            <button
                type="button"
                className={styles.backButton}
                onClick={() =>
                    router.push("/admin/products")
                }
            >
                ← Назад до товарів
            </button>
        </section>
    );
}

return (
    <section className={styles.container}>
        <div className={styles.header}>
            <div>
                <h1 className={styles.title}>
                    Редагувати товар
                </h1>

                <p className={styles.subtitle}>
                    Змініть інформацію про товар
                </p>
            </div>

            <button
                type="button"
                className={styles.backButton}
                onClick={() =>
                    router.push("/admin/products")
                }
                disabled={saving}
            >
                ← Назад
            </button>
        </div>

        <form
            onSubmit={handleSubmit}
            className={styles.form}
        >
            <div className={styles.field}>
                <label htmlFor="name">
                    Назва товару
                </label>

                <input
                    id="name"
                    type="text"
                    placeholder="Наприклад: Lock-On гріпси"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    required
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="slug">
                    Slug
                </label>

                <input
                    id="slug"
                    type="text"
                    placeholder="lock-on-grips"
                    value={slug}
                    onChange={(e) =>
                        setSlug(e.target.value)
                    }
                    required
                />
            </div>

            <div
                className={`${styles.field} ${styles.fullWidth}`}
            >
                <label htmlFor="description">
                    Опис
                </label>

                <textarea
                    id="description"
                    placeholder="Опис товару..."
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    required
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="price">
                    Ціна
                </label>

                <input
                    id="price"
                    type="number"
                    min="1"
                    placeholder="449"
                    value={price}
                    onChange={(e) =>
                        setPrice(e.target.value)
                    }
                    required
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="oldPrice">
                    Стара ціна
                </label>

                <input
                    id="oldPrice"
                    type="number"
                    min="1"
                    placeholder="499"
                    value={oldPrice}
                    onChange={(e) =>
                        setOldPrice(e.target.value)
                    }
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="stock">
                    Залишок
                </label>

                <input
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="10"
                    value={stock}
                    onChange={(e) =>
                        setStock(e.target.value)
                    }
                    required
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="category">
                    Категорія
                </label>

                <select
                    id="category"
                    value={categoryId}
                    onChange={(e) =>
                        setCategoryId(e.target.value)
                    }
                    required
                >
                    <option value="">
                        Оберіть категорію
                    </option>

                    {categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div
                className={`${styles.field} ${styles.fullWidth}`}
            >
                <label>
                    Поточне фото
                </label>

                {currentImage ? (
                    <div className={styles.currentImage}>
                        <img
                            src={currentImage}
                            alt={name}
                        />
                    </div>
                ) : (
                    <p>
                        Фото відсутнє
                    </p>
                )}
            </div>

            <div
                className={`${styles.field} ${styles.fullWidth}`}
            >
                <label htmlFor="image">
                    Замінити фото
                </label>

                <input
                    id="image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                        const file =
                            e.target.files?.[0];

                        setNewImage(file ?? null);
                    }}
                />

                {newImage && (
                    <p className={styles.fileName}>
                        Нове фото: {newImage.name}
                    </p>
                )}
            </div>

            {error && (
                <p className={styles.error}>
                    {error}
                </p>
            )}

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() =>
                        router.push("/admin/products")
                    }
                    disabled={saving}
                >
                    Скасувати
                </button>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={saving}
                >
                    {saving
                        ? "Збереження..."
                        : "Зберегти зміни"}
                </button>
            </div>
        </form>
    </section>
);

}
