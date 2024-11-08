import React from 'react';

interface PeriodFilterProps {
  filterPeriod: string;
  setFilterPeriod: (period: string) => void;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  customEndDate: string;
  setCustomEndDate: (date: string) => void;
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({
  filterPeriod,
  setFilterPeriod,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
}) => {
  return (
    <div className="space-y-3">
      <select
        value={filterPeriod}
        onChange={(e) => setFilterPeriod(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      >
        <option value="thisWeek">This Week</option>
        <option value="thisMonth">This Month</option>
        <option value="thisYear">This Year</option>
        <option value="custom">Custom Period</option>
      </select>
      
      {filterPeriod === 'custom' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">End Date</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodFilter;