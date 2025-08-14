export type CasingStyle = 'lowercase' | 'kebab' | 'camel' | 'pascal';

/**
 * Clean a filename by removing special characters and applying casing style
 * @param name - The original filename
 * @param style - The casing style to apply
 * @returns The cleaned filename
 */
export function cleanFileName(name: string, style: CasingStyle = 'lowercase'): string {
  const extension = name.substring(name.lastIndexOf('.') + 1);
  const base = name.substring(0, name.lastIndexOf('.'));

  // Strip special characters and split into words
  const words = base
    .replace(/[^\w\s]/g, '')   // Remove special chars
    .trim()
    .split(/\s+/);             // Split on spaces

  let newName = '';

  switch (style) {
    case 'lowercase':
      newName = words.map(word => word.toLowerCase()).join('');
      break;

    case 'camel':
      newName = words
        .map((word, i) =>
          i === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('');
      break;

    case 'pascal':
      newName = words
        .map(word =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('');
      break;

    case 'kebab':
    default:
      newName = words.map(word => word.toLowerCase()).join('-');
      break;
  }

  return `${newName}.${extension.toLowerCase()}`;
}
