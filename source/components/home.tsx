import React, { FC, useMemo } from 'react'
import { Text, Box, Spacer } from 'ink'
import got from 'got'
import useSWR from 'swr'
import Spinner from 'ink-spinner'
import CoinMarket from './coin-market'
import type { Coin } from './coin-market'
import BigText from 'ink-big-text'
import Link from 'ink-link'
import { useService } from '@xstate/react'
import { cracketService } from '../machine'
import termSize from 'term-size'

const API = 'https://api.coingecko.com/api/v3/coins/markets'

type CoinResponse = {
  body: Coin[]
}

export type HomeProps = {
  perPage?: number
  columns?: string
}


const Home: FC<HomeProps> = ({ perPage: userPerPage, columns = 'name,price,1h,24h,7d,volume,marketCap' }) => {
  const { rows } = termSize()
  const perPage = userPerPage || rows - 15
  const [current] = useService(cracketService)
  const searchParams = useMemo(() => ({
    searchParams: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: perPage,
      page: current.context.page,
      price_change_percentage: '1h,24h,7d',
    },
    responseType: 'json',
  }), [current.context.page])
  const { data, error } = useSWR<CoinResponse>([API, searchParams], got, { refreshInterval: 5000 })

  return (
    <Box height={rows - 1} flexDirection="column">
      <Box justifyContent="center">
        <BigText text="cracket" />
      </Box>
      <Box flexDirection="column" height={perPage + 1}>
        {!!error && <Text color="red">There was an error</Text>}
        {!data && !error && (
          <Text color="cyan">
            <Spinner type="dots" />
            <Text color="white"> Loading...</Text>
          </Text>
        )}
        {!!data && <CoinMarket coins={data.body} columns={columns.split(',')} />}
      </Box>
      <Spacer />
      <Box>
        <Text>
          <Text bold>Page: </Text>
          {current.context.page}
          {' '}
          (Press '?' for help)
        </Text>
        <Spacer />
        <Text bold>
          Powered by
          {' '}
          <Link
            url="https://www.coingecko.com/"
            fallback={false}
          >
            CoinGecko
          </Link>
          {' '}
          API
        </Text>
      </Box>
    </Box>
  )
}

module.exports = Home
export default Home
