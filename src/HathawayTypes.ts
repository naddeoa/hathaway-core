import { Record, List, Map, Set, OrderedMap, OrderedSet, Stack, } from 'immutable';
import * as React from 'react';

/**
 * The possible types for a model. Unfortunately, typescript doesn't allow recursive union
 * types. Ideally, this would be ImmutableModel<ModelValue> instead of ImmutableModel<any>
 * but I can't find a nice way of doing this without making people use interfaces and wrapper
 * objects.
 */
export type ModelValue =
  | string
  | null
  | number
  | boolean
  | ImmutableModel<any>
  | List<any>
  | Set<any>
  | Map<any, any>
  | OrderedMap<any, any>
  | OrderedSet<any>
  | Stack<any>;

export type Model = {[s: string] : ModelValue};

export interface ImmutableModel<Defaults extends Model> {
  get<T extends keyof Defaults>(value: T): Defaults[T];

  set<T extends keyof Defaults>(key: T, value: Defaults[T]): ImmutableModel<Defaults>;
}

export function createModel<Defaults extends Model>(defaults: Defaults): ImmutableModel<Defaults> {
  class ImmutableModelImpl extends Record(defaults) {
    constructor(params?: Defaults) {
      params ? super(params) : super();
    }

    get<T extends keyof Defaults>(value: T): Defaults[T] {
      return super.get(value);
    }

    set<T extends keyof Defaults>(key: T, value: Defaults[T]): ImmutableModelImpl {
      return super.set(key, value) as this;
    }
  }

  return new ImmutableModelImpl();
}

export type Update<M extends Model, Msg extends Switchable> = (model: ImmutableModel<M>, msg: Msg) => [ImmutableModel<M>, Cmd<M, Msg>];

export interface AsyncImmutableModelUpdate<M extends Model, Result> {
  readonly type: 'AsyncModelUpdate',
  readonly promise: Promise<Result>,
  readonly updateFunction: (model: ImmutableModel<M>, result: Result) => ImmutableModel<M> | null,
  // TODO call this error function
  readonly retryFunction?: (model: ImmutableModel<M>, result: Result) => any
}

export interface NoOp {
  readonly type: 'NoOp'
}

export const NoOp: NoOp = { type: 'NoOp' };

export interface BatchCmd<M extends Model, Msg extends Switchable> {
  readonly type: 'BatchCmd',
  readonly commands: Cmd<M, Msg>[]
}

export interface AsyncCmd<M extends Model, Msg extends Switchable, Result> {
  readonly type: 'AsyncCmd',
  readonly promise: Promise<Result>,
  readonly successFunction: (dispatch: Dispatch<Msg>, model: ImmutableModel<M>, result: Result) => [ImmutableModel<M>, Cmd<M, Msg>] | null,
  readonly errorFunction?: (dispatch: Dispatch<Msg>, model: ImmutableModel<M>, result: Result) => any
}

export type Cmd<M extends Model, Msg extends Switchable> =
  | NoOp
  | BatchCmd<M, Msg>
  | AsyncImmutableModelUpdate<M, any>
  | AsyncCmd<M, Msg, any>;

export type Dispatch<Msg extends Switchable> = (msg: Msg | Msg[]) => void;

export interface Switchable {
  readonly type: string;
}

export interface ViewProps<M extends Model, Msg extends Switchable, ComponentProps> {
  readonly model: ImmutableModel<M>,
  readonly dispatch: Dispatch<Msg>,
  readonly componentProps: ComponentProps
}

export interface Program<M extends Model, Msg extends Switchable> {
  readonly init: ImmutableModel<M> | [ImmutableModel<M>, Cmd<M, Msg>],
  readonly update: Update<M, Msg>,
  readonly view: React.SFC<ViewProps<M, Msg, any>>,
  readonly renderTarget: HTMLElement,
  readonly dev: boolean,
  readonly setupCallbacks?: SetupCallbacks<Msg>,
  readonly teardownCallbacks?: TeardownCallbacks<Msg>,
}

export interface ViewStackframe<M extends Model, Msg extends Switchable, ComponentProps> {
  readonly view: React.SFC<ViewProps<M, Msg, ComponentProps>>,
  readonly componentProps?: ComponentProps
}

export interface RootViewState<M extends Model> {
  readonly model: ImmutableModel<M>
}

export interface RootViewProps<M extends Model, Msg extends Switchable, PlatofrmSpecificArgs> {
  readonly program: Program<M, Msg>,
  readonly platformSpecificArgs?: PlatofrmSpecificArgs
}

export type SetupCallbacks<Msg extends Switchable> = (dispatch: Dispatch<Msg>) => void

export type TeardownCallbacks<Msg extends Switchable> = (dispatch: Dispatch<Msg>) => void