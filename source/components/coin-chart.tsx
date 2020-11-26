import React, { FC, useMemo } from 'react'
import { Box, Text, Spacer } from 'ink'
import * as asciichart from 'asciichart'
import termSize from 'term-size'
import got from 'got'
import useSWR from 'swr'
import Spinner from 'ink-spinner'

type CoinChartProps = {
  id: string
  height: number
  view: 'default' | 'daily'
  kind: 'price' | 'volume' | 'market'
}

type CoinChartResponse = {
  body: {
    prices: [number, number][],
    market_caps: [number, number][],
    total_volumes: [number, number][],
  }
}

const CoinChart: FC<CoinChartProps> = ({ id, height, view, kind }) => {
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
    refreshInterval: 30000,
  })
  const graphLength = columns * -1 + 20
  const chart = chartData?.body
  const prices = chart?.prices.slice(graphLength)
  const volumes = chart?.total_volumes.slice(graphLength)
  const marketCaps = chart?.market_caps.slice(graphLength)
  const startDate = prices?.[0]?.[0]
  const endDate = prices?.[prices.length - 1]?.[0]

  const plotData = kind === 'price'
                 ? prices
                 : kind === 'volume'
                 ? volumes
                 : marketCaps

  if (!!chartError) return (
    <Text color="red">There was an error loading the chart</Text>
  )

  if (!chart) return (
    <Text color="cyan">
      <Spinner type="dots" />
      <Text color="white"> Loading chart...</Text>
    </Text>
  )

  console.log(plotData?.length)
  return (
    <>
    {!!plotData && (
      <Text>
        {asciichart.plot(plotData.map(plot => plot[1]), { height })}
      </Text>
    )}
    {!!startDate && !!endDate && !!plotData && (
      <Box marginLeft={2} marginTop={1} width={plotData.length + 15}>
        <Text>
          {new Date(startDate).toLocaleString()}
        </Text>
        <Spacer />
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
