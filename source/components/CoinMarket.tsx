import React, { FC } from 'react';
import { Box, Text } from 'ink';

export type Coin = {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_1h_in_currency: number
  price_change_percentage_24h_in_currency: number
  price_change_percentage_7d_in_currency: number
}

type CoinMarketProps = {
  coins: Coin[]
}

const Percentage: FC<{ children: number }> = ({ children }) => {
  return (
    <Text color={children >= 0 ? 'green' : 'red'}>
      {children.toFixed(5)}
    </Text>
  )
}

const Cell: FC<{children: React.ReactNode}> = ({ children }) => {

  return (
    <Box flexGrow={1} flexBasis={0}>
      {children}
    </Box>
  );
}

const CoinRow: FC<Coin> = (props) => {
  const {
    name,
    current_price: price,
    price_change_percentage_1h_in_currency: perc1h,
    price_change_percentage_24h_in_currency: perc24h,
    price_change_percentage_7d_in_currency: perc7d,
  } = props;
  return (
    <Box width="100%">
      <Cell>
        <Text>{name}</Text>
      </Cell>
      <Cell>
        <Text>${price}</Text>
      </Cell>
      <Cell>
        <Percentage>{perc1h}</Percentage>
      </Cell>
      <Cell>
        <Percentage>{perc24h}</Percentage>
      </Cell>
      <Cell>
        <Percentage>{perc7d}</Percentage>
      </Cell>
    </Box>
  )
}

const CoinMarket: FC<CoinMarketProps> = ({ coins }) => {
  return (
    <Box flexDirection="column">
      <Box width="100%">
        <Cell><Text bold>Name</Text></Cell>
        <Cell><Text bold>Price</Text></Cell>
        <Cell><Text bold>1h</Text></Cell>
        <Cell><Text bold>24h</Text></Cell>
        <Cell><Text bold>7d</Text></Cell>
      </Box>
      {coins.map(coin => <CoinRow key={coin.id} {...coin} />)}
    </Box>
  )
}

module.exports = CoinMarket;
export default CoinMarket;
