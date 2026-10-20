export function parseStageRange(range: string): { start: number; end: number } {
  const match = range.match(/^(\d{1,2})(?:[–-](\d{1,2}))?$/);
  if (!match) throw new Error(`无效的系列阶段范围：${range}`);
  const start = Number(match[1]);
  const end = Number(match[2] ?? match[1]);
  if (start < 1 || end < start) throw new Error(`无效的系列阶段范围：${range}`);
  return { start, end };
}
