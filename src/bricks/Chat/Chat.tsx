import React, { Component } from 'react';
import './Chat.scss';
import Log from './Log/Log';
import Input from './Input/Input';
import { ChatStore } from './ChatStore';
import { observer } from 'mobx-react';
import { ChatController } from './ChatController';
import { BotMind } from '../../bot/BotMind';
import { BotModel } from '../../bot/BotModel';
import { IWindowed, Window } from '../PcScreen/Window/Window';
import { autorun } from 'mobx';

interface IChatProps {
    store: ChatStore;
    controller: ChatController;

    botModel: BotModel;
    botMind: BotMind;
}

@observer
class Chat extends Component<IChatProps> implements IWindowed {
    private window: Window | null = null;

    public constructor(props: IChatProps) {
        super(props);
        autorun(() => {
            const className = this.props.store.focused ? 'Window-focused' : '';
            this.window?.setFocusedClass(className);
        });
    }

    public setWindow(window: Window): void {
        this.window = window;
    }

    render() {
        return (
            <div 
                tabIndex={3}
                className="Chat" 
                onFocus={this.props.controller.onFocusIn} 
                onBlur={this.props.controller.onFocusOut}
                onKeyDown={this.props.controller.onKey}
                onPaste={this.props.controller.onPaste}
            >
                <Log store={this.props.store} controller={this.props.controller} />
                <Input store={this.props.store} controller={this.props.controller} />
            </div>
        );
    }
}

export default Chat;