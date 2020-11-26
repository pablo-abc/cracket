import React, { FC } from 'react'
import { Box,  Text } from 'ink'
import { useService } from '@xstate/react'
import { cracketService } from '../machine'

const homeHelp = [
  ['Arrow Down or Tab', 'Focus next currency'],
  ['Arrow Up or Tab+Shift', 'Focus previous currency'],
  ['Arrow Left', 'Previous page'],
  ['Arrow Right', 'Next page'],
  ['Return', 'Open details for focused currency'],
  ['q or ESC', 'Exit'],
]

const detailHelp = [
  ['v', 'Switch between default and daily view'],
  ['s', 'Switch between prices, total volumes, market caps'],
  ['q or ESC', 'Go back to home screen'],
]

type HelpPageProps = {
  title: string
  lines: string[][]
}

const HelpPage: FC<HelpPageProps> = ({ title, lines }) => {
  return (
    <Box flexDirection="column" width={60} padding={2} borderStyle="bold">
      <Box justifyContent="center" marginBottom={1}>
        <Text bold>
          {title}
        </Text>
      </Box>
      {lines.map(line => (
        <Box key={line[0]} justifyContent="space-between">
          <Text bold>
            {line[0]}
          </Text>
          <Text>
            {line[1]}
          </Text>
        </Box>
      ))}
    </Box>
  )
}

const Help: FC = () => {
  const [current] = useService(cracketService)

  return (
    <Box justifyContent="center">
      {current.matches('help.home') &&
       <HelpPage title="Help / Home" lines={homeHelp} />}
      {current.matches('help.detail') &&
       <HelpPage title="Help / Detail" lines={detailHelp} />}
    </Box>
  )
}

module.exports = Help
export default Help
