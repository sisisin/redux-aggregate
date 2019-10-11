import { ActionType, ActionTypes } from '../src/types/commons'
import { A1, KeyMap, R } from '../src/types/utils'
import { namespaced } from './namespaced'

// ______________________________________________________

type ACS<T> = () => R<T>
type ACSPL<T> = (payload: A1<T>) => R<T>
type ActionSrc<T> = ACS<T> | ACSPL<T>
type ActionsSrc<T> = { readonly [K in keyof T]: ActionSrc<T[K]> }

type CR<T> = () => { type: ActionType; payload: R<T> }
type CRPL<T> = (payload: A1<T>) => { type: ActionType; payload: R<T> }
type ActionCreator<T> = T extends ACS<T> ? CR<T> : CRPL<T>
type ActionCreators<T> = { readonly [K in keyof T]: ActionCreator<T[K]> }

interface Actions<T> {
  readonly __namespace__: string
  readonly __srcmap__: T
  readonly types: ActionTypes<T>
  readonly creators: ActionCreators<T>
}

// ______________________________________________________

function createActions<T extends KeyMap & ActionsSrc<T>>(
  actionsSrc: T,
  namespace: string
): Actions<T> {
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
  Object.keys(actionsSrc).forEach(key => {
    const type = `${namespace}${key}`
    types[key] = type
    creators[key] = (payload?: any) => ({
      type,
      payload: actionsSrc[key](payload)
    })
    __srcmap__[type] = actionsSrc[key]
  })
  return {
    __namespace__: namespace,
    __srcmap__: __srcmap__ as T,
    types: types as ActionTypes<T>,
    creators: creators as ActionCreators<T>
  }
}

// ______________________________________________________

export { ActionsSrc, ActionCreators, Actions, createActions }
