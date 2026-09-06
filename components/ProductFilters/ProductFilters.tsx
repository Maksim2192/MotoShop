"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import styles from "./ProductFilters.module.css";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  basePath?: string;
}

export default function ProductFilters({
  categories,
  basePath = "/products",
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [discount, setDiscount] =
    useState(false);

  const [sort, setSort] =
    useState("");

  useEffect(() => {
    setSearch(
      searchParams.get("search") ?? ""
    );

    setCategory(
      searchParams.get("category") ?? ""
    );

    setMinPrice(
      searchParams.get("minPrice") ?? ""
    );

    setMaxPrice(
      searchParams.get("maxPrice") ?? ""
    );

    setDiscount(
      searchParams.get("discount") ===
        "true"
    );

    setSort(
      searchParams.get("sort") ?? ""
    );
  }, [searchParams]);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const params =
      new URLSearchParams();

    if (search.trim()) {
      params.set(
        "search",
        search.trim()
      );
    }

    if (category) {
      params.set(
        "category",
        category
      );
    }

    if (minPrice) {
      params.set(
        "minPrice",
        minPrice
      );
    }

    if (maxPrice) {
      params.set(
        "maxPrice",
        maxPrice
      );
    }

    if (discount) {
      params.set(
        "discount",
        "true"
      );
    }

    if (sort) {
      params.set(
        "sort",
        sort
      );
    }

    // Після зміни фільтрів
    // повертаємося на першу сторінку
    params.set(
      "page",
      "1"
    );

    const query =
      params.toString();

    router.push(
      query
        ? `${basePath}?${query}`
        : basePath
    );
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setDiscount(false);
    setSort("");

    router.push(basePath);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.filters}
    >
      <div className={styles.top}>
        <h2>Фільтри</h2>

        <button
          type="button"
          onClick={handleReset}
          className={styles.reset}
        >
          Скинути
        </button>
      </div>

      <div className={styles.field}>
        <label htmlFor="search">
          Пошук
        </label>

        <input
          id="search"
          type="text"
          placeholder="Назва товару..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="category">
          Категорія
        </label>

        <select
          id="category"
          value={category}
          onChange={(event) =>
            setCategory(
              event.target.value
            )
          }
        >
          <option value="">
            Всі категорії
          </option>

          {categories.map(
            (item) => (
              <option
                key={item.id}
                value={item.slug}
              >
                {item.name}
              </option>
            )
          )}
        </select>
      </div>

      <div className={styles.field}>
        <label>Ціна</label>

        <div
          className={
            styles.priceInputs
          }
        >
          <input
            type="number"
            min="0"
            placeholder="Від"
            value={minPrice}
            onChange={(event) =>
              setMinPrice(
                event.target.value
              )
            }
          />

          <input
            type="number"
            min="0"
            placeholder="До"
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(
                event.target.value
              )
            }
          />
        </div>
      </div>

      <label
        className={
          styles.checkbox
        }
      >
        <input
          type="checkbox"
          checked={discount}
          onChange={(event) =>
            setDiscount(
              event.target.checked
            )
          }
        />

        <span>
          Тільки зі знижкою
        </span>
      </label>

      <div className={styles.field}>
        <label htmlFor="sort">
          Сортування
        </label>

        <select
          id="sort"
          value={sort}
          onChange={(event) =>
            setSort(
              event.target.value
            )
          }
        >
          <option value="">
            За замовчуванням
          </option>

          <option value="price-asc">
            Від дешевих до дорогих
          </option>

          <option value="price-desc">
            Від дорогих до дешевих
          </option>

          <option value="name-asc">
            Назва А–Я
          </option>

          <option value="name-desc">
            Назва Я–А
          </option>
        </select>
      </div>

      <button
        type="submit"
        className={styles.submit}
      >
        Застосувати
      </button>
    </form>
  );
}