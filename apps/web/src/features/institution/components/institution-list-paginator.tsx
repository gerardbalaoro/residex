import { Button } from "@residex/ui/components/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import type { Pagination } from "~/lib/pagination";

type Props = Pagination & {
  page: number;
  count: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
};

export function InstitutionListPaginator({ page, count, total, isLoading, onPageChange }: Props) {
  if (isLoading || count === 0) return null;

  const isFirst = page <= 1;
  const isLast = page >= total;

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-muted-foreground">
        Page {page} of {total} · {count} total
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={isFirst}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon />
          <span className="sr-only">Previous</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={isLast}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  );
}
