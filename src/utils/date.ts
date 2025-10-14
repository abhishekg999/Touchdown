export function getDate(): string {
  return new Date().toLocaleDateString();
}

export function daysPassed(): number {
  const date1 = new Date("9/17/2022");
  const today = new Date(getDate());
  return parseInt(((today.getTime() - date1.getTime()) / (1000 * 3600 * 24)).toString());
}
