"use client";

import { cn } from "@/lib/utils";
import styles from "./SearchFilterBar.module.css";

export interface FilterOption {
  value: string;
  label: string;
}

export function SearchFilterBar({
  searchValue,
  onSearchChange,
  placeholder,
  filters,
  activeFilter,
  onFilterChange,
  resultLabel,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
  resultLabel: string;
}) {
  return (
    <div className={styles.controls}>
      <div className={styles.searchWrap}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={styles.searchIcon}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>
      <div className={styles.filters}>
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            className={cn(styles.chip, activeFilter === f.value && styles.active)}
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className={styles.resultCount}>{resultLabel}</div>
    </div>
  );
}
