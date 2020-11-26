# cracket

Small CLI app to track cryptocurrency trends.

Powered by [CoinGecko](https://www.coingecko.com/).

## Install

```bash
$ npm install --global cracket
```

## Usage

By running the cli app without arguments you'll open it with the default behaviour. You can move around using the arrow keys to select a currency or to switch pages. You can also use `Tab` or `Tab+Shift` to select a currency.

By pressing `Return/Enter` when a currency is selected you'll open its detail view which contains some more detailed info and a graph that shows the trends.

You can always type the `?` key in any screen in order to get help on how to navigate.

```
$ cracket --help

  Usage
    $ cracket

  Options
      --per-page  Fixed results per page
      --columns  Fixed columns to show (name,price,1h,24h,7d,volume,marketCap)

  Usage
    Use the arrow keys to switch page.
    Press 'q' or 'Ctrl+C' to exit.

  Examples
    $ cracket --per-page=1 --columns=name,price,1h,24h,7d

    Name      Price     1h        24h       7d
    Bitcoin   $18929.9  -0.34865  -1.03432  7.24047
```

## Libraries

This app uses the following libraries:

- [Ink](https://github.com/vadimdemedes/ink) - Build CLI apps using React and Node.js
- [React](https://reactjs.org] - A JavScript library for building user interfaces
- [xstate](https://xstate.js.org) - State machines in JavaScript
- [got](https://github.com/sindresorhus/got) - HTTP request library
- [swr](https://swr.vercel.app/) - React hooks library for data fetching
- [asciichart](https://github.com/kroitor/asciichart) - Create ASCII line charts in pure JavaScript
- [term-size](https://github.com/sindresorhus/term-size) - Get terminal size
