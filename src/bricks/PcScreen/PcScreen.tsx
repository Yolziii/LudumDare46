/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import './PcScreen.scss';
import Terminal from '../Terminal/Terminal';
import Window from './Window/Window';
import Chat from '../Chat/Chat';
import { AppStore } from './AppStore';
import { FileSystem } from '../Terminal/FileSystem';
import LoginBtn from './LoginBtn/LoginBtn';
import { observer } from 'mobx-react';
import Scoutch from './Scoutch/Scoutch';

@observer
class PcScreen extends Component {
    terminalRef: any;
    chatRef: any;

    constructor(props: {}) {
        super(props);

        this.terminalRef = React.createRef();
        this.chatRef = React.createRef();
    }

    render() {
        if (FileSystem.currentUser === '') {
            return (
                <div className="PcScreen">
                    <LoginBtn 
                        store={AppStore.terminalStore}
                        botMind={AppStore.botMind} />
                </div>
            )
        }

        return (
            <div className="PcScreen">
                <img 
                    className="PcScreen-logo"
                    src={process.env.PUBLIC_URL + '/img/logo.png'}  />

                <Scoutch store={AppStore.terminalStore} />

                {AppStore.terminalStore.active && 
                    <Window 
                        className="PcScreen-terminalPosition" 
                        title="Terminal"
                        childRef={this.terminalRef}
                    >
                        <Terminal 
                            ref={this.terminalRef}
                            store={AppStore.terminalStore} 
                            controller={AppStore.terminalController} />
                    </Window>
                }

                {AppStore.chatStore.active && 
                    <Window 
                        className="PcScreen-chatPosition" 
                        title="Chat with @qubick"
                        childRef={this.chatRef}
                    >
                        <Chat
                            ref={this.chatRef }
                            store={AppStore.chatStore} 
                            controller={AppStore.chatController} 
                            botModel={AppStore.botModel}
                            botMind={AppStore.botMind} />
                    </Window>
                }
                
            </div>
        );
    }
}

export default PcScreen;