import { SkillType } from "@residex/db-schema/entities/skills";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import z from "zod";

import { AppPage } from "~/components/app-page";
import { SkillFormDialog, useSkillFormDialog } from "~/features/skill/components/skill-form-dialog";
import { SkillList } from "~/features/skill/components/skill-list";
import { SkillListPaginator } from "~/features/skill/components/skill-list-paginator";
import { SkillListToolbar } from "~/features/skill/components/skill-list-toolbar";
import { useSkills } from "~/features/skill/hooks/use-skills";
import { meta } from "~/lib/meta";

const SearchSchema = z.object({
  search: z.string().optional(),
  sort: z.enum(["updatedAt", "name"]).catch("updatedAt").default("updatedAt"),
  type: z
    .enum(["all", ...Object.values(SkillType)])
    .catch("all")
    .default("all"),
  page: z.number().int().positive().catch(1).default(1),
});

export const Route = createFileRoute("/_auth/skills/")({
  validateSearch: SearchSchema,
  staticData: { title: "Skills" },
  head: () => ({ meta: [...meta.page("Skills")] }),
  component: SkillsPage,
});

function SkillsPage() {
  const { search = "", sort, type, page } = Route.useSearch();
  const navigate = Route.useNavigate();
  const form = useSkillFormDialog();
  const { data, count, isLoading, pagination } = useSkills({
    search,
    page,
    sort,
    type: type === "all" ? undefined : (type as SkillType),
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
        title="Skills"
        description="Track surgical and communication skills you want to develop."
        actions={<AppPage.Action icon={PlusIcon} label="Add Skill" onClick={() => form.open()} />}
      />

      <div className="flex flex-1 flex-col gap-4">
        <SkillListToolbar
          search={search}
          sort={sort}
          type={type as SkillType | "all"}
          onSearchChange={(value) =>
            navigate({ search: (prev) => ({ ...prev, search: value || undefined, page: 1 }) })
          }
          onSortChange={(value) =>
            navigate({ search: (prev) => ({ ...prev, sort: value, page: 1 }) })
          }
          onTypeChange={(value) =>
            navigate({ search: (prev) => ({ ...prev, type: value, page: 1 }) })
          }
        />
        <SkillList
          rows={data}
          search={search}
          isLoading={isLoading}
          onCreate={() => form.open()}
          onEdit={(skill) => form.open(skill)}
        />
        <SkillListPaginator
          page={page}
          count={count}
          isLoading={isLoading}
          {...pagination}
          onPageChange={(next) => navigate({ search: (prev) => ({ ...prev, page: next }) })}
        />
      </div>

      <SkillFormDialog {...form} />
    </AppPage>
  );
}
