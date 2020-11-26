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
}

type CoinChartResponse = {
  body: {
    prices: [number, number][],
    market_caps: [number, number][],
    total_volumes: [number, number][],
  }
}

const CoinChart: FC<CoinChartProps> = ({ id, height }) => {
  const { columns } = termSize()
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
  const chart = chartData?.body
  const prices = chart?.prices
  const slicedPrices = prices?.slice(columns * -1 + 15)
  const startDate = slicedPrices?.[0]?.[0]
  const endDate = slicedPrices?.[slicedPrices.length - 1]?.[0]

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
    {!!slicedPrices && (
      <Text>
        {asciichart.plot(
          slicedPrices.map(price => price[1]),
          { height },
        )}
      </Text>
    )}
    {!!startDate && !!endDate && !!slicedPrices && (
      <Box marginX={5} marginTop={1}>
        <Text>
          {new Date(startDate).toLocaleString()}
        </Text>
        <Text>
          {' '.repeat(slicedPrices.length - 35)}
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
