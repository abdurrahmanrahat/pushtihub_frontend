export function getPaginationPageItems(
  current: number,
  total: number,
  isMobile: boolean = false
): (number | string)[] {
  const pages: (number | string)[] = [];

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  if (isMobile) {
    pages.push(1);

    if (current <= 2) {
      pages.push(2);
      pages.push("...");
    } else if (current >= total - 1) {
      pages.push("...");
      pages.push(total - 1);
    } else {
      pages.push("...");
      pages.push(current);
      pages.push("...");
    }

    pages.push(total);
  } else {
    // Desktop version stays same
    pages.push(1);
    if (current > 3) pages.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
  }

  return pages;
}
