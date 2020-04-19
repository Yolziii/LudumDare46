import React, { Component } from 'react';
import './ChatCursor.scss';
import { ChatStore } from '../ChatStore';
import { observer } from 'mobx-react';

interface IChatCursorProps {
    store: ChatStore
}

@observer
class ChatCursor extends Component<IChatCursorProps> {
    render() {
        const store = this.props.store;
        return (
        
            <div className="ChatCursor">
                {store.cursorVisible &&
                    <div className="Cursor-line">|</div>
                }
            </div>
        );
    }
}

export default ChatCursor;