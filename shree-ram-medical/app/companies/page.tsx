"use client";

import { useMemo, useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { PageHead } from "@/components/catalogue/PageHead";
import { SearchFilterBar, type FilterOption } from "@/components/catalogue/SearchFilterBar";
import { CompanyCard } from "@/components/catalogue/CompanyCard";
import { companies } from "@/lib/data/companies";
import styles from "./companies.module.css";

const filters: FilterOption[] = [
  { value: "all", label: "All" },
  { value: "popular", label: "Popular" },
  { value: "domestic", label: "Domestic" },
  { value: "international", label: "International" },
  { value: "injectables", label: "Injectables" },
  { value: "tablets", label: "Tablets" },
  { value: "otc", label: "OTC" },
  { value: "prescription", label: "Prescription" },
];

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = companies.filter(
      (c) => c.name.toLowerCase().includes(q) || c.segment.toLowerCase().includes(q)
    );
    if (activeFilter !== "all") {
      list = list.filter((c) => c.tags.includes(activeFilter));
    }
    return list;
  }, [search, activeFilter]);

  return (
    <>
      <div className="page-ambient" />
      <Navbar active="/companies" />
      <PageHead
        kicker="50+ manufacturing partners"
        title="Companies we distribute for"
        description="Every brand on this list is stocked, verified and ready to ship from our warehouse network. Search by name or filter by segment to find what you need."
      />
      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search companies…"
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        resultLabel={`${filtered.length} compan${filtered.length === 1 ? "y" : "ies"} found`}
      />
      <div className={styles.grid}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <h3>No companies match &ldquo;{search}&rdquo;</h3>
            <p>Try a different name or clear your filters.</p>
          </div>
        ) : (
          filtered.map((c, i) => <CompanyCard company={c} index={i} key={c.id} />)
        )}
      </div>
      <Footer />
    </>
  );
}
