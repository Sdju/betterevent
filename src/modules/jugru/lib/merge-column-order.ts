export function mergeColumnOrder(saved: string[], current: string[]): string[] {
  const currentSet = new Set(current);
  const ordered = saved.filter((name) => currentSet.has(name));

  for (const name of current) {
    if (!ordered.includes(name)) ordered.push(name);
  }

  return ordered;
}
