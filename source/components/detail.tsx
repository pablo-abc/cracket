import React, { FC } from 'react'
import { Box, Spacer, Text } from 'ink'
import Link from 'ink-link'
import termSize from 'term-size'
import CoinChart from './coin-chart'
import CoinDetail from './coin-detail'
import { useService } from '@xstate/react'
import { cracketService } from '../machine'

const Detail: FC<{ id: string }> = ({ id }) => {
  const { rows } = termSize()
  const [current] = useService(cracketService)

  const view = current.matches('detail.frequency.default') ? 'default': 'daily'
  const kind = current.matches('detail.kind.price')
             ? 'price'
             : current.matches('detail.kind.volume')
             ? 'volume'
             : 'market'

  return (
    <Box flexDirection="column" height={rows - 1}>
      <CoinDetail id={id} />
      <Spacer />
      <CoinChart view={view} kind={kind} id={id} height={Math.floor(rows / 2) - 5} />
      <Spacer />
      <Box justifyContent="flex-end">
        <Text>
          <Text bold>
            View:
          </Text>
          {' '}
          {view}
          {' '}
          [{kind}]
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
