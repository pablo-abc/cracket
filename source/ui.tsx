import React, { FC, useMemo } from 'react';
import { Text, Box } from 'ink';
import got from 'got';
import useSWR from 'swr';
import Spinner from 'ink-spinner';
import CoinMarket from './components/CoinMarket';
import type { Coin } from './components/CoinMarket';

const API = 'https://api.coingecko.com/api/v3/coins/markets';

// @ts-ignore
global.navigator = {}

type CoinResponse = {
  body: Coin[]
}

const App: FC = () => {
  const searchParams = useMemo(() => ({
    searchParams: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 5,
      page: 1,
      price_change_percentage: '1h,24h,7d',
    },
    responseType: 'json',
  }), [])
  const { data, error } = useSWR<CoinResponse>([API, searchParams], got, { refreshInterval: 60000 });

  return (
    <Box flexDirection="column">
      {!!error && <Text color="red">There was an error</Text>}
      {!data && !error && (
        <Text color="cyan">
          <Spinner type="dots" />
          <Text color="white"> Loading...</Text>
        </Text>
      )}
      {!!data && (
        <CoinMarket coins={data.body} />
      )}
    </Box>
  );
}

module.exports = App;
export default App;
