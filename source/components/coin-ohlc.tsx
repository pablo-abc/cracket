import React, { FC, useMemo } from 'react'
import { Box, Text, Spacer } from 'ink'
import { plot } from '../ohlc'
/* import termSize from 'term-size' */
import got from 'got'
import useSWR from 'swr'
import Spinner from 'ink-spinner'

type CoinOhlcProps = {
  id: string
  height: number
}

type CoinOhlcResponse = {
  body: [
    [number, number, number, number, number],
  ]
}

const CoinOhlc: FC<CoinOhlcProps> = ({ id, height }) => {
  /* const { columns } = termSize() */
  const chartApi = `https://api.coingecko.com/api/v3/coins/${id}/ohlc`
  const chartSearchParams = useMemo(() => ({
    searchParams: {
      vs_currency: 'usd',
      days: 1,
    },
    responseType: 'json',
  }), [])
  const { data: chartData,
          error: chartError
  } = useSWR<CoinOhlcResponse>([chartApi, chartSearchParams], got, {
    refreshInterval: 30000,
  })
  /* const graphLength = columns * -1 + 20 */
  const plotData = chartData?.body
  const startDate = plotData?.[0]?.[0]
  const endDate = plotData?.[plotData.length - 1]?.[0]

  if (!!chartError) return (
    <Text color="red">There was an error loading the chart</Text>
  )

  if (!plotData) return (
    <Text color="cyan">
      <Spinner type="dots" />
      <Text color="white"> Loading chart...</Text>
    </Text>
  )

  return (
    <>
    {!!plotData && (
      <Text>
        {plot(plotData.map(point => [point[1], point[2], point[3], point[4]]), { height })}
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

module.exports = CoinOhlc
export default CoinOhlc
