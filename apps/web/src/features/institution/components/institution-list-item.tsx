import { Button } from "@residex/ui/components/button";
import { Checkbox } from "@residex/ui/components/checkbox";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@residex/ui/components/item";
import { Skeleton } from "@residex/ui/components/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@residex/ui/components/tooltip";
import { useIsMobile } from "@residex/ui/hooks/use-mobile";
import { cn } from "@residex/ui/lib/utils";
import { PencilIcon } from "lucide-react";

import type { InstitutionItem as InstitutionRow } from "../hooks/use-institutions";

type Props = {
  institution: InstitutionRow;
  isSelected?: boolean;
  onToggle?: () => void;
  onEdit: (institution: InstitutionRow) => void;
};

export function InstitutionListItem({ institution, isSelected = false, onToggle, onEdit }: Props) {
  const isMobile = useIsMobile();

  return (
    <Item
      variant="outline"
      size="sm"
      className={cn(
        "cursor-pointer text-left transition-colors hover:bg-muted/50",
        isSelected &&
          "border-primary/40 bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15",
      )}
      onClick={() => onToggle?.()}
    >
      <ItemMedia variant="icon" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle?.()}
          aria-label={`Select ${institution.name}`}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="block w-full truncate">{institution.name}</ItemTitle>
        {institution.location?.trim() ? (
          <ItemDescription>{institution.location.trim()}</ItemDescription>
        ) : null}
      </ItemContent>
      <ItemActions>
        <TooltipProvider>
          {isMobile ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(institution);
                    }}
                    aria-label="Edit"
                  />
                }
              >
                <PencilIcon className="size-4" aria-hidden />
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(institution);
              }}
            >
              Edit
            </Button>
          )}
        </TooltipProvider>
      </ItemActions>
    </Item>
  );
}

InstitutionListItem.Skeleton = function InstitutionListItemSkeleton() {
  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <Skeleton className="size-4 rounded-md" />
      </ItemMedia>
      <ItemContent>
        <Skeleton className="h-4 w-40 rounded-md" />
        <Skeleton className="mt-2 h-3 w-64 rounded-md" />
      </ItemContent>
    </Item>
  );
};
