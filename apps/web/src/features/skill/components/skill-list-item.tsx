import { SkillType } from "@residex/db-schema/entities/skills";
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

import type { SkillItem as SkillRow } from "../hooks/use-skills";
import { SKILL_TYPE_LABELS } from "./skill-form";

type Props = {
  skill: SkillRow;
  isSelected?: boolean;
  onToggle?: () => void;
  onEdit: (skill: SkillRow) => void;
};

export function SkillListItem({ skill, isSelected = false, onToggle, onEdit }: Props) {
  const isMobile = useIsMobile();
  const typeLabel = SKILL_TYPE_LABELS[skill.type as SkillType] ?? skill.type;

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
          aria-label={`Select ${skill.name}`}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="flex w-full items-center gap-2">
          <span className="truncate">{skill.name}</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {typeLabel}
          </span>
          {skill.isPreset ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Preset
            </span>
          ) : null}
        </ItemTitle>
        {skill.description?.trim() ? (
          <ItemDescription>{skill.description.trim()}</ItemDescription>
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
                      onEdit(skill);
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
                onEdit(skill);
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

SkillListItem.Skeleton = function SkillListItemSkeleton() {
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
