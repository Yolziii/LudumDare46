import React, { Component } from 'react';
import './Cursor.scss';
import {observer} from 'mobx-react';
import { TerminalStore } from '../TernimalStore';

const C_WIDTH = 7.8;
const C_HEIGHT = 15;

interface ICursorProps {
    store: TerminalStore;
}

@observer
class Cursor extends Component<ICursorProps> {
    render() {
        const store = this.props.store;
        return (
            <div 
                className="Cursor"            >
                {store.cursorVisible &&
                    <div 
                        className="Cursor-line"
                        style={{
                            left: `${C_WIDTH + store.cursorX * C_WIDTH}px`,
                            top: `${store.cursorY * C_HEIGHT}px`,
                        }} 
                    >|</div>
                }
            </div>
        );
    }
}

export default Cursor;