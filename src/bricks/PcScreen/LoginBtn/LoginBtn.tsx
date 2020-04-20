/* eslint-disable jsx-a11y/alt-text */
import React, { Component, MouseEvent } from 'react';
import './LoginBtn.scss'
import { FileSystem } from '../../Terminal/FileSystem';
import { BotMind } from '../../../bot/BotMind';
import { TerminalStore, SimpleString, CommandString } from '../../Terminal/TernimalStore';
import { AudioManager } from '../../../utils/AudioManager';

interface ILoginBtnProps {
    botMind: BotMind;
    store: TerminalStore;
}

class LoginBtn extends Component<ILoginBtnProps> {
    onClick = (e: React.MouseEvent) => {
        AudioManager.play(AudioManager.ok);
        FileSystem.currentUser = 'guest';
        this.props.store.addString(new CommandString());
        
        this.props.botMind.decideWhatToDo();

        
    }
    render() {
        return (
            
            <div className="LoginBtn">
                 <img 
                    className="LoginBtn-logo"
                    src={process.env.PUBLIC_URL + '/img/logo-big.png'}  />
                 <div className="LoginBtn-button" onClick={this.onClick}>
                    Start game
                 </div>
            </div>
        );
    }
}

export default LoginBtn;