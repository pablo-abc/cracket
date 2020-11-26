import React, { FC, useMemo } from 'react'
import { Box, Text } from 'ink'
import useSWR from 'swr'
import got from 'got'
import { Coin } from './coin-market'
import Spinner from 'ink-spinner'
import * as asciichart from 'asciichart'
import termSize from 'term-size'

const COIN_API = 'https://api.coingecko.com/api/v3/coins/markets'

type DetailProps = {
  id: string
}

type CoinResponse = {
  body: Coin[]
}

type CoinChartResponse = {
  body: {
    prices: [number, number][],
    market_caps: [number, number][],
    total_volumes: [number, number][],
  }
}

const Detail: FC<DetailProps> = ({ id }) => {
  const { columns, rows } = termSize()
  const coinSearchParams = useMemo(() => ({
    searchParams: {
      ids: id,
      vs_currency: 'usd',
      price_change_percentage: '1h,24h,7d',
    },
    responseType: 'json',
  }), [id])
  const {
    data: coinData,
    error: coinError
  } = useSWR<CoinResponse>([COIN_API, coinSearchParams], got, {
    refreshInterval: 60000,
  })

  const chartApi = `https://api.coingecko.com/api/v3/coins/${id}/market_chart`
  const chartSearchParams = useMemo(() => ({
    searchParams: {
      vs_currency: 'usd',
      days: 1,
    },
    responseType: 'json',
  }), [])
  const { data: chartData,
          error: chartError
  } = useSWR<CoinChartResponse>([chartApi, chartSearchParams], got, {
    refreshInterval: 60000,
  })
  const coin = coinData?.body[0]
  const chart = chartData?.body
  const prices = chart?.prices.slice(columns * -1 + 20)
  const startDate = prices?.[0]?.[0]
  const endDate = prices?.[prices?.length - 1]?.[0]

  if (!!coinError) return (<Text color="red">There was an error</Text>)
  if (!coin) return (
    <Text color="cyan">
      <Spinner type="dots" />
      <Text color="white"> Loading coin...</Text>
    </Text>
  )
  return (
    <Box flexDirection="column">
      <Text bold>{coin.name}</Text>
      {!!chartError && <Text color="red">There was an error loading the chart</Text>}
      {!chart && !chartError && (
        <Text color="cyan">
          <Spinner type="dots" />
          <Text color="white"> Loading chart...</Text>
        </Text>
      )}
      {!!prices && (
        <Text>
          {asciichart.plot(
            prices.map(price => price[1]),
            { height: Math.ceil(rows / 3) },
          )}
        </Text>
      )}
      {!!startDate && !!endDate && !!prices && (
        <Box marginX={5} marginTop={1}>
          <Text>
            {new Date(startDate).toLocaleString()}
          </Text>
          <Text>
            {' '.repeat(prices.length - 30)}
          </Text>
          <Text>
            {new Date(endDate).toLocaleString()}
          </Text>
        </Box>
      )}
    </Box>
  )
}

module.exports = Detail
export default Detail
