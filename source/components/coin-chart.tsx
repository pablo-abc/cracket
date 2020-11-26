import React, { FC, useMemo } from 'react'
import { Box, Text } from 'ink'
import * as asciichart from 'asciichart'
import termSize from 'term-size'
import got from 'got'
import useSWR from 'swr'
import Spinner from 'ink-spinner'

type CoinChartProps = {
  id: string
  height: number
  view: 'default' | 'daily'
}

type CoinChartResponse = {
  body: {
    prices: [number, number][],
    market_caps: [number, number][],
    total_volumes: [number, number][],
  }
}

const CoinChart: FC<CoinChartProps> = ({ id, height, view }) => {
  const { columns } = termSize()
  const chartApi = `https://api.coingecko.com/api/v3/coins/${id}/market_chart`
  const chartSearchParams = useMemo(() => ({
    searchParams: {
      vs_currency: 'usd',
      days: view === 'default' ? '1' : 'max',
      interval: view === 'daily' ? 'daily' : undefined,
    },
    responseType: 'json',
  }), [view])
  const { data: chartData,
          error: chartError
  } = useSWR<CoinChartResponse>([chartApi, chartSearchParams], got, {
    refreshInterval: 60000,
  })
  const graphLength = columns * -1 + 15
  const chart = chartData?.body
  const prices = chart?.prices.slice(graphLength)
  const volumes = chart?.total_volumes.slice(graphLength)
  const marketCaps = chart?.market_caps.slice(graphLength)
  const startDate = prices?.[0]?.[0]
  const endDate = prices?.[prices.length - 1]?.[0]

  if (!!chartError) return (
    <Text color="red">There was an error loading the chart</Text>
  )

  if (!chart) return (
    <Text color="cyan">
      <Spinner type="dots" />
      <Text color="white"> Loading chart...</Text>
    </Text>
  )

  return (
    <>
    {!!prices && !!marketCaps && !!volumes && (
      <Text>
        {asciichart.plot(prices.map(price => price[1]), { height })}
      </Text>
    )}
    {!!startDate && !!endDate && !!prices && (
      <Box marginX={5} marginTop={1}>
        <Text>
          {new Date(startDate).toLocaleString()}
        </Text>
        <Text>
          {' '.repeat(prices.length - 35)}
        </Text>
        <Text>
          {new Date(endDate).toLocaleString()}
        </Text>
      </Box>
    )}
    </>
  )
}

module.exports = CoinChart
export default CoinChart
