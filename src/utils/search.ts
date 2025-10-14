export interface SearchResult {
  value: string;
  score: number;
  ranges: [number, number][];
}

export function search(query: string, items: string[]): SearchResult[] {
  if (!query) return items.map((value) => ({ value, score: 0, ranges: [] }));

  const normalizedQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const item of items) {
    const normalizedItem = item.toLowerCase();
    const index = normalizedItem.indexOf(normalizedQuery);

    if (index === -1) continue;

    const score = 1000 - index;
    const ranges: [number, number][] = [[index, index + query.length]];

    results.push({ value: item, score, ranges });
  }

  return results.sort((a, b) => b.score - a.score);
}

export function highlight(text: string, ranges: [number, number][]): string {
  if (ranges.length === 0) return text;

  let result = "";
  let lastIndex = 0;

  for (const [start, end] of ranges) {
    result += text.slice(lastIndex, start);
    result += `<mark>${text.slice(start, end)}</mark>`;
    lastIndex = end;
  }

  result += text.slice(lastIndex);
  return result;
}
