import React, { Component } from 'react';
import './Terminal.scss';
import Cursor from './Cursor/Cursor';
import { TerminalStore } from './TernimalStore';
import { TerminalController } from './TerminalController';
import { observer } from 'mobx-react';

interface ITerminalProps {
    store: TerminalStore;
    controller: TerminalController;
}

@observer
class Terminal extends Component<ITerminalProps> {
    myRef: any = null;

    constructor(props: ITerminalProps) {
        super(props);
        this.myRef = React.createRef();
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