export function paginationState(value: number, total?: number, totalPage?: number, pageSize = 10) {
  const size = Number.isFinite(pageSize) && pageSize > 0 ? Math.max(1, Math.floor(pageSize)) : 10;
  const count = total !== undefined ? Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0 : undefined;
  const pages = count !== undefined ? Math.max(1, Math.ceil(count / size)) : Number.isFinite(totalPage) ? Math.max(1, Math.floor(totalPage!)) : 1;
  const page = Number.isFinite(value) ? Math.min(pages, Math.max(1, Math.floor(value))) : 1;
  return { page, pages, pageSize: size, total: count };
}
