export function getPagination(queryPage?: number, queryPageSize?: number) {
  const page = Number.isFinite(queryPage) && queryPage && queryPage > 0 ? Math.floor(queryPage) : 1;
  const pageSize = Number.isFinite(queryPageSize) && queryPageSize && queryPageSize > 0 ? Math.min(Math.floor(queryPageSize), 100) : 10;
  const skip = (page - 1) * pageSize;

  return { page, pageSize, skip };
}
