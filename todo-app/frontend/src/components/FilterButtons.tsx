/**
 * FilterButtons Component
 * Hiển thị các nút filter: All, Active, Completed
 * Và counter cho số tasks chưa hoàn thành
 */

import type { FilterType } from "../types/todo.type";

// Cấu hình cho từng filter button
const FILTERS: { value: FilterType; label: string; icon: string }[] = [
  { value: "all", label: "Tất cả", icon: "📋" },
  { value: "active", label: "Đang làm", icon: "🔥" },
  { value: "completed", label: "Hoàn thành", icon: "✅" },
];

// Props interface cho FilterButtons
interface FilterButtonsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  todoCount: number; // Tổng số todos theo filter hiện tại
  activeCount: number; // Số todos chưa hoàn thành
}

const FilterButtons = ({
  activeFilter,
  onFilterChange,
  todoCount,
  activeCount,
}: FilterButtonsProps) => {
  return (
    <div className="filter-bar">
      {/* Todo counter - số tasks chưa hoàn thành */}
      <div className="filter-bar__counter">
        <span className="filter-bar__count">{activeCount}</span>
        <span className="filter-bar__label">
          công việc chưa hoàn thành
        </span>
      </div>

      {/* Filter buttons */}
      <div className="filter-bar__buttons">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            id={`filter-${filter.value}`}
            className={`filter-bar__btn ${
              activeFilter === filter.value ? "filter-bar__btn--active" : ""
            }`}
            onClick={() => onFilterChange(filter.value)}
          >
            <span className="filter-bar__btn-icon">{filter.icon}</span>
            <span className="filter-bar__btn-text">{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Hiển thị số lượng todos theo filter */}
      <div className="filter-bar__info">
        Hiển thị <strong>{todoCount}</strong> công việc
      </div>
    </div>
  );
};

export default FilterButtons;
