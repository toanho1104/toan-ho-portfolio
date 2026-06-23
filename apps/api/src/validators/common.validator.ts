import { t, type Static } from "elysia";

export const paginationValidator = t.Object({
  page: t.Optional(t.Numeric({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50, default: 10 })),
});

export type PaginationQuery = Static<typeof paginationValidator>;

export const getPaginationOffset = (page = 1, limit = 10) => ({
  offset: (page - 1) * limit,
  limit,
  page,
});

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number,
) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    totalPages,
    currentPage: page,
    nextPage: page < totalPages ? page + 1 : null,
    previousPage: page > 1 ? page - 1 : null,
    limit,
  };
};
