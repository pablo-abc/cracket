import React, { FC, useMemo } from 'react'
import { Box, Text } from 'ink'
import Percentage from './percentage'
import { addCommas } from '../utils'
import got from 'got'
import { Coin } from './coin-market'
import useSWR from 'swr'
import Spinner from 'ink-spinner'

const COIN_API = 'https://api.coingecko.com/api/v3/coins/markets'

type CoinResponse = {
  body: Coin[]
}

const CoinProperty: FC<{title: string, children: React.ReactNode}> = ({ title, children }) => {
  return (
    <Box flexDirection="column" flexBasis={1} flexGrow={1} borderStyle="bold">
      <Text bold>{title}</Text>
      {children}
    </Box>
  )
}

const CoinDetail: FC<{ id: string }> = ({ id }) => {
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
    refreshInterval: 30000,
  })
  const coin = coinData?.body[0]

  if (!!coinError) return (<Text color="red">There was an error</Text>)

  if (!coin) return (
    <Text color="cyan">
      <Spinner type="dots" />
      <Text color="white"> Loading coin...</Text>
    </Text>
  )

  const {
    name,
    current_price: price,
    price_change_percentage_1h_in_currency: perc1h,
    price_change_percentage_24h_in_currency: perc24h,
    price_change_percentage_7d_in_currency: perc7d,
    high_24h: high24h,
    low_24h: low24h,
    ath,
    ath_date: athDate,
    atl,
    atl_date: atlDate,
    total_volume: volume,
    market_cap: marketCap,
  } = coin

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>{name}</Text>
      </Box>
      <Box>
        <CoinProperty title="Price">
          <Text>${addCommas(price)}</Text>
        </CoinProperty>
        <CoinProperty title="1h">
          <Percentage>{perc1h}</Percentage>
        </CoinProperty>
        <CoinProperty title="24h">
          <Percentage>{perc24h}</Percentage>
        </CoinProperty>
        <CoinProperty title="7d">
          <Percentage>{perc7d}</Percentage>
        </CoinProperty>
        <CoinProperty title="Volume">
          <Text>${addCommas(volume)}</Text>
        </CoinProperty>
        <CoinProperty title="Market Cap">
          <Text>${addCommas(marketCap)}</Text>
        </CoinProperty>
      </Box>
      <Box>
        <CoinProperty title="24h high/low">
          <Text>${addCommas(high24h)} / ${addCommas(low24h)}</Text>
        </CoinProperty>
        <CoinProperty title="All time high">
          <Text>${addCommas(ath)}</Text>
        </CoinProperty>
        <CoinProperty title="All time high date">
          <Text>{new Date(athDate).toLocaleDateString()}</Text>
        </CoinProperty>
        <CoinProperty title="All time low">
          <Text>${addCommas(atl)}</Text>
        </CoinProperty>
        <CoinProperty title="All time low date">
          <Text>{new Date(atlDate).toLocaleDateString()}</Text>
        </CoinProperty>
      </Box>
    </Box>
  )
}

module.exports = CoinDetail
export default CoinDetail
