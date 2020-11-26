import React, { FC } from 'react'
import { Text } from 'ink'
import { addCommas } from '../utils'

const Percentage: FC<{ children?: number }> = ({ children }) => {
  if (!children) return (<Text>N/A</Text>)

  return (
    <Text color={children >= 0 ? 'green' : 'red'}>
      {addCommas(children.toFixed(4))}
    </Text>
  )
}

module.exports = Percentage
export default Percentage
