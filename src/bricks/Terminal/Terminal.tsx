import React, { Component } from 'react';
import './Terminal.scss';
import Cursor from './Cursor/Cursor';
import { TerminalStore } from './TernimalStore';
import { TerminalController } from './TerminalController';
import { observer } from 'mobx-react';
import { User } from './User';


interface ITerminalProps {
    store: TerminalStore;
}

@observer
class Terminal extends Component {
    store: TerminalStore;
    controller: TerminalController;

    myRef: any = null;

    constructor(props: {}) {
        super(props);

        this.store = new TerminalStore(new User('guest'));
        this.controller = new TerminalController(this.store);

        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.myRef.current.focus();
    }

    getContent() {
        return {__html: this.store.content};
    }

    render() {
        return (
            <div 
                className="Terminal" 
                tabIndex={0} 
                onKeyDown={this.controller.onKey}
                onPaste={this.controller.onPaste}
                ref={this.myRef}>
                <Cursor store={this.store}
                />
                <div dangerouslySetInnerHTML={this.getContent()}></div>
                
            </div>
        );
    }
}

export default Terminal;