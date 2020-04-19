import React, { Component } from 'react';
import './Chat.scss';
import Log from './Log/Log';
import Input from './Input/Input';
import { ChatStore } from './ChatStore';
import { observer } from 'mobx-react';
import { ChatController } from './ChatController';
import { BotMind } from '../../bot/BotMind';
import { BotModel } from '../../bot/BotModel';
import { IntroGoal } from '../../bot/goals/IntroGoal';
import { WinGoal } from '../../bot/goals/WinGoal';

@observer
class Chat extends Component {
    private store: ChatStore;
    private controller: ChatController;

    private botModel: BotModel;
    private botMind: BotMind;

    constructor(props: {}) {
        super(props);

        this.store = new ChatStore();
        this.controller = new ChatController(this.store);

        this.botModel = new BotModel();
        this.botMind = new BotMind(this.botModel, this.controller, new WinGoal());
    }

    render() {
        return (
            <div className="Chat" onFocus={this.controller.onFocusIn} onBlur={this.controller.onFocusOut}>
                <Log store={this.store} controller={this.controller} />
                <Input store={this.store} controller={this.controller} />
            </div>
        );
    }
}

export default Chat;