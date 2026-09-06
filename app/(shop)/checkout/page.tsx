"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface NovaPoshtaCity {
  ref: string;
  name: string;
  area: string;
  type: string;
}

interface NovaPoshtaWarehouse {
  ref: string;
  name: string;
  number: string;
  address: string;
  category: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  /* CART */

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  /* ORDER */

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  /* CUSTOMER */

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  /* DELIVERY */

  const [delivery, setDelivery] =
    useState("nova-poshta");

  const [city, setCity] = useState("");
  const [cityRef, setCityRef] = useState("");

  const [cities, setCities] = useState<
    NovaPoshtaCity[]
  >([]);

  const [citiesLoading, setCitiesLoading] =
    useState(false);

  const [showCities, setShowCities] =
    useState(false);

  const [warehouse, setWarehouse] =
    useState("");

  const [warehouses, setWarehouses] =
    useState<NovaPoshtaWarehouse[]>([]);

  const [
    warehousesLoading,
    setWarehousesLoading,
  ] = useState(false);

  /* PAYMENT */

  const [payment, setPayment] =
    useState("cash");

  const [comment, setComment] =
    useState("");

  /* ============================= */
  /* CART */
  /* ============================= */

  useEffect(() => {
    const savedCart: CartItem[] =
      JSON.parse(
        localStorage.getItem("cart") ||
          "[]"
      );

    setCart(savedCart);
    setLoaded(true);
  }, []);

  /* ============================= */
  /* CITY SEARCH */
  /* ============================= */

