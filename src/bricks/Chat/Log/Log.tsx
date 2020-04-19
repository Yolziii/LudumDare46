import React, { Component } from 'react';
import './Log.scss';
import { ChatStore, ChatUser, ChatMessage } from '../ChatStore';
import { observer } from 'mobx-react';
import Message from '../Message/Message';
import { ChatController } from '../ChatController';

interface ILogProps {
    store: ChatStore,
    controller: ChatController
}

@observer
class Log extends Component<ILogProps> {
    private logRef: any;
    private lastMessage: ChatMessage | null = null;

    constructor(props: ILogProps) {
        super(props);

        this.logRef = React.createRef();
    }

    componentDidMount() {
        this.props.controller.setLogRef(this.logRef.current)
    }

    render() {
        this.lastMessage = null;
        return (
            <div className="Log" ref={this.logRef}>
                {this.props.store.messages.map((message, index) => {
                    const showOwner = this.lastMessage ? this.lastMessage.ower !== message.ower : true;
                    this.lastMessage = message;
                    return (
                        <Message 
                            showOwner={showOwner}
                            player={this.props.store.player} 
                            key={index} 
                            message={message} />
                    );
                })}
            </div>
        );
    }
}

export default Log;