"use client";

import { useMemo, useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { PageHead } from "@/components/catalogue/PageHead";
import { SearchFilterBar, type FilterOption } from "@/components/catalogue/SearchFilterBar";
import { MedicineCard } from "@/components/catalogue/MedicineCard";
import { medicines } from "@/lib/data/medicines";
import { categories } from "@/lib/data/categories";
import styles from "./medicines.module.css";

export default function MedicinesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filters: FilterOption[] = [
    { value: "all", label: "All" },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = medicines.filter(
      (m) => m.name.toLowerCase().includes(q) || m.composition.toLowerCase().includes(q)
    );
    if (activeFilter !== "all") {
      list = list.filter((m) => m.categorySlug === activeFilter);
    }
    return list;
  }, [search, activeFilter]);

  return (
    <>
      <div className="page-ambient" />
      <Navbar active="/medicines" />
      <PageHead
        kicker="20,000+ medicines in stock"
        title="Medicines catalogue"
        description="Search our full catalogue by name or composition, filter by therapy area, and send a quote request straight to our order desk."
      />
      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search by name or composition…"
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        resultLabel={`${filtered.length} medicine${filtered.length === 1 ? "" : "s"} found`}
      />
      <div className={styles.grid}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <h3>No medicines match &ldquo;{search}&rdquo;</h3>
            <p>Try a different name or clear your filters.</p>
          </div>
        ) : (
          filtered.map((m, i) => <MedicineCard medicine={m} index={i} key={m.id} />)
        )}
      </div>
      <Footer />
    </>
  );
}
