import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchAllLookups } from '@/shared/store/lookupSlice';

interface LookupSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  category: string;
  label?: string;
  error?: string;
  placeholder?: string;
}

const LookupSelect: React.FC<LookupSelectProps> = ({
  category,
  label,
  error,
  placeholder = 'Select option',
  className = '',
  ...props
}) => {
  const dispatch = useAppDispatch();
  const {
    data: lookups,
    fetchedAll,
    loading,
  } = useAppSelector((state) => state.lookups);

  useEffect(() => {
    if (!fetchedAll && !loading) {
      dispatch(fetchAllLookups());
    }
  }, [fetchedAll, loading, dispatch]);

  const options = lookups[category] || [];

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-semibold text-gray-700">{label}</label>
      )}
      <select
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5] ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.code}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default LookupSelect;
