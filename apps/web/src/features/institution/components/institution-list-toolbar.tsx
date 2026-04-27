import { Button } from "@residex/ui/components/button";
import { Drawer, DrawerPopup, DrawerTitle } from "@residex/ui/components/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@residex/ui/components/dropdown-menu";
import { Input } from "@residex/ui/components/input";
import { useIsMobile } from "@residex/ui/hooks/use-mobile";
import { ArrowUpDownIcon, CheckIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

export type InstitutionSort = "updatedAt" | "name";

type Props = {
  search: string;
  sort: InstitutionSort;
  onSearchChange: (value: string) => void;
  onSortChange: (value: InstitutionSort) => void;
};

const SORT_OPTIONS: { value: InstitutionSort; label: string }[] = [
  { value: "updatedAt", label: "Recent" },
  { value: "name", label: "Name" },
];

export function InstitutionListToolbar({ search, sort, onSearchChange, onSortChange }: Props) {
  const [localValue, setLocalValue] = useState(search);
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);
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

  const handleSortSelect = (value: InstitutionSort) => {
    onSortChange(value);
    setIsSortDrawerOpen(false);
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

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search institutions..."
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            className="pl-9"
          />
        </div>
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
    </>
  );
}
