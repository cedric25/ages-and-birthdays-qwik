import { component$, Slot } from "@builder.io/qwik";
import Header from "../components/header/header";

export default component$(() => {
  return (
    <>
      <main>
        <Header />
        <section class="pt-top-menu">
          <Slot />
        </section>
      </main>
    </>
  );
});
