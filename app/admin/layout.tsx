import Link from "next/link";
import styles from "./admin.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.admin}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>
          MotoShop Admin
        </h2>

        <nav className={styles.nav}>
          <Link href="/admin">
            Dashboard
          </Link>

          <Link href="/admin/products">
            Товари
          </Link>

          <Link href="/admin/orders">
            Замовлення
          </Link>

          <Link href="/admin/contacts">
            <span>Повідомлення</span>
          </Link>
        </nav>

        <div className={styles.sidebarBottom}>
          <Link href="/">
            ← Повернутися в магазин
          </Link>
        </div>
      </aside>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}