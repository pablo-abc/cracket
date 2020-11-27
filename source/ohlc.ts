// modified from https://github.com/kroitor/asciichart
export const black = "\x1b[30m"
export const red = "\x1b[31m"
export const green = "\x1b[32m"
export const yellow = "\x1b[33m"
export const blue = "\x1b[34m"
export const magenta = "\x1b[35m"
export const cyan = "\x1b[36m"
export const lightgray = "\x1b[37m"
export const defaultColor = "\x1b[39m"
export const darkgray = "\x1b[90m"
export const lightred = "\x1b[91m"
export const lightgreen = "\x1b[92m"
export const lightyellow = "\x1b[93m"
export const lightblue = "\x1b[94m"
export const lightmagenta = "\x1b[95m"
export const lightcyan = "\x1b[96m"
export const white = "\x1b[97m"
export const reset = "\x1b[0m"

export function colored (char: string, color: string) {
  // do not color it if color is not specified
  return (color === undefined) ? char : (color + char + reset)
}

export const plot = function (series: number[][], cfg: any = undefined) {
  cfg = (typeof cfg !== 'undefined') ? cfg : {}

  let min = (typeof cfg.min !== 'undefined') ? cfg.min : series[0]?.[2]
  let max = (typeof cfg.max !== 'undefined') ? cfg.max : series[0]?.[1]

  for (let j = 0; j < series.length; j++) {
    min = Math.min(min, series[j]?.[2] ?? min)
    max = Math.max(max, series[j]?.[1] ?? max)
  }

  let defaultSymbols = [ '┼', '┤', '╶', '╴', '─', '└', '┌', '┐', '┘', '│', '├', '┴', '┬' ]
  let range   = Math.abs (max - min)
  let offset  = (typeof cfg.offset  !== 'undefined') ? cfg.offset  : 3
  let padding = (typeof cfg.padding !== 'undefined') ? cfg.padding : '           '
  let height  = (typeof cfg.height  !== 'undefined') ? cfg.height  : range
  let ratio   = range !== 0 ? height / range : 1;
  let min2    = Math.round (min * ratio)
  let max2    = Math.round (max * ratio)
  let rows    = Math.abs (max2 - min2)
  const width = series.length + offset
  let symbols = (typeof cfg.symbols !== 'undefined') ? cfg.symbols : defaultSymbols
  let format  = (typeof cfg.format !== 'undefined') ? cfg.format : function (x: number) {
    return (padding + x.toFixed (2)).slice (-padding.length)
  }

  let result = new Array (rows + 1) // empty space
  for (let i = 0; i <= rows; i++) {
    result[i] = new Array (width)
    for (let j = 0; j < width; j++) {
      result[i][j] = ' '
    }
  }
  for (let y = min2; y <= max2; ++y) { // axis + labels
    let label = format (rows > 0 ? max - (y - min2) * range / rows : y, y - min2)
    result[y - min2][Math.max (offset - label.length, 0)] = label
    result[y - min2][offset - 1] = (y == 0) ? symbols[0] : symbols[1]
  }

  let y0 = Math.round ((series[0]?.[0] ?? 0) * ratio) - min2
  result[rows - y0][offset - 1] = colored(symbols[0], defaultColor) // first value

  for (let x = 0; x < series.length - 1; x++) { // plot the line
    const start = Math.round ((series[x]?.[0] ?? 0) * ratio) - min2
    const high = Math.round ((series[x]?.[1] ?? 0) * ratio) - min2
    const low = Math.round ((series[x]?.[2] ?? 0) * ratio) - min2
    const end = Math.round ((series[x]?.[3] ?? 0) * ratio) - min2
    const currentColor = start > end ? red : green
    for (let y = low; y <= high; y++) {
      let symbol = 9
      if (y === start && y === end && y === high) symbol = 12
      else if (y === start && y === end && y === end) symbol = 11
      else if (y === start && y === end) symbol = 0
      else if (y === start && y === high) symbol = 7
      else if (y === start && y === low) symbol = 8
      else if (y === end && y === high) symbol = 6
      else if (y === end && y === low) symbol = 5
      else if (y === start) symbol = 1
      else if (y === end) symbol = 10
      result[rows - y][x + offset] = colored(symbols[symbol], currentColor)
    }
  }
  return result.map (function (x) { return x.join ('') }).join ('\n')
}
