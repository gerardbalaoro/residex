import { z } from "zod";

export const PaginationSchema = z.object({
  total: z.int().positive().meta({ description: "Total number of pages" }),
  size: z.int().positive().min(1).meta({ description: "Number of items per page" }),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export const createPagination = (totalItems: number, pageSize: number): Pagination => ({
  size: pageSize,
  total: Math.max(1, Math.ceil(totalItems / pageSize)),
});
