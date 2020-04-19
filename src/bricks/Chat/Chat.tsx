import React, { Component } from 'react';
import './Chat.scss';
import Log from './Log/Log';
import Input from './Input/Input';
import { ChatStore } from './ChatStore';
import { observer } from 'mobx-react';
import { ChatController } from './ChatController';
import { BotMind } from '../../bot/BotMind';
import { BotModel } from '../../bot/BotModel';

interface IChatProps {
    store: ChatStore;
    controller: ChatController;

    botModel: BotModel;
    botMind: BotMind;
}

@observer
class Chat extends Component<IChatProps> {
    render() {
        return (
            <div 
                className="Chat" 
                onFocus={this.props.controller.onFocusIn} 
                onBlur={this.props.controller.onFocusOut}
            >
                <Log store={this.props.store} controller={this.props.controller} />
                <Input store={this.props.store} controller={this.props.controller} />
            </div>
        );
    }
}

export default Chat;