import React, { Component } from 'react';
import './PcScreen.scss';
import Terminal from '../Terminal/Terminal';
import Window from './Window/Window';
import Chat from '../Chat/Chat';

class PcScreen extends Component {
    render() {
        return (
            <div className="PcScreen">
                <Window className="PcScreen-terminalPosition" title="Terminal">
                    <Terminal />
                </Window>

                <Window className="PcScreen-chatPosition" title="Chat with @qubick">
                    <Chat />
                </Window>
            </div>
        );
    }
}

export default PcScreen;