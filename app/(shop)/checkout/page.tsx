
"use client";

import {
  type FormEvent,
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getOrderError(result: unknown): string {
  let payload: unknown = result;

  if (isRecord(payload) && "message" in payload) {
    payload = payload.message;
  }

  if (typeof payload === "string") {
    const message = payload;

    try {
      const parsed: unknown = JSON.parse(message);
      return getOrderError(parsed);
    } catch {
      if (message.includes("Некоректний email")) {
        return "Вкажіть коректну адресу електронної пошти.";
      }

      if (message.includes("Некоректний номер телефону")) {
        return "Вкажіть коректний номер телефону (не менше 8 цифр).";
      }

      if (message.trim().startsWith("[")) {
        return "Перевірте правильність введених контактних даних.";
      }

      return message || "Не вдалося оформити замовлення.";
    }
  }

  if (Array.isArray(payload)) {
    const messages = new Set<string>();

    for (const item of payload) {
      if (!isRecord(item)) continue;

      const path = Array.isArray(item.path) ? item.path : [];
      const field = path.find((part) => typeof part === "string");

      if (path.includes("email")) {
        messages.add("Вкажіть коректну адресу електронної пошти.");
      } else if (path.includes("phone")) {
        messages.add(
          "Вкажіть коректний номер телефону (не менше 8 цифр)."
        );
      } else if (path.includes("name")) {
        messages.add("Перевірте ім'я та прізвище.");
      } else if (typeof field === "string") {
        messages.add("Перевірте правильність заповнення форми.");
      }
    }

    return (
      [...messages].join(" ") ||
      "Перевірте введені дані та спробуйте ще раз."
    );
  }

  return "Не вдалося оформити замовлення. Перевірте введені дані.";
}

export default function CheckoutPage() {
  const router = useRouter();

  // КОШИК
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // ЗАМОВЛЕННЯ
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // КОНТАКТНІ ДАНІ
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // ДОСТАВКА
  const [delivery, setDelivery] = useState("nova-poshta");
  const [city, setCity] = useState("");
  const [cityRef, setCityRef] = useState("");
  const [cities, setCities] = useState<NovaPoshtaCity[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [showCities, setShowCities] = useState(false);
  const [warehouse, setWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState<NovaPoshtaWarehouse[]>([]);
  const [warehousesLoading, setWarehousesLoading] = useState(false);

  // ОПЛАТА
  const [payment, setPayment] = useState("cash");
  const [comment, setComment] = useState("");

  // ЗАВАНТАЖЕННЯ КОШИКА
  useEffect(() => {
    try {
      const savedCart: unknown = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      setCart(Array.isArray(savedCart) ? (savedCart as CartItem[]) : []);
    } catch {
      setCart([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  // ПОШУК МІСТ НОВОЇ ПОШТИ
  useEffect(() => {
    if (delivery !== "nova-poshta" || cityRef) {
      setCitiesLoading(false);
      return;
    }

    if (city.trim().length < 2) {
      setCities([]);
      setCitiesLoading(false);
      setShowCities(false);
      return;
    }

    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      try {
        setCitiesLoading(true);

        const response = await fetch(
          `/api/nova-poshta/cities?search=${encodeURIComponent(city.trim())}`,
          { signal: controller.signal }
        );

        const result: unknown = await response.json();

        if (!response.ok) {
          throw new Error("Не вдалося знайти населений пункт.");
        }

        const data =
          isRecord(result) && Array.isArray(result.data)
            ? (result.data as NovaPoshtaCity[])
            : [];

        setCities(data);
        setShowCities(true);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        console.error("CITY SEARCH ERROR:", err);
        setCities([]);
      } finally {
        if (!controller.signal.aborted) {
          setCitiesLoading(false);
        }
      }
    }, 400);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [city, cityRef, delivery]);

  // ЗАВАНТАЖЕННЯ ВІДДІЛЕНЬ
  useEffect(() => {
    if (delivery !== "nova-poshta" || !cityRef) {
      setWarehouses([]);
      setWarehousesLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadWarehouses() {
      try {
        setWarehousesLoading(true);

        const response = await fetch(
          `/api/nova-poshta/warehouses?cityRef=${encodeURIComponent(cityRef)}`,
          { signal: controller.signal }
        );

        const result: unknown = await response.json();

        if (!response.ok) {
          throw new Error("Не вдалося отримати відділення.");
        }

        const data =
          isRecord(result) && Array.isArray(result.data)
            ? (result.data as NovaPoshtaWarehouse[])
            : [];

        setWarehouses(data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        console.error("WAREHOUSES ERROR:", err);
        setWarehouses([]);
      } finally {
        if (!controller.signal.aborted) {
          setWarehousesLoading(false);
        }
      }
    }

    void loadWarehouses();

    return () => controller.abort();
  }, [cityRef, delivery]);

  // ПІДСУМКИ
  const totalQuantity = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  // ВИБІР МІСТА
  const handleCitySelect = (selectedCity: NovaPoshtaCity) => {
    setCity(selectedCity.name);
    setCityRef(selectedCity.ref);
    setWarehouse("");
    setWarehouses([]);
    setCities([]);
    setShowCities(false);
    setError("");
  };

  // ЗМІНА СПОСОБУ ДОСТАВКИ
  const handleDeliveryChange = (value: string) => {
    setDelivery(value);
    setError("");

    if (value === "pickup") {
      setCity("");
      setCityRef("");
      setWarehouse("");
      setCities([]);
      setWarehouses([]);
      setShowCities(false);
    }
  };

  // ОФОРМЛЕННЯ ЗАМОВЛЕННЯ
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (submitting) return;

    if (cart.length === 0) {
      setError("Кошик порожній.");
      return;
    }

    const normalizedName = name.trim();
    const normalizedPhone = phone.trim();
    const normalizedEmail = email.trim();
    const phoneDigits = normalizedPhone.replace(/\D/g, "");

    if (!normalizedName) {
      setError("Вкажіть ім'я та прізвище.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Вкажіть коректну адресу електронної пошти.");
      return;
    }

    if (phoneDigits.length < 8) {
      setError("Вкажіть коректний номер телефону (не менше 8 цифр).");
      return;
    }

    if (delivery === "nova-poshta" && !cityRef) {
      setError("Оберіть населений пункт зі списку.");
      return;
    }

    if (delivery === "nova-poshta" && !warehouse) {
      setError("Оберіть відділення або поштомат.");
      return;
    }

    try {
      setSubmitting(true);

      const orderData = {
        customer: {
          name: normalizedName,
          phone: normalizedPhone,
          email: normalizedEmail,
        },
        delivery: {
          type: delivery,
          city: delivery === "nova-poshta" ? city : "Самовивіз",
          department: delivery === "nova-poshta" ? warehouse : undefined,
        },
        payment,
        comment: comment.trim(),
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const responseText = await response.text();
      let result: unknown;

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        setError("Сервер повернув некоректну відповідь.");
        return;
      }

      if (!response.ok) {
        console.error("ORDER RESPONSE:", result);
        setError(getOrderError(result));
        return;
      }

      // БЕЗПЕЧНО ОТРИМУЄМО ID ЗАМОВЛЕННЯ
      let orderId: string | number | undefined;

      if (isRecord(result) && "data" in result) {
        const data = result.data;

        if (isRecord(data) && "id" in data) {
          if (
            typeof data.id === "string" ||
            typeof data.id === "number"
          ) {
            orderId = data.id;
          }
        }
      }

      if (orderId === undefined || orderId === null) {
        setError(
          "Замовлення могло бути створене, але сервер не повернув його номер. Перевірте замовлення перед повторною спробою."
        );
        return;
      }

      // ОЧИЩЕННЯ КОШИКА ПІСЛЯ УСПІШНОГО СТВОРЕННЯ
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart-updated"));

      router.push(
        `/checkout/success?order=${encodeURIComponent(String(orderId))}`
      );
    } catch (err) {
      console.error("CREATE ORDER ERROR:", err);
      setError("Не вдалося зв'язатися із сервером. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  };

  // ЗАВАНТАЖЕННЯ
  if (!loaded) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loading}>Завантаження...</div>
        </div>
      </main>
    );
  }

  // ПОРОЖНІЙ КОШИК
  if (!cart.length) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <span>🛒</span>
            <h1>Немає товарів для оформлення</h1>
            <p>Спочатку додай товари до кошика.</p>
            <Link href="/products" className={styles.catalogButton}>
              Перейти до каталогу
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // СТОРІНКА ОФОРМЛЕННЯ
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Замовлення</span>
          <h1>Оформлення замовлення</h1>
          <p>Заповни контактні дані та обери спосіб доставки.</p>
        </div>

        <form className={styles.layout} onSubmit={handleSubmit}>
          <div className={styles.formColumn}>
            {/* КОНТАКТНІ ДАНІ */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.step}>01</span>
                <div>
                  <h2>Контактні дані</h2>
                  <p>Вкажи дані отримувача.</p>
                </div>
              </div>

              <div className={styles.fields}>
                <div className={styles.field}>
                  <label htmlFor="name">Ім&apos;я та прізвище</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Максим Іваненко"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="phone">Телефон</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+380 00 000 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    required
                  />
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
            </section>

            {/* ДОСТАВКА */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.step}>02</span>
                <div>
                  <h2>Доставка</h2>
                  <p>Обери зручний спосіб отримання.</p>
                </div>
              </div>

              <div className={styles.radioGrid}>
                <label
                  className={`${styles.radioCard} ${
                    delivery === "nova-poshta" ? styles.radioActive : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="nova-poshta"
                    checked={delivery === "nova-poshta"}
                    onChange={(e) => handleDeliveryChange(e.target.value)}
                  />
                  <div>
                    <strong>Нова пошта</strong>
                    <span>У відділення або поштомат</span>
                  </div>
                </label>

                <label
                  className={`${styles.radioCard} ${
                    delivery === "pickup" ? styles.radioActive : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={delivery === "pickup"}
                    onChange={(e) => handleDeliveryChange(e.target.value)}
                  />
                  <div>
                    <strong>Самовивіз</strong>
                    <span>Забрати замовлення самостійно</span>
                  </div>
                </label>
              </div>

              {delivery === "nova-poshta" && (
                <div className={styles.deliveryFields}>
                  <div
                    className={`${styles.field} ${styles.fullWidth} ${styles.cityField}`}
                  >
                    <label htmlFor="city">Населений пункт</label>
                    <div className={styles.autocomplete}>
                      <input
                        id="city"
                        type="text"
                        autoComplete="off"
                        placeholder="Почніть вводити місто..."
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          setCityRef("");
                          setWarehouse("");
                          setWarehouses([]);
                          setShowCities(true);
                          setError("");
                        }}
                        onFocus={() => {
                          if (cities.length > 0) {
                            setShowCities(true);
                          }
                        }}
                        required
                      />

                      {citiesLoading && (
                        <span className={styles.inputLoader}>
                          Пошук...
                        </span>
                      )}

                      {showCities &&
                        city.trim().length >= 2 &&
                        !citiesLoading && (
                          <div className={styles.cityDropdown}>
                            {cities.length > 0 ? (
                              cities.map((item) => (
                                <button
                                  key={item.ref}
                                  type="button"
                                  className={styles.cityOption}
                                  onClick={() => handleCitySelect(item)}
                                >
                                  <strong>{item.name}</strong>
                                  <span>
                                    {[
                                      item.type,
                                      item.area ? `${item.area} обл.` : "",
                                    ]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <div className={styles.noCities}>
                                Населений пункт не знайдено
                              </div>
                            )}
                          </div>
                        )}
                    </div>

                    {cityRef && (
                      <span className={styles.selectedHint}>
                        ✓ Населений пункт обрано
                      </span>
                    )}
                  </div>

                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label htmlFor="warehouse">
                      Відділення / поштомат
                    </label>
                    <select
                      id="warehouse"
                      value={warehouse}
                      onChange={(e) => setWarehouse(e.target.value)}
                      disabled={!cityRef || warehousesLoading}
                      required
                    >
                      <option value="">
                        {!cityRef
                          ? "Спочатку оберіть населений пункт"
                          : warehousesLoading
                            ? "Завантаження відділень..."
                            : "Оберіть відділення або поштомат"}
                      </option>

                      {warehouses.map((item) => (
                        <option key={item.ref} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    {cityRef &&
                      !warehousesLoading &&
                      warehouses.length > 0 && (
                        <span className={styles.warehouseCount}>
                          Знайдено: {warehouses.length}
                        </span>
                      )}
                  </div>
                </div>
              )}

              {delivery === "pickup" && (
                <div className={styles.pickupInfo}>
                  <span>📍</span>
                  <div>
                    <strong>Самовивіз</strong>
                    <p>
                      Після оформлення замовлення менеджер зв&apos;яжеться
                      з вами та повідомить адресу і час отримання.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* ОПЛАТА */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.step}>03</span>
                <div>
                  <h2>Оплата</h2>
                  <p>Обери спосіб оплати.</p>
                </div>
              </div>

              <div className={styles.radioGrid}>
                <label
                  className={`${styles.radioCard} ${
                    payment === "cash" ? styles.radioActive : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={payment === "cash"}
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  <div>
                    <strong>При отриманні</strong>
                    <span>Оплата після отримання</span>
                  </div>
                </label>

                <label
                  className={`${styles.radioCard} ${
                    payment === "card" ? styles.radioActive : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={payment === "card"}
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  <div>
                    <strong>Карткою</strong>
                    <span>Онлайн-оплата</span>
                  </div>
                </label>
              </div>
            </section>

            {/* КОМЕНТАР */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.step}>04</span>
                <div>
                  <h2>Коментар</h2>
                  <p>Необов&apos;язково.</p>
                </div>
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <textarea
                  placeholder="Наприклад: зателефонувати перед відправленням..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </section>
          </div>

          {/* ПІДСУМОК ЗАМОВЛЕННЯ */}
          <aside className={styles.summary}>
            <h2>Ваше замовлення</h2>

            <div className={styles.products}>
              {cart.map((item) => (
                <div key={item.id} className={styles.product}>
                  <div className={styles.productImage}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span>—</span>
                    )}
                  </div>

                  <div className={styles.productInfo}>
                    <strong>{item.name}</strong>
                    <span>
                      {item.quantity} × {item.price} грн
                    </span>
                  </div>

                  <strong className={styles.productTotal}>
                    {item.price * item.quantity} грн
                  </strong>
                </div>
              ))}
            </div>

            <div className={styles.divider} />

            <div className={styles.summaryRow}>
              <span>Товарів</span>
              <strong>{totalQuantity}</strong>
            </div>

            <div className={styles.summaryRow}>
              <span>Доставка</span>
              <strong>За тарифами</strong>
            </div>

            <div className={styles.divider} />

            <div className={styles.total}>
              <span>Разом</span>
              <strong>{totalPrice} грн</strong>
            </div>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className={styles.submit}
              disabled={submitting}
            >
              {submitting ? "Оформлення..." : "Підтвердити замовлення"}
            </button>

            <Link href="/cart" className={styles.back}>
              ← Повернутися до кошика
            </Link>
          </aside>
        </form>
      </div>
    </main>
  );
}