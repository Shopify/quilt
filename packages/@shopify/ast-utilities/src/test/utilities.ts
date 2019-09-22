export function format(str: string) {
  return (
    str
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      // outdent
      .replace(/(^\s+|\s+$)/g, '')
      // replace line breaks
      .replace(/(\r\n|\n|\r)/gm, '')
      // replace spaces in curly braces
      .replace(/{ /g, '{')
      .replace(/ }/g, '}')
      // replace double with single quotes
      .replace(/"/g, `'`)
  );
}
