import React, { FC } from 'react'
import Home from './components/home'
import type { HomeProps } from './components/home'
import { useApp, useFocusManager, useInput } from 'ink'
import { useService } from '@xstate/react'
import { cracketService } from './machine'
import Detail from './components/detail'
import Help from './components/help'

const App: FC<HomeProps> = ({ perPage, columns = 'name,price,1h,24h,7d,volume,marketCap' }) => {
  const [current, send] = useService(cracketService)
  const { exit } = useApp()

  const { focusPrevious, focusNext } = useFocusManager()

  useInput((input, key) => {
    if (current.matches('home')) {
      if (input === 'q' || key.escape) return exit()
      if (key.leftArrow) return send({ type: 'PREV_PAGE' })
      if (key.rightArrow) return send({ type: 'NEXT_PAGE' })
      if (key.return) return send({ type: 'SELECT' })
      if (key.upArrow) return focusPrevious()
      if (key.downArrow) return focusNext()
    }
    if (input === 'q' || key.escape) return send({ type: 'BACK' })
    if (input === '?') return send({ type: 'HELP' })
  })

  if (current.matches('help')) return (<Help />)

  if (current.matches('detail')) return (
    <Detail id={current.context.focused} />
  )

  return <Home perPage={perPage} columns={columns} />
}

module.exports = App
export default App
