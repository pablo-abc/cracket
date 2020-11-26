import React, { FC } from 'react'
import Home from './components/home'
import type { HomeProps } from './components/home'
import { useApp, useInput } from 'ink'
import { useService } from '@xstate/react'
import { cracketService } from './machine'
import { Text } from 'ink'

const App: FC<HomeProps> = ({ perPage = 10, columns = 'name,price,1h,24h,7d,volume,marketCap' }) => {
  const [current, send] = useService(cracketService)
  const { exit } = useApp()

  useInput((input, key) => {
    if (current.matches('home')) {
      if (input === 'q' || key.escape) return exit()
      if (key.leftArrow) return send({ type: 'PREV_PAGE' })
      if (key.rightArrow) return send({ type: 'NEXT_PAGE' })
      if (key.return) return send({ type: 'SELECT' })
    }
    if (current.matches('detail')) {
      if (input === 'q' || key.escape) return send({ type: 'BACK' })
    }
  })

  if (current.matches('detail')) return (
    <Text>{current.context.focused}</Text>
  )

  return <Home perPage={perPage} columns={columns} />
}

module.exports = App
export default App
