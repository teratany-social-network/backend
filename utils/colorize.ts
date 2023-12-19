export enum TextColor {
    black = '30',
    red = '31',
    green = '32',
    yellow = '33',
    blue = '34',
    magenta = '35',
    cyan = '36',
    white = '37',
  }

export const colorize = (text: string, colorCode: TextColor) => {
    return `\x1b[${colorCode}m${text}\x1b[0m`;
}
