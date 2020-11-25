# cracket

Small CLI app to track cryptocurrency trends.

Powered by [CoinGecko](https://www.coingecko.com/).

## Install

```bash
$ npm install --global cracket
```

## CLI

```
$ cracket --help

  Usage
    $ cracket

  Options
      --per-page  Results per page
          --columns  Columns to show (name,price,1h,24h,7d,volume,marketCap)

  Usage
    Use the arrow keys to switch page.
    Press 'q' or 'Ctrl+C' to exit.

  Examples
    $ cracket --per-page=1 --columns=name,price,1h,24h,7d

    Name      Price     1h        24h       7d
    Bitcoin   $18929.9  -0.34865  -1.03432  7.24047
```
