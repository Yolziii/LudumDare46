import React, { Component } from 'react';
import './PcScreen.scss';
import Terminal from '../Terminal/Terminal';
import Window from './Window/Window';
import Chat from '../Chat/Chat';
import { TerminalStore } from '../Terminal/TernimalStore';
import { User } from '../Terminal/User';
import { TerminalController } from '../Terminal/TerminalController';
import { ChatStore } from '../Chat/ChatStore';
import { ChatController } from '../Chat/ChatController';
import { BotModel } from '../../bot/BotModel';
import { BotMind } from '../../bot/BotMind';
import { WinGoal } from '../../bot/goals/WinGoal';

class PcScreen extends Component {
    private terminalStore: TerminalStore;
    private terminalController: TerminalController;

    private chatStore: ChatStore;
    private chatController: ChatController;
    
    private botModel: BotModel;
    private botMind: BotMind;

    constructor(props: {}) {
        super(props);

        this.terminalStore = new TerminalStore(new User('guest'));
        this.terminalController = new TerminalController(this.terminalStore);

        this.chatStore = new ChatStore();
        this.chatController = new ChatController(this.chatStore);

        this.botModel = new BotModel();
        this.botMind = new BotMind(this.botModel, this.chatController, this.terminalController, new WinGoal());
    }

    render() {
        return (
            <div className="PcScreen">
                <Window className="PcScreen-terminalPosition" title="Terminal">
                    <Terminal 
                        store={this.terminalStore} 
                        controller={this.terminalController} />
                </Window>

                <Window className="PcScreen-chatPosition" title="Chat with @qubick">
                    <Chat
                        store={this.chatStore} 
                        controller={this.chatController} 
                        botModel={this.botModel}
                        botMind={this.botMind} />
                </Window>
            </div>
        );
    }
}

export default PcScreen;