import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import z from "zod";

import { AppPage } from "~/components/app-page";
import {
  InstitutionFormDialog,
  useInstitutionFormDialog,
} from "~/features/institution/components/institution-form-dialog";
import { InstitutionList } from "~/features/institution/components/institution-list";
import { InstitutionListPaginator } from "~/features/institution/components/institution-list-paginator";
import { InstitutionListToolbar } from "~/features/institution/components/institution-list-toolbar";
import { useInstitutions } from "~/features/institution/hooks/use-institutions";
import { meta } from "~/lib/meta";

const SearchSchema = z.object({
  search: z.string().optional(),
  sort: z.enum(["updatedAt", "name"]).catch("updatedAt").default("updatedAt"),
  page: z.number().int().positive().catch(1).default(1),
});

export const Route = createFileRoute("/_auth/institutions/")({
  validateSearch: SearchSchema,
  staticData: { title: "Institutions" },
  head: () => ({ meta: [...meta.page("Institutions")] }),
  component: InstitutionsPage,
});

function InstitutionsPage() {
  const { search = "", sort, page } = Route.useSearch();
  const navigate = Route.useNavigate();
  const form = useInstitutionFormDialog();
  const { data, count, isLoading, pagination } = useInstitutions({ search, page, sort });

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
        title="Institutions"
        description="Hospitals, clinics, and facilities where you record encounters."
        actions={
          <AppPage.Action icon={PlusIcon} label="Add Insitution" onClick={() => form.open()} />
        }
      />

      <div className="flex flex-1 flex-col gap-4">
        <InstitutionListToolbar
          search={search}
          sort={sort}
          onSearchChange={(value) =>
            navigate({ search: (prev) => ({ ...prev, search: value || undefined, page: 1 }) })
          }
          onSortChange={(value) =>
            navigate({ search: (prev) => ({ ...prev, sort: value, page: 1 }) })
          }
        />
        <InstitutionList
          rows={data}
          search={search}
          isLoading={isLoading}
          onCreate={() => form.open()}
          onEdit={(institution) => form.open(institution)}
        />
        <InstitutionListPaginator
          page={page}
          count={count}
          isLoading={isLoading}
          {...pagination}
          onPageChange={(next) => navigate({ search: (prev) => ({ ...prev, page: next }) })}
        />
      </div>

      <InstitutionFormDialog {...form} />
    </AppPage>
  );
}
