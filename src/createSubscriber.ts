import { Reducer } from 'redux'
import { KeyMap } from './types/utils'
import { ReducerFactory, ActionProvider, Subscriptions } from './types/commons'

// ______________________________________________________

export interface Subscriber {
  readonly reducerFactory: ReducerFactory
  subscribe: <T extends ActionProvider<T>, M extends Subscriptions<T, M>>(
    provider: T,
    subscriptions: M
  ) => void
}

// ______________________________________________________

export function createSubscriber(): Subscriber {
  const __srcmap__: KeyMap = {}
  function reducerFactory<S>(initialState: S): Reducer<S> {
    return (state = initialState, action) => {
      const mutator = __srcmap__[action.type]
      if (typeof mutator !== 'function') return state
      return mutator(state, action.payload)
    }
  }
  function subscribe<
    T extends ActionProvider<T>,
    M extends Subscriptions<T, M>
  >(provider: T, subscriptions: M) {
    Object.keys(subscriptions).forEach(key => {
      const type = `${provider.__namespace__}${key}`
      __srcmap__[type] = (subscriptions as KeyMap)[key]
    })
  }
  return {
    reducerFactory: reducerFactory as ReducerFactory,
    subscribe
  }
}
