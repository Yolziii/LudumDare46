import React, { Component, MouseEvent } from 'react';
import './LoginBtn.scss'
import { FileSystem } from '../../Terminal/FileSystem';
import { BotMind } from '../../../bot/BotMind';
import { TerminalStore, SimpleString, CommandString } from '../../Terminal/TernimalStore';
import data from '../../../data/terminal.json';

interface ILoginBtnProps {
    botMind: BotMind;
    store: TerminalStore;
}

class LoginBtn extends Component<ILoginBtnProps> {
    onClick = (e: React.MouseEvent) => {
        FileSystem.currentUser = 'guest';
        this.props.store.addString(new SimpleString(data.welcome.replace('#user', FileSystem.currentUser)))
        this.props.store.addString(new CommandString());
        
        this.props.botMind.decideWhatToDo();

        
    }
    render() {
        return (
            <div className="LoginBtn">
                 <div className="LoginBtn-button" onClick={this.onClick}>
                    Login as guest
                 </div>
            </div>
        );
    }
}

export default LoginBtn;