import Link from "next/link";
import styles from "./page.module.css";
import AddToCart from "@/components/AddToCart/AddToCart";
import ProductReviews from "@/components/ProductReviews/ProductReviews";
import ProductGallery from "@/components/ProductGallery/ProductGallery";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/slug/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return (
      <main className={styles.main}>
        <div className={styles.notFound}>
          <h1>Товар не знайдено</h1>

          <Link href="/products">
            Повернутися до каталогу
          </Link>
        </div>
      </main>
    );
  }

  const result = await response.json();
  const product = result.data;

  const discount =
    product.oldPrice !== null &&
      product.oldPrice > product.price
      ? Math.round(
        ((product.oldPrice - product.price) /
          product.oldPrice) *
        100
      )
      : 0;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Link href="/">
            Головна
          </Link>

          <span>/</span>

          <Link href="/products">
            Каталог
          </Link>

          {product.category && (
            <>
              <span>/</span>

              <Link
                href={`/products?category=${product.category.slug}`}
              >
                {product.category.name}
              </Link>
            </>
          )}

          <span>/</span>

          <span>
            {product.name}
          </span>
        </div>

        <section className={styles.product}>
         <ProductGallery
  images={product.images ?? []}
  name={product.name}
  discount={discount}
/>

          <div className={styles.info}>
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className={styles.category}
              >
                {product.category.name}
              </Link>
            )}

            <h1 className={styles.title}>
              {product.name}
            </h1>

            <div className={styles.meta}>
              <div className={styles.rating}>
                <span>★</span>

                <strong>
                  {product.rating ?? 0}
                </strong>
              </div>

              <span className={styles.article}>
                Код товару: {product.id}
              </span>
            </div>

            <div className={styles.priceBlock}>
              <span className={styles.price}>
                {product.price} грн
              </span>

              {product.oldPrice !== null &&
                product.oldPrice >
                product.price && (
                  <span
                    className={styles.oldPrice}
                  >
                    {product.oldPrice} грн
                  </span>
                )}

              {discount > 0 && (
                <span
                  className={styles.discountText}
                >
                  Економія {discount}%
                </span>
              )}
            </div>

            <div className={styles.stock}>
              <span
                className={
                  product.stock > 0
                    ? styles.stockDot
                    : styles.stockDotEmpty
                }
              />

              {product.stock > 0
                ? `В наявності — ${product.stock} шт.`
                : "Немає в наявності"}
            </div>

            {product.description && (
              <p className={styles.shortDescription}>
                {product.description}
              </p>
            )}

            <AddToCart
              productId={product.id}
              name={product.name}
              price={product.price}
              image={product.images?.[0] ?? ""}
              stock={product.stock}
            />

            <div className={styles.features}>
              <div>
                <span>🚚</span>

                <div>
                  <strong>
                    Швидка доставка
                  </strong>

                  <p>
                    Відправлення по Україні
                  </p>
                </div>
              </div>

              <div>
                <span>✓</span>

                <div>
                  <strong>
                    Гарантія якості
                  </strong>

                  <p>
                    Перевірені товари
                  </p>
                </div>
              </div>

              <div>
                <span>↩</span>

                <div>
                  <strong>
                    Повернення
                  </strong>

                  <p>
                    Простий обмін товару
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className={styles.descriptionSection}
        >
          <h2>
            Опис товару
          </h2>

          <p>
            {product.description ||
              "Опис для цього товару поки відсутній."}
          </p>

        </section>
        <ProductReviews
            productId={product.id}
          />
      </div>
    </main>
  );
}