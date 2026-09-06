import Hero from "@/components/Hero/Hero";
import PopularProducts from "@/components/PopularProducts/PopularProducts";
import Categories from "@/components/Categories/Categories";
import Benefits from "@/components/Benefits/Benefits";

import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />

      <PopularProducts />

      <Categories />

      <Benefits />
    </main>
  );
}