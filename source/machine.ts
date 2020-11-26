import { assign, interpret, Machine } from 'xstate'

interface CracketSchema {
  states: {
    home: {}
    detail: {}
  }
}

type CracketEvent =
  | { type: 'FOCUS', focused: string }
  | { type: 'DETAIL' }
  | { type: 'BACK' }
  | { type: 'SELECT' }
  | { type: 'NEXT_PAGE' }
  | { type: 'PREV_PAGE' }

interface CracketContext {
  focused: string
  page: number
}

export const cracketMachine = Machine<CracketContext, CracketSchema, CracketEvent>({
  id: 'cracket',
  initial: 'home',
  context: {
    focused: '',
    page: 1,
  },
  states: {
    home: {
      on: {
        FOCUS: { target: 'home', actions: 'focus' },
        SELECT: 'detail',
        NEXT_PAGE: { target: 'home', actions: 'nextPage' },
        PREV_PAGE: {
          target: 'home',
          actions: 'prevPage',
          cond: 'notFirstPage',
        },
      }
    },
    detail: {
      on: {
        BACK: 'home',
      }
    },
  }
}, {
  actions: {
    nextPage: assign({
      page: (context) => context.page + 1,
      focused: (_context) => '',
    }),
    prevPage: assign({
      page: (context) => context.page - 1,
      focused: (_context) => '',
    }),
    focus: assign({
      focused: (_context, event) => {
        if (event.type !== 'FOCUS') return ''
        return event.focused
      },
    }),
  },
  guards: {
    notFirstPage: (context) => context.page > 1,
  },
})

export const cracketService = interpret(cracketMachine)

cracketService.start()
