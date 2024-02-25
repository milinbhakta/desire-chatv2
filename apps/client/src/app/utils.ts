export function convertNameToId(name: string) {
  return name.toLowerCase().replace(/ /g, '_');
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name: string) {
  let initials = '';
  const nameParts = name.split(' ');

  if (nameParts.length > 1) {
    // If name has multiple parts, use the first letter of the first two parts
    initials = `${nameParts[0][0]}${nameParts[1][0]}`;
  } else if (nameParts[0]) {
    // If name is a single word, use the first letter of the word
    initials = nameParts[0][0];
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials,
  };
}
