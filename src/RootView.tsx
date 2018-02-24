import * as React from 'react';
import { Switchable, RootViewState, RootViewProps, Program, Cmd, ImmutableModel, Model } from './HathawayTypes';

/**
 * Print to the console for debugging purposes.
 * @param a Some object. Probably an ImmutableJS object.
 */
function debugLog<Defaults extends Model, Msg extends Switchable>(program: Program<Defaults, Msg>, message: string, a: any) {
    // Make sure not to call immutable.toJS(). It will slow the application way down really fast.
    if (program.dev) {
        const objectMessage = a.toObject ? a.toObject() : JSON.stringify(a);
        console.log(`${message} -- `, objectMessage);
    }
}

export class RootView<Defaults extends Model, Msg extends Switchable> extends React.Component<RootViewProps<Defaults, Msg, {}>, RootViewState<Defaults>>  {

    readonly program: Program<Defaults, Msg>;
    state: RootViewState<Defaults>

    constructor({ program, platformSpecificArgs }: RootViewProps<Defaults, Msg, {}>) {
        super({ program, platformSpecificArgs });
        this.program = program;
        if (Array.isArray(program.init)) {
            this.state = { model: program.init[0] };
            this.processCmd(program.init[1]);
        } else {
            this.state = { model: program.init };
        }

        this.processCmd = this.processCmd.bind(this);
        this.dispatch = this.dispatch.bind(this);
        this.updateModel = this.updateModel.bind(this);
    }

    componentWillMount() {
        this.program.setupCallbacks && this.program.setupCallbacks(this.dispatch);
    }

    componentWillUnmount() {
        this.program.setupCallbacks && this.program.setupCallbacks(this.dispatch);
    }

    shouldComponentUpdate(_nextProps: {}, nextState: RootViewState<Defaults>) {
        return nextState.model !== this.state.model;
    }

    updateModel(model: ImmutableModel<Defaults>, callback?: () => any) {
        if (model !== this.state.model) {
            debugLog(this.program, 'MODEL CHANGE', model);
        }
        this.setState({ model }, callback);
    }

    dispatch(msg: Msg | Msg[]) {
        debugLog(this.program, 'DISPATCHED MSG', msg);
        if (Array.isArray(msg)) {

            let updatedModel = this.state.model;
            let commands: Cmd<Defaults, Msg>[] = [];
            for (let m of msg) {
                const [model, cmd] = this.program.update(updatedModel, m);
                updatedModel = model;
                commands.push(cmd);
            }
            this.updateModel(updatedModel, () => this.processCmd({ type: 'BatchCmd', commands }));
        } else {
            const [model, cmd] = this.program.update(this.state.model, msg);
            this.updateModel(model, () => this.processCmd(cmd));
        }
    }

    processCmd(cmd: Cmd<Defaults, Msg>): null {
        debugLog(this.program, 'PROCESSING CMD', cmd);

        switch (cmd.type) {
            case 'BatchCmd':
                cmd.commands.forEach((c: Cmd<Defaults, Msg>) => this.processCmd(c))
                return null;

            case 'AsyncCmd':
                cmd.promise.then((result: any) => {
                    const successFunctionResult = cmd.successFunction(this.dispatch, this.state.model, result);
                    if (successFunctionResult === null) {
                        cmd.errorFunction && cmd.errorFunction(this.dispatch, this.state.model, result);
                    } else {
                        const [model, cmd] = successFunctionResult;
                        this.updateModel(model);
                        this.processCmd(cmd)
                    }
                }).catch((result: any) => {
                    if (cmd.errorFunction) {
                        const errorResult = cmd.errorFunction(this.dispatch, this.state.model, result);
                        if (errorResult !== null) {
                            const [model, cmd] = errorResult;
                            this.updateModel(model);
                            this.processCmd(cmd)
                        }
                    }
                })
                return null;

            case 'NoOp':
                return null;

        }
    }

    render() {
        const CurrentView = this.program.view;
        return (
            <CurrentView dispatch={this.dispatch} model={this.state.model} componentProps={null} />
        );
    }
}
