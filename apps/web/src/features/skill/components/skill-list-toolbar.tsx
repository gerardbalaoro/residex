import { SkillType } from "@residex/db-schema/entities/skills";
import { Button } from "@residex/ui/components/button";
import { Drawer, DrawerPopup, DrawerTitle } from "@residex/ui/components/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@residex/ui/components/dropdown-menu";
import { Input } from "@residex/ui/components/input";
import { useIsMobile } from "@residex/ui/hooks/use-mobile";
import { ArrowUpDownIcon, CheckIcon, FilterIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

export type SkillSort = "updatedAt" | "name";

type Props = {
  search: string;
  sort: SkillSort;
  type: SkillType | "all";
  onSearchChange: (value: string) => void;
  onSortChange: (value: SkillSort) => void;
  onTypeChange: (value: SkillType | "all") => void;
};

const SORT_OPTIONS: { value: SkillSort; label: string }[] = [
  { value: "updatedAt", label: "Recent" },
  { value: "name", label: "Name" },
];

const TYPE_OPTIONS: { value: SkillType | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: SkillType.Surgical, label: "Surgical" },
  { value: SkillType.Communication, label: "Communication" },
];

export function SkillListToolbar({
  search,
  sort,
  type,
  onSearchChange,
  onSortChange,
  onTypeChange,
}: Props) {
  const [localValue, setLocalValue] = useState(search);
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);
  const [isTypeDrawerOpen, setIsTypeDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setLocalValue(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localValue);
    }, 250);

    return () => clearTimeout(timer);
  }, [localValue, onSearchChange]);

  const handleSortSelect = (value: SkillSort) => {
    onSortChange(value);
    setIsSortDrawerOpen(false);
  };

  const handleTypeSelect = (value: SkillType | "all") => {
    onTypeChange(value);
    setIsTypeDrawerOpen(false);
  };

  const sortButton = isMobile ? (
    <Button
      size="icon"
      variant="outline"
      aria-label="Sort"
      onClick={() => setIsSortDrawerOpen(true)}
    >
      <ArrowUpDownIcon />
    </Button>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button size="icon" variant="outline" aria-label="Sort" />}>
        <ArrowUpDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuItem key={option.value} onClick={() => onSortChange(option.value)}>
              {option.label}
              {sort === option.value ? <CheckIcon className="ml-auto size-4" /> : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const typeButton = isMobile ? (
    <Button
      size="icon"
      variant="outline"
      aria-label="Filter by type"
      onClick={() => setIsTypeDrawerOpen(true)}
    >
      <FilterIcon />
    </Button>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button size="icon" variant="outline" aria-label="Filter by type" />}
      >
        <FilterIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Type</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTypeChange("all")}>
            All types
            {type === "all" ? <CheckIcon className="ml-auto size-4" /> : null}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {TYPE_OPTIONS.filter((o) => o.value !== "all").map((option) => (
            <DropdownMenuItem key={option.value} onClick={() => onTypeChange(option.value)}>
              {option.label}
              {type === option.value ? <CheckIcon className="ml-auto size-4" /> : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search skills..."
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            className="pl-9"
          />
        </div>
        {typeButton}
        {sortButton}
      </div>

      <Drawer open={isSortDrawerOpen} onOpenChange={setIsSortDrawerOpen}>
        <DrawerPopup>
          <div className="pb-4">
            <DrawerTitle>Sort by</DrawerTitle>
          </div>
          <div className="flex flex-col">
            {SORT_OPTIONS.map((option) => {
              const isActive = sort === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSortSelect(option.value)}
                  className="flex items-center justify-between rounded-md p-3 text-left text-sm hover:bg-muted"
                >
                  <span className={isActive ? "font-medium" : undefined}>{option.label}</span>
                  {isActive ? <CheckIcon className="size-4 text-primary" /> : null}
                </button>
              );
            })}
          </div>
        </DrawerPopup>
      </Drawer>

      <Drawer open={isTypeDrawerOpen} onOpenChange={setIsTypeDrawerOpen}>
        <DrawerPopup>
          <div className="pb-4">
            <DrawerTitle>Filter by type</DrawerTitle>
          </div>
          <div className="flex flex-col">
            {TYPE_OPTIONS.map((option) => {
              const isActive = type === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTypeSelect(option.value)}
                  className="flex items-center justify-between rounded-md p-3 text-left text-sm hover:bg-muted"
                >
                  <span className={isActive ? "font-medium" : undefined}>{option.label}</span>
                  {isActive ? <CheckIcon className="size-4 text-primary" /> : null}
                </button>
              );
            })}
          </div>
        </DrawerPopup>
      </Drawer>
    </>
  );
}
