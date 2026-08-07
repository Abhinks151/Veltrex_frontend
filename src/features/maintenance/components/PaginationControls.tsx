import { Button } from '@/shared/components/ui/button';
import { PAGINATION_LIMIT } from '@/shared/constants/constant';

interface PaginationControlsProps {
  currentPage: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

const PaginationControls = ({
  currentPage,
  total,
  onPrev,
  onNext,
}: PaginationControlsProps) => {
  if (total <= PAGINATION_LIMIT) return null;

  const totalPages = Math.ceil(total / PAGINATION_LIMIT);

  return (
    <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-6">
      <span className="text-xs font-semibold text-gray-500">
        Page {currentPage + 1} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onPrev}
          disabled={currentPage === 0}
          className="rounded-lg text-xs"
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onNext}
          disabled={(currentPage + 1) * PAGINATION_LIMIT >= total}
          className="rounded-lg text-xs"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;
