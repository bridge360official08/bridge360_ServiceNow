import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderTop: '1px solid var(--color-neutral-200)',
        backgroundColor: 'var(--color-white)',
        fontSize: '13px',
        color: 'var(--color-neutral-600)',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      <div>
        Showing <span style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>{startItem}</span> to{' '}
        <span style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>{endItem}</span> of{' '}
        <span style={{ fontWeight: 600, color: 'var(--color-navy-900)' }}>{totalItems}</span> results
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          leftIcon={<ChevronLeft size={16} />}
        >
          Previous
        </Button>

        <span style={{ padding: '0 8px', fontWeight: 500 }}>
          Page {currentPage} of {Math.max(1, totalPages)}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          rightIcon={<ChevronRight size={16} />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
