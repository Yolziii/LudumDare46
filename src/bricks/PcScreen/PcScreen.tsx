import React, { Component } from 'react';
import './PcScreen.scss';
import Terminal from '../Terminal/Terminal';
import Window from './Window/Window';

class PcScreen extends Component {
    render() {
        return (
            <div className="PcScreen">
                <Window className="PcScreen-terminalPosition" title="Terminal">
                    <Terminal />
                </Window>
            </div>
        );
    }
}

export default PcScreen;