  useEffect(() => {
    if (delivery !== "nova-poshta") {
      return;
    }

    if (cityRef) {
      return;
    }

    if (city.trim().length < 2) {
      setCities([]);
      return;
    }

    const controller =
      new AbortController();

    const timeout = setTimeout(
      async () => {
        try {
          setCitiesLoading(true);

          const response = await fetch(
            `/api/nova-poshta/cities?search=${encodeURIComponent(
              city.trim()
            )}`,
            {
              signal:
                controller.signal,
            }
          );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result.message ||
                "Не вдалося знайти місто"
            );
          }

          setCities(
            result.data ?? []
          );

          setShowCities(true);
        } catch (error) {
          if (
            error instanceof Error &&
            error.name ===
              "AbortError"
          ) {
            return;
          }

          console.error(
            "CITY SEARCH ERROR:",
            error
          );

          setCities([]);
        } finally {
          setCitiesLoading(false);
        }
      },
      400
    );

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [city, cityRef, delivery]);

  /* ============================= */
  /* LOAD WAREHOUSES */
  /* ============================= */

  useEffect(() => {
    if (
      delivery !== "nova-poshta" ||
      !cityRef
    ) {
      setWarehouses([]);
      return;
    }

    const controller =
      new AbortController();

    const loadWarehouses =
      async () => {
        try {
          setWarehousesLoading(true);

          const response = await fetch(
            `/api/nova-poshta/warehouses?cityRef=${encodeURIComponent(
              cityRef
            )}`,
            {
              signal:
                controller.signal,
            }
          );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result.message ||
                "Не вдалося отримати відділення"
            );
          }

          setWarehouses(
            result.data ?? []
          );
        } catch (error) {
          if (
            error instanceof Error &&
            error.name ===
              "AbortError"
          ) {
            return;
          }

          console.error(
            "WAREHOUSES ERROR:",
            error
          );

          setWarehouses([]);
        } finally {
          setWarehousesLoading(false);
        }
      };

    loadWarehouses();

    return () => {
      controller.abort();
    };
  }, [cityRef, delivery]);

  /* ============================= */
  /* TOTALS */
  /* ============================= */

  const totalQuantity = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      ),
    [cart]
  );

  const totalPrice = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          item.price *
            item.quantity,
        0
      ),
    [cart]
  );

  /* ============================= */
  /* CITY SELECT */
  /* ============================= */

  const handleCitySelect = (
    selectedCity: NovaPoshtaCity
  ) => {
    setCity(selectedCity.name);
    setCityRef(selectedCity.ref);

    setWarehouse("");
    setWarehouses([]);

    setCities([]);
    setShowCities(false);
  };

  /* ============================= */
  /* DELIVERY CHANGE */
  /* ============================= */

  const handleDeliveryChange = (
    value: string
  ) => {
    setDelivery(value);

    if (value === "pickup") {
      setCity("");
      setCityRef("");
      setWarehouse("");
      setCities([]);
      setWarehouses([]);
      setShowCities(false);
    }
  };

  /* ============================= */
  /* SUBMIT */
  /* ============================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!cart.length) {
      setError("Кошик порожній");
      return;
    }

    if (
      delivery === "nova-poshta" &&
      !cityRef
    ) {
      setError(
        "Оберіть населений пункт зі списку"
      );

      return;
    }

    if (
      delivery === "nova-poshta" &&
      !warehouse
    ) {
      setError(
        "Оберіть відділення або поштомат"
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const orderData = {
        customer: {
          name,
          phone,
          email,
        },

        delivery: {
          type: delivery,

          city:
            delivery ===
            "nova-poshta"
              ? city
              : "Самовивіз",

          department:
            delivery ===
            "nova-poshta"
              ? warehouse
              : undefined,
        },

        payment,

        comment,

        items: cart.map(
          (item) => ({
            productId: item.id,
            quantity:
              item.quantity,
          })
        ),
      };

      console.log(
        "CREATE ORDER:",
        orderData
      );

      const response = await fetch(
        "/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            orderData
          ),
        }
      );

      const text =
        await response.text();

      console.log(
        "ORDER STATUS:",
        response.status
      );

      console.log(
        "ORDER RESPONSE:",
        text
      );

      let result;

      try {
        result = text
          ? JSON.parse(text)
          : {};
      } catch {
        throw new Error(
          "Сервер повернув некоректну відповідь"
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Не вдалося оформити замовлення"
        );
      }

      localStorage.removeItem(
        "cart"
      );

      window.dispatchEvent(
        new Event("cart-updated")
      );

      router.push(
        `/checkout/success?order=${result.data.id}`
      );
    } catch (error) {
      console.error(
        "CREATE ORDER ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Не вдалося оформити замовлення"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================= */
  /* LOADING */
  /* ============================= */

  if (!loaded) {
    return (
      <main className={styles.main}>
        <div
          className={styles.container}
        >
          <div
            className={styles.loading}
          >
            Завантаження...
          </div>
        </div>
      </main>
    );
  }

  /* ============================= */
  /* EMPTY CART */
  /* ============================= */

  if (!cart.length) {
    return (
      <main className={styles.main}>
        <div
          className={styles.container}
        >
          <div className={styles.empty}>
            <span>🛒</span>

            <h1>
              Немає товарів для
              оформлення
            </h1>

            <p>
              Спочатку додай товари
              до кошика.
            </p>

            <Link
              href="/products"
              className={
                styles.catalogButton
              }
            >
              Перейти до каталогу
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ============================= */
  /* PAGE */
  /* ============================= */

  return (
    <main className={styles.main}>
      <div
        className={styles.container}
      >
        <div className={styles.header}>
          <span
            className={styles.label}
          >
            Замовлення
          </span>

          <h1>
            Оформлення замовлення
          </h1>

          <p>
            Заповни контактні дані та
            обери спосіб доставки.
          </p>
        </div>

        <form
          className={styles.layout}
          onSubmit={handleSubmit}
        >
          <div
            className={
              styles.formColumn
            }
          >
            {/* CONTACTS */}

            <section
              className={styles.card}
            >
              <div
                className={
                  styles.cardHeader
                }
              >
                <span
                  className={styles.step}
                >
                  01
                </span>

                <div>
                  <h2>
                    Контактні дані
                  </h2>

                  <p>
                    Вкажи дані
                    отримувача.
                  </p>
                </div>
              </div>

              <div
                className={styles.fields}
              >
                <div
                  className={styles.field}
                >
                  <label htmlFor="name">
                    Ім&apos;я та
                    прізвище
                  </label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Максим Іваненко"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <div
                  className={styles.field}
                >
                  <label htmlFor="phone">
                    Телефон
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    placeholder="+380 00 000 00 00"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <div
                  className={`${styles.field} ${styles.fullWidth}`}
                >
                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
              </div>
            </section>

            {/* DELIVERY */}

            <section
              className={styles.card}
            >
              <div
                className={
                  styles.cardHeader
                }
              >
                <span
                  className={styles.step}
                >
                  02
                </span>

                <div>
                  <h2>Доставка</h2>

                  <p>
                    Обери зручний спосіб
                    отримання.
                  </p>
                </div>
              </div>

              {/* DELIVERY TYPE */}

              <div
                className={
                  styles.radioGrid
                }
              >
                <label
                  className={`${
                    styles.radioCard
                  } ${
                    delivery ===
                    "nova-poshta"
                      ? styles.radioActive
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="nova-poshta"
                    checked={
                      delivery ===
                      "nova-poshta"
                    }
                    onChange={(e) =>
                      handleDeliveryChange(
                        e.target.value
                      )
                    }
                  />

                  <div>
                    <strong>
                      Нова пошта
                    </strong>

                    <span>
                      У відділення або
                      поштомат
                    </span>
                  </div>
                </label>

                <label
                  className={`${
                    styles.radioCard
                  } ${
                    delivery ===
                    "pickup"
                      ? styles.radioActive
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={
                      delivery ===
                      "pickup"
                    }
                    onChange={(e) =>
                      handleDeliveryChange(
                        e.target.value
                      )
                    }
                  />

                  <div>
                    <strong>
                      Самовивіз
                    </strong>

                    <span>
                      Забрати замовлення
                      самостійно
                    </span>
                  </div>
                </label>
              </div>

              {/* NOVA POSHTA */}

              {delivery ===
                "nova-poshta" && (
                <div
                  className={
                    styles.deliveryFields
                  }
                >
                  {/* CITY */}

                  <div
                    className={`${styles.field} ${styles.fullWidth} ${styles.cityField}`}
                  >
                    <label htmlFor="city">
                      Населений пункт
                    </label>

                    <div
                      className={
                        styles.autocomplete
                      }
                    >
                      <input
                        id="city"
                        type="text"
                        autoComplete="off"
                        placeholder="Почніть вводити місто..."
                        value={city}
                        onChange={(e) => {
                          setCity(
                            e.target.value
                          );

                          setCityRef("");
                          setWarehouse("");
                          setWarehouses(
                            []
                          );

                          setShowCities(
                            true
                          );
                        }}
                        onFocus={() => {
                          if (
                            cities.length
                          ) {
                            setShowCities(
                              true
                            );
                          }
                        }}
                        required
                      />

                      {citiesLoading && (
                        <span
                          className={
                            styles.inputLoader
                          }
                        >
                          Пошук...
                        </span>
                      )}

                      {showCities &&
                        city.length >= 2 &&
                        !citiesLoading && (
                          <div
                            className={
                              styles.cityDropdown
                            }
                          >
                            {cities.length >
                            0 ? (
                              cities.map(
                                (
                                  item
                                ) => (
                                  <button
                                    key={
                                      item.ref
                                    }
                                    type="button"
                                    className={
                                      styles.cityOption
                                    }
                                    onClick={() =>
                                      handleCitySelect(
                                        item
                                      )
                                    }
                                  >
                                    <strong>
                                      {
                                        item.name
                                      }
                                    </strong>

                                    <span>
                                      {[
                                        item.type,
                                        item.area
                                          ? `${item.area} обл.`
                                          : "",
                                      ]
                                        .filter(
                                          Boolean
                                        )
                                        .join(
                                          ", "
                                        )}
                                    </span>
                                  </button>
                                )
                              )
                            ) : (
                              <div
                                className={
                                  styles.noCities
                                }
                              >
                                Населений
                                пункт не
                                знайдено
                              </div>
                            )}
                          </div>
                        )}
                    </div>

                    {cityRef && (
                      <span
                        className={
                          styles.selectedHint
                        }
                      >
                        ✓ Населений пункт
                        обрано
                      </span>
                    )}
                  </div>

                  {/* WAREHOUSE */}

                  <div
                    className={`${styles.field} ${styles.fullWidth}`}
                  >
                    <label htmlFor="warehouse">
                      Відділення /
                      поштомат
                    </label>

                    <select
                      id="warehouse"
                      value={warehouse}
                      onChange={(e) =>
                        setWarehouse(
                          e.target.value
                        )
                      }
                      disabled={
                        !cityRef ||
                        warehousesLoading
                      }
                      required
                    >
                      <option value="">
                        {!cityRef
                          ? "Спочатку оберіть населений пункт"
                          : warehousesLoading
                          ? "Завантаження відділень..."
                          : "Оберіть відділення або поштомат"}
                      </option>

                      {warehouses.map(
                        (item) => (
                          <option
                            key={
                              item.ref
                            }
                            value={
                              item.name
                            }
                          >
                            {item.name}
                          </option>
                        )
                      )}
                    </select>

                    {cityRef &&
                      !warehousesLoading &&
                      warehouses.length >
                        0 && (
                        <span
                          className={
                            styles.warehouseCount
                          }
                        >
                          Знайдено:{" "}
                          {
                            warehouses.length
                          }
                        </span>
                      )}
                  </div>
                </div>
              )}

              {delivery ===
                "pickup" && (
                <div
                  className={
                    styles.pickupInfo
                  }
                >
                  <span>📍</span>

                  <div>
                    <strong>
                      Самовивіз
                    </strong>

                    <p>
                      Після оформлення
                      замовлення менеджер
                      зв&apos;яжеться з
                      вами та повідомить
                      адресу і час
                      отримання.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* PAYMENT */}

            <section
              className={styles.card}
            >
              <div
                className={
                  styles.cardHeader
                }
              >
                <span
                  className={styles.step}
                >
                  03
                </span>

                <div>
                  <h2>Оплата</h2>

                  <p>
                    Обери спосіб оплати.
                  </p>
                </div>
              </div>

              <div
                className={
                  styles.radioGrid
                }
              >
                <label
                  className={`${
                    styles.radioCard
                  } ${
                    payment === "cash"
                      ? styles.radioActive
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={
                      payment === "cash"
                    }
                    onChange={(e) =>
                      setPayment(
                        e.target.value
                      )
                    }
                  />

                  <div>
                    <strong>
                      При отриманні
                    </strong>

                    <span>
                      Оплата після
                      отримання
                    </span>
                  </div>
                </label>

                <label
                  className={`${
                    styles.radioCard
                  } ${
                    payment === "card"
                      ? styles.radioActive
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={
                      payment === "card"
                    }
                    onChange={(e) =>
                      setPayment(
                        e.target.value
                      )
                    }
                  />

                  <div>
                    <strong>
                      Карткою
                    </strong>

                    <span>
                      Онлайн-оплата
                    </span>
                  </div>
                </label>
              </div>
            </section>

            {/* COMMENT */}

            <section
              className={styles.card}
            >
              <div
                className={
                  styles.cardHeader
                }
              >
                <span
                  className={styles.step}
                >
                  04
                </span>

                <div>
                  <h2>Коментар</h2>

                  <p>
                    Необов&apos;язково.
                  </p>
                </div>
              </div>

              <div
                className={`${styles.field} ${styles.fullWidth}`}
              >
                <textarea
                  placeholder="Наприклад: зателефонувати перед відправленням..."
                  value={comment}
                  onChange={(e) =>
                    setComment(
                      e.target.value
                    )
                  }
                />
              </div>
            </section>
          </div>

          {/* SUMMARY */}

          <aside
            className={styles.summary}
          >
            <h2>
              Ваше замовлення
            </h2>

            <div
              className={styles.products}
            >
              {cart.map((item) => (
                <div
                  key={item.id}
                  className={
                    styles.product
                  }
                >
                  <div
                    className={
                      styles.productImage
                    }
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <span>—</span>
                    )}
                  </div>

                  <div
                    className={
                      styles.productInfo
                    }
                  >
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.quantity} ×{" "}
                      {item.price} грн
                    </span>
                  </div>

                  <strong
                    className={
                      styles.productTotal
                    }
                  >
                    {item.price *
                      item.quantity}{" "}
                    грн
                  </strong>
                </div>
              ))}
            </div>

            <div
              className={styles.divider}
            />

            <div
              className={
                styles.summaryRow
              }
            >
              <span>Товарів</span>

              <strong>
                {totalQuantity}
              </strong>
            </div>

            <div
              className={
                styles.summaryRow
              }
            >
              <span>Доставка</span>

              <strong>
                За тарифами
              </strong>
            </div>

            <div
              className={styles.divider}
            />

            <div
              className={styles.total}
            >
              <span>Разом</span>

              <strong>
                {totalPrice} грн
              </strong>
            </div>

            {error && (
              <p
                className={styles.error}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className={styles.submit}
              disabled={submitting}
            >
              {submitting
                ? "Оформлення..."
                : "Підтвердити замовлення"}
            </button>

            <Link
              href="/cart"
              className={styles.back}
            >
              ← Повернутися до кошика
            </Link>
          </aside>
        </form>
      </div>
    </main>
  );
}