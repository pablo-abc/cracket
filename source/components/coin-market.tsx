import React, { FC, useEffect } from 'react'
import { Box, Text, useFocus } from 'ink'
import { useService } from '@xstate/react'
import { cracketService } from '../machine'
import { addCommas } from '../utils'
import Percentage from './percentage'

export type Coin = {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_1h_in_currency: number
  price_change_percentage_24h_in_currency: number
  price_change_percentage_7d_in_currency: number
  total_volume: number
  market_cap: number
}

type CoinMarketProps = {
  coins: Coin[]
  columns: string[]
}

const Cell: FC<{children: React.ReactNode}> = ({ children }) => {

  return (
    <Box flexGrow={1} flexBasis={0}>
      {children}
    </Box>
  )
}

const CoinRow: FC<Coin & { columns: string[] }> = (props) => {
  const { isFocused } = useFocus()
  const [, send] = useService(cracketService)

  useEffect(() => {
    if (isFocused) send({ type: 'FOCUS', focused: props.id })
  }, [isFocused])

  const {
    name,
    current_price: price,
    price_change_percentage_1h_in_currency: perc1h,
    price_change_percentage_24h_in_currency: perc24h,
    price_change_percentage_7d_in_currency: perc7d,
    total_volume: volume,
    market_cap: marketCap,
    columns,
  } = props

  return (
    <Box width="100%">
      <Text color="cyan">
        {isFocused ? '> ' : '  '}
      </Text>
      {columns.includes('name') && <Cell>
        <Text>{name}</Text>
      </Cell>}
      {columns.includes('price') && <Cell>
        <Text>${addCommas(price)}</Text>
      </Cell>}
      {columns.includes('1h') && <Cell>
        <Percentage>{perc1h}</Percentage>
      </Cell>}
      {columns.includes('24h') && <Cell>
        <Percentage>{perc24h}</Percentage>
      </Cell>}
      {columns.includes('7d') && <Cell>
        <Percentage>{perc7d}</Percentage>
      </Cell>}
      {columns.includes('volume') && <Cell>
        <Text>${addCommas(volume)}</Text>
      </Cell>}
      {columns.includes('marketCap') && <Cell>
        <Text>${addCommas(marketCap)}</Text>
      </Cell>}
    </Box>
  )
}

const columnNames: { [key: string]: string | undefined } = {
  name: 'Name',
  price: 'Price',
  '1h': '1h',
  '24h': '24h',
  '7d': '7d',
  volume: 'Volume',
  marketCap: 'Market Cap',
}

const CoinMarket: FC<CoinMarketProps> = ({ coins, columns }) => {
  return (
    <Box flexDirection="column">
      <Box width="100%">
        <Text>{'  '}</Text>
        {columns.map(column => !!columnNames[column] && (
          <Cell key={column}><Text bold>{columnNames[column]}</Text></Cell>
        ))}
      </Box>
      {coins.map(coin => <CoinRow key={coin.id} {...coin} columns={columns} />)}
    </Box>
  )
}

module.exports = CoinMarket
export default CoinMarket
