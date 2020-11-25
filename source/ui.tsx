import React, { FC, useMemo, useState } from 'react'
import { Text, Box, useInput, useApp, Spacer } from 'ink'
import got from 'got'
import useSWR from 'swr'
import Spinner from 'ink-spinner'
import CoinMarket from './components/CoinMarket'
import type { Coin } from './components/CoinMarket'
import BigText from 'ink-big-text'
import Link from 'ink-link'

const API = 'https://api.coingecko.com/api/v3/coins/markets'

// @ts-ignore
global.navigator = {}

type CoinResponse = {
  body: Coin[]
}

type AppProps = {
  perPage?: number
  columns?: string
}

const App: FC<AppProps> = ({ perPage = 10, columns = 'name,price,1h,24h,7d,volume,marketCap' }) => {
  const [page, setPage] = useState(1)
  const { exit } = useApp()
  const searchParams = useMemo(() => ({
    searchParams: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: perPage,
      page,
      price_change_percentage: '1h,24h,7d',
    },
    responseType: 'json',
  }), [page])
  const { data, error } = useSWR<CoinResponse>([API, searchParams], got, { refreshInterval: 5000 })

  useInput((input, key) => {
    if (input === 'q') return exit()
    if (key.leftArrow) {
      if (page === 1) return
      return setPage(page => page - 1)
    }
    if (key.rightArrow) return setPage(page => page + 1)
  })

  return (
    <Box flexDirection="column">
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
      <Box marginTop={1}>
        <Text>
          <Text bold>Page: </Text>
          {page}
          {' '}
          (Use arrow keys to change page)
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

module.exports = App
export default App
