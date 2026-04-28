import { Sex } from "@residex/db-schema/entities/patient";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import z from "zod";

import { AppPage } from "~/components/app-page";
import {
  ProcedureFormDialog,
  useProcedureFormDialog,
} from "~/features/procedure/components/procedure-form-dialog";
import { ProcedureList } from "~/features/procedure/components/procedure-list";
import { ProcedureListPaginator } from "~/features/procedure/components/procedure-list-paginator";
import { ProcedureListToolbar } from "~/features/procedure/components/procedure-list-toolbar";
import { useProcedures } from "~/features/procedure/hooks/use-procedures";
import { meta } from "~/lib/meta";

const SearchSchema = z.object({
  search: z.string().optional(),
  sort: z.enum(["updatedAt", "name"]).catch("updatedAt").default("updatedAt"),
  sex: z
    .enum(["all", ...Object.values(Sex)])
    .catch("all")
    .default("all"),
  page: z.number().int().positive().catch(1).default(1),
});

export const Route = createFileRoute("/_auth/procedures/")({
  validateSearch: SearchSchema,
  staticData: { title: "Procedures" },
  head: () => ({ meta: [...meta.page("Procedures")] }),
  component: ProceduresPage,
});

function ProceduresPage() {
  const { search = "", sort, sex, page } = Route.useSearch();
  const navigate = Route.useNavigate();
  const form = useProcedureFormDialog();
  const { data, count, isLoading, pagination } = useProcedures({
    search,
    page,
    sort,
    sex: sex === "all" ? undefined : (sex as Sex),
  });

  useEffect(() => {
    if (isLoading || count === 0) return;
    if (page > pagination.total) {
      void navigate({
        search: (prev) => ({ ...prev, page: pagination.total }),
        replace: true,
      });
    }
  }, [page, count, pagination.total, isLoading, navigate]);

  return (
    <AppPage>
      <AppPage.Header
        title="Procedures"
        description="Track clinical procedures you want to document across encounters."
        actions={
          <AppPage.Action icon={PlusIcon} label="Add Procedure" onClick={() => form.open()} />
        }
      />

      <div className="flex flex-1 flex-col gap-4">
        <ProcedureListToolbar
          search={search}
          sort={sort}
          sex={sex as Sex | "all"}
          onSearchChange={(value) =>
            navigate({ search: (prev) => ({ ...prev, search: value || undefined, page: 1 }) })
          }
          onSortChange={(value) =>
            navigate({ search: (prev) => ({ ...prev, sort: value, page: 1 }) })
          }
          onSexChange={(value) =>
            navigate({ search: (prev) => ({ ...prev, sex: value, page: 1 }) })
          }
        />
        <ProcedureList
          rows={data}
          search={search}
          isLoading={isLoading}
          onCreate={() => form.open()}
          onEdit={(procedure) => form.open(procedure)}
        />
        <ProcedureListPaginator
          page={page}
          count={count}
          isLoading={isLoading}
          {...pagination}
          onPageChange={(next) => navigate({ search: (prev) => ({ ...prev, page: next }) })}
        />
      </div>

      <ProcedureFormDialog {...form} />
    </AppPage>
  );
}
