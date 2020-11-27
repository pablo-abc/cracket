import React, { FC } from 'react'
import { Box, Spacer, Text } from 'ink'
import Link from 'ink-link'
import termSize from 'term-size'
import CoinMarketChart from './coin-market-chart'
import CoinDetail from './coin-detail'
import { useService } from '@xstate/react'
import { cracketService } from '../machine'
import CoinOhlc from './coin-ohlc'

const Detail: FC<{ id: string }> = ({ id }) => {
  const { rows } = termSize()
  const [current] = useService(cracketService)

  const view = current.matches('detail.line.frequency.default') ? 'default': 'daily'
  const kind = current.matches('detail.line.kind.price')
             ? 'price'
             : current.matches('detail.line.kind.volume')
             ? 'volume'
             : 'market'

  return (
    <Box flexDirection="column" height={rows - 1}>
      <CoinDetail id={id} />
      <Spacer />
      {current.matches('detail.ohlc') &&
       <CoinOhlc id={id} height={Math.floor(rows /2) - 5} />}
      {current.matches('detail.line') &&
       <CoinMarketChart view={view} kind={kind} id={id} height={Math.floor(rows / 2) - 5} />}
      <Spacer />
      <Box justifyContent="flex-end">
        <Text>
          <Text bold>
            View:
          </Text>
          {' '}
          {current.matches('detail.ohlc') ? '---' : view}
          {' '}
          [{current.matches('detail.ohlc') ? 'OHLC' : kind}]
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

module.exports = Detail
export default Detail
