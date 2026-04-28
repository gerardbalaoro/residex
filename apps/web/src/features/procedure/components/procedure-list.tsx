import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@residex/ui/components/alert-dialog";
import { Button } from "@residex/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@residex/ui/components/empty";
import { ItemGroup } from "@residex/ui/components/item";
import { useSidebar } from "@residex/ui/components/sidebar";
import { LoaderCircleIcon, PlusIcon, SyringeIcon, Trash2Icon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

import { useProcedureDelete } from "../hooks/use-procedure-delete";
import type { ProcedureItem as ProcedureRow } from "../hooks/use-procedures";
import { ProcedureListItem } from "./procedure-list-item";

const SKELETON_ROW_COUNT = 4;

type Props = {
  rows: ProcedureRow[];
  search: string;
  isLoading?: boolean;
  onCreate: () => void;
  onEdit: (procedure: ProcedureRow) => void;
};

export function ProcedureList({ rows, search, isLoading = false, onCreate, onEdit }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const { deleteProcedure } = useProcedureDelete();
  const { isMobile, state: sidebarState } = useSidebar();

  const dockLeft = isMobile
    ? "50%"
    : sidebarState === "expanded"
      ? "calc(var(--sidebar-width) / 2 + 50vw)"
      : "calc(var(--sidebar-width-icon) / 2 + 50vw)";

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(rows.map((r) => r.id)));
  }, [rows]);

  const handleBulkDelete = useCallback(async () => {
    setIsBulkDeleting(true);
    try {
      await deleteProcedure({ id: [...selectedIds] });
      setSelectedIds(new Set());
    } finally {
      setIsBulkDeleting(false);
      setConfirmBulkDelete(false);
    }
  }, [deleteProcedure, selectedIds]);

  if (isLoading) {
    return (
      <ItemGroup>
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
          <ProcedureListItem.Skeleton key={index} />
        ))}
      </ItemGroup>
    );
  }

  if (rows.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SyringeIcon />
          </EmptyMedia>
          <EmptyTitle>
            {search.trim() ? "No procedures found" : "You haven't added any procedures"}
          </EmptyTitle>
          <EmptyDescription>
            {search.trim()
              ? "Try a different search term, or add a new procedure."
              : "Track the procedures you want to document across your encounters."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={onCreate}>
            <PlusIcon data-icon="inline-start" />
            Add Procedure
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <>
      <ItemGroup>
        {rows.map((procedure) => (
          <ProcedureListItem
            key={procedure.id}
            procedure={procedure}
            isSelected={selectedIds.has(procedure.id)}
            onToggle={() => toggle(procedure.id)}
            onEdit={onEdit}
          />
        ))}
      </ItemGroup>

      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom)+1rem)] z-50 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-border bg-background/90 px-2 py-1.5 shadow-lg backdrop-blur-sm md:bottom-6"
            style={{ left: dockLeft, transition: "left 200ms linear" }}
          >
            <span className="px-2 text-sm font-medium whitespace-nowrap text-muted-foreground tabular-nums select-none">
              {selectedIds.size} selected
            </span>
            <div className="mx-1 h-5 w-px bg-border" />
            <Button variant="ghost" size="sm" onClick={selectAll}>
              Select all
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setConfirmBulkDelete(true)}>
              <Trash2Icon data-icon="inline-start" />
              Delete
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={clearSelection} aria-label="Close">
              <XIcon />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog
        open={confirmBulkDelete}
        onOpenChange={(open) => {
          if (!open && !isBulkDeleting) setConfirmBulkDelete(false);
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedIds.size} procedure{selectedIds.size !== 1 ? "s" : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This removes the selected procedures from your active list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isBulkDeleting}
              onClick={() => void handleBulkDelete()}
            >
              {isBulkDeleting ? (
                <LoaderCircleIcon className="animate-spin" data-icon="inline-start" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
