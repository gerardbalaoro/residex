import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@residex/ui/components/breadcrumb";
import { Link, useMatches } from "@tanstack/react-router";
import { Fragment } from "react";

export function AppBreadcrumbs() {
  const matches = useMatches();

  const crumbs = matches
    .filter((match) => match.staticData && "title" in match.staticData)
    .map((match) => ({
      title: (match.staticData as { title: string }).title,
      path: match.pathname,
    }));

  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <Fragment key={crumb.path}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link to={crumb.path} />}>{crumb.title}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
