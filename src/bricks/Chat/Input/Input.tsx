import React, { Component } from 'react';
import './Input.scss';
import { ChatController } from '../ChatController';
import ChatCursor from './ChatCursor';
import { ChatStore } from '../ChatStore';
import { observer } from 'mobx-react';

interface IInputProps {
    controller: ChatController;
    store: ChatStore
}

@observer
class Input extends Component<IInputProps> {
    private textRef: any;
    constructor(props: IInputProps) {
        super(props);

        this.textRef = React.createRef();
    }

    componentDidMount() {
        this.props.controller.setTextRef(this.textRef.current);
        
    }

    render() {
        return (
            <div className="Input">
                <div 
                    className="Input-input" 
                    tabIndex={1}
                    >
                    
                    <div className="text" ref={this.textRef}>{this.props.store.currentText}</div>
                    <ChatCursor store={this.props.store} />
                </div>
                <div className="Input-button">⏎</div>
            </div>
        );
    }
}

export default Input;