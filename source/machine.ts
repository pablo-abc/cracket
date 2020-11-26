import { assign, interpret, Machine, send } from 'xstate'

interface CracketSchema {
  states: {
    home: {}
    detail: {
      states: {
        frequency: {
          states: {
            default: {}
            daily: {}
          }
        }
        kind: {
          states: {
            price: {}
            volume: {}
            market: {}
          }
        }
      }
    }
    help: {
      states: {
        home: {}
        detail: {}
      }
    }
  }
}

type CracketEvent =
  | { type: 'FOCUS', focused: string }
  | { type: 'DETAIL' }
  | { type: 'BACK' }
  | { type: 'SELECT' }
  | { type: 'NEXT_PAGE' }
  | { type: 'PREV_PAGE' }
  | { type: 'HELP' }
  | { type: 'HOME' }
  | { type: 'VIEW' }
  | { type: 'SWITCH' }

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
        HELP: 'help.home',
      },
    },
    detail: {
      type: 'parallel',
      on: {
        BACK: 'home',
        HELP: 'help.detail',
      },
      states: {
        frequency: {
          initial: 'default',
          states: {
            default: {
              on: {
                VIEW: 'daily',
              },
            },
            daily: {
              on: {
                VIEW: 'default',
              },
            },
          },
        },
        kind: {
          initial: 'price',
          states: {
            price: {
              on: {
                SWITCH: 'volume',
              },
            },
            volume: {
              on: {
                SWITCH: 'market',
              },
            },
            market: {
              on: {
                SWITCH: 'price',
              },
            },
          },
        },
      },
    },
    help: {
      on: {
        HOME: 'home',
        DETAIL: 'detail',
      },
      states: {
        home: {
          on: {
            BACK: { actions: 'backHome' },
          },
        },
        detail: {
          on: {
            BACK: { actions: 'backDetail' },
          },
        },
      },
    },
  },
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
    backHome: send('HOME'),
    backDetail: send('DETAIL'),
  },
  guards: {
    notFirstPage: (context) => context.page > 1,
  },
})

export const cracketService = interpret(cracketMachine)

cracketService.start()
