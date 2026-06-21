import { Suspense } from "react";
import MenuPage from "./menu-content";

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-8">Loading menu...</div>}>
      <MenuPage />
    </Suspense>
  );
}
