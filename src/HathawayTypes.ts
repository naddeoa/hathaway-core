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

export interface Model {
  [s: string]: ModelValue
};

export interface ImmutableModel<Defaults extends Model> {
  get<T extends keyof Defaults>(value: T): Defaults[T];

  set<T extends keyof Defaults>(key: T, value: Defaults[T]): ImmutableModel<Defaults>;
}

export function createModel<Defaults extends Model>(defaults: Defaults): ImmutableModel<Defaults> {
  class ImmutableModelImpl extends Record(defaults) {
    constructor(params?: Defaults) {
      params ? super(params) : super();
    }

    public get<T extends keyof Defaults>(value: T): Defaults[T] {
      return super.get(value);
    }

    public set<T extends keyof Defaults>(key: T, value: Defaults[T]): ImmutableModelImpl {
      return super.set(key, value) as this;
    }
  }

  return new ImmutableModelImpl();
}

export type Update<M extends Model, Msg extends Switchable> = (model: ImmutableModel<M>, msg: Msg) => [ImmutableModel<M>, Cmd<M, Msg>];

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
  readonly successFunction: AsyncCmdResultFunction<M, Msg, Result>,
  readonly errorFunction?: AsyncCmdResultFunction<M, Msg, Result>
}

/**
 * Builder function for async comands. If you need to do extra work in your update function
 * then you can represent it as an async command and return it from update.
 * @param promise The extra work that you're doing
 * @param successFunction Function to call after that work is done. It will be passed the result.
 * From here, you can return the new state or your model and it will be used just as it would be
 * if it were returned from the update function.
 * @param errorFunction Like successFunction but called when the promise throws.
 */
export function asyncCmd<M extends Model, Msg extends Switchable, Result>(
  promise: Promise<Result>,
  successFunction: AsyncCmdResultFunction<M, Msg, Result>,
  errorFunction: AsyncCmdResultFunction<M, Msg, Result>): AsyncCmd<M, Msg, Result> {

  return { type: 'AsyncCmd', promise, successFunction, errorFunction }
}

export type AsyncCmdResultFunction<M extends Model, Msg extends Switchable, Result> = (dispatch: Dispatch<Msg>, model: ImmutableModel<M>, result: Result) => [ImmutableModel<M>, Cmd<M, Msg>] | null;

export type Cmd<M extends Model, Msg extends Switchable> =
  | NoOp
  | BatchCmd<M, Msg>
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