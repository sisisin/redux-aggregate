import { Reducer } from 'redux'
import { Actions } from '../createActions'
import { Aggregate } from '../createAggregate'
import { A2, HasKeysDiff, KeyMap, R } from './utils'

export type ActionType = string
export type ActionTypes<T> = { readonly [K in keyof T]: ActionType }
export type ReducerFactory = <S>(state: S) => Reducer<S>

// ______________________________________________________

type HasKeysDiffErrorMessage = 'SUBSCRIPTIONS_KEY_NOT_MATCH'
type PayloadErrorMessage = 'PAYLOAD_SCHEMA_NOT_MATCH'
type SubscribeActions<T, M> = R<T> extends A2<M> ? M : PayloadErrorMessage
type SubscribeAggregate<T, M> = A2<M> extends A2<T> ? M : PayloadErrorMessage
export type SubscribeActionsMap<T, M> = HasKeysDiff<T, M> extends false
  ? { [K in keyof T & keyof M]?: SubscribeActions<T[K], M[K]> } & KeyMap
  : HasKeysDiffErrorMessage
export type SubscribeAggregateMap<T, M> = HasKeysDiff<T, M> extends false
  ? { [K in keyof T & keyof M]?: SubscribeAggregate<T[K], M[K]> } & KeyMap
  : HasKeysDiffErrorMessage

// ______________________________________________________

type ISM = { __srcmap__: any }
type SrcMap<T extends ISM> = T['__srcmap__']
export type ActionProvider<T extends ISM> =
  | Aggregate<SrcMap<T>>
  | Actions<SrcMap<T>>
export type Subscriptions<T extends ISM, M> = T extends Aggregate<SrcMap<T>>
  ? SubscribeAggregateMap<SrcMap<T>, M>
  : SubscribeActionsMap<SrcMap<T>, M>
