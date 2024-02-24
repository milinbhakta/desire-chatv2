export function convertNameToId(name: string) {
  return name.toLowerCase().replace(/ /g, '_');
}
