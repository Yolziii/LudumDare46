import React, { Component } from 'react';
import './Terminal.scss';
import Cursor from './Cursor/Cursor';
import { TerminalStore } from './TernimalStore';
import { TerminalController } from './TerminalController';
import { observer } from 'mobx-react';
import { IWindowed, Window } from '../PcScreen/Window/Window';
import { autorun } from 'mobx';

interface ITerminalProps {
    store: TerminalStore;
    controller: TerminalController;
}

@observer
class Terminal extends Component<ITerminalProps> implements IWindowed {
    private window: Window | null = null;
    myRef: any = null;

    constructor(props: ITerminalProps) {
        super(props);
        this.myRef = React.createRef();

        autorun(() => {
            const className = this.props.store.focused ? 'Window-focused' : '';
            this.window?.setFocusedClass(className);
        });
    }

    public setWindow = (window: Window): void => {
        console.log(`Terminal.setWindow()`);
        this.window = window;
    }

    componentDidMount() {
        this.myRef.current.focus();
    }

    getContent() {
        return {__html: this.props.store.content};
    }

    render() {
        return (
            <div 
                className="Terminal" 
                tabIndex={0} 
                onKeyDown={this.props.controller.onKey}
                onPaste={this.props.controller.onPaste}
                onFocus={this.props.controller.onFocusIn}
                onBlur={this.props.controller.onFocusOut}
                
                ref={this.myRef}>
                <Cursor store={this.props.store}/>
                <div dangerouslySetInnerHTML={this.getContent()}></div>
                
            </div>
        );
    }
}

export default Terminal;