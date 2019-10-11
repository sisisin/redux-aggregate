import { Reducer } from 'redux'
import { ActionType } from './types/commons'
import { namespaced } from './namespaced'
import {
  ActionProvider,
  ActionTypes,
  ReducerFactory,
  Subscriptions
} from './types/commons'
import { KeyMap, A1, A2 } from './types/utils'

// ______________________________________________________

type MT<T> = (state: A1<T>) => A1<T>
type MTPL<T> = (state: A1<T>, payload: A2<T>) => A1<T>
type Mutation<T> = MT<T> | MTPL<T>
export type Mutations<T> = { readonly [K in keyof T]: Mutation<T[K]> }

type CR<T> = () => { type: ActionType }
type CRPL<T> = (payload: A2<T>) => { type: ActionType; payload: A2<T> }
type ActionCreator<T> = T extends MT<T> ? CR<T> : CRPL<T>
export type ActionCreators<T> = { readonly [K in keyof T]: ActionCreator<T[K]> }

// ______________________________________________________

export interface Aggregate<T> {
  readonly __namespace__: string
  readonly __srcmap__: T
  readonly types: ActionTypes<T>
  readonly creators: ActionCreators<T>
  readonly reducerFactory: ReducerFactory
  subscribe: <T extends ActionProvider<T>, M extends Subscriptions<T, M>>(
    provider: T,
    subscriptions: M
  ) => void
}

// ______________________________________________________

export function createAggregate<T extends KeyMap & Mutations<T>>(
  mutations: T,
  namespace: string
): Aggregate<T> {
  if (
    namespaced[namespace] !== undefined &&
    process.env.NODE_ENV !== 'development'
  ) {
    throw new Error(`redux-aggregate: conflict namespace -> ${namespace}`)
  } else {
    namespaced[namespace] = namespace
  }
  const types: KeyMap = {}
  const creators: KeyMap = {}
  const __srcmap__: KeyMap = {}
  Object.keys(mutations).forEach(key => {
    const type = `${namespace}${key}`
    types[key] = type
    creators[key] = (payload?: any) => ({ type, payload })
    __srcmap__[type] = mutations[key]
  })
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
    __namespace__: namespace,
    __srcmap__: __srcmap__ as T,
    types: types as ActionTypes<T>,
    creators: creators as ActionCreators<T>,
    reducerFactory: reducerFactory as ReducerFactory,
    subscribe
  }
}

// ______________________________________________________

export type Modeler<T> = (injects?: Partial<T>) => T
