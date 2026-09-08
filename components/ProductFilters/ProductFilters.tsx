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
  const searchParams = useSearchParams();

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

    const normalizedSearch =
      search.trim();

    const min = Number(minPrice);
    const max = Number(maxPrice);

    if (normalizedSearch) {
      params.set(
        "search",
        normalizedSearch
      );
    }

    if (category) {
      params.set(
        "category",
        category
      );
    }

    if (
      minPrice !== "" &&
      Number.isFinite(min) &&
      min >= 0
    ) {
      params.set(
        "minPrice",
        String(min)
      );
    }

    if (
      maxPrice !== "" &&
      Number.isFinite(max) &&
      max >= 0
    ) {
      params.set(
        "maxPrice",
        String(max)
      );
    }

    if (
      discount
    ) {
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

    params.set("page", "1");

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
        <div>
          <span className={styles.eyebrow}>
            Каталог
          </span>

          <h2>Фільтри</h2>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className={styles.reset}
        >
          Очистити
        </button>
      </div>

      {/* SEARCH */}

      <div className={styles.field}>
        <label htmlFor="product-search">
          Пошук
        </label>

        <div className={styles.inputWrapper}>
          <span
            className={styles.inputIcon}
            aria-hidden="true"
          >
            ⌕
          </span>

          <input
            id="product-search"
            type="search"
            placeholder="Назва товару..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </div>
      </div>

      {/* CATEGORY */}

      <div className={styles.field}>
        <label htmlFor="product-category">
          Категорія
        </label>

        <select
          id="product-category"
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

      {/* PRICE */}

      <div className={styles.field}>
        <label>
          Ціна
        </label>

        <div
          className={
            styles.priceInputs
          }
        >
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Від"
            aria-label="Мінімальна ціна"
            value={minPrice}
            onChange={(event) =>
              setMinPrice(
                event.target.value
              )
            }
          />

          <span
            className={styles.priceDash}
            aria-hidden="true"
          >
            —
          </span>

          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="До"
            aria-label="Максимальна ціна"
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(
                event.target.value
              )
            }
          />
        </div>
      </div>

      {/* DISCOUNT */}

      <label
        className={styles.checkbox}
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

        <span
          className={styles.checkboxMark}
        />

        <span>
          Тільки зі знижкою
        </span>
      </label>

      {/* SORT */}

      <div className={styles.field}>
        <label htmlFor="product-sort">
          Сортування
        </label>

        <select
          id="product-sort"
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
        Застосувати фільтри
        <span aria-hidden="true">
          →
        </span>
      </button>
    </form>
  );
}