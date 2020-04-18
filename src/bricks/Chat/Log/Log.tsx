import React, { Component } from 'react';
import './Log.scss';
import { ChatUser, ChatMessage } from '../ChatStore';

interface ILogProps {
    owner: ChatUser,
    messages: ChatMessage[]
}

class Log extends Component {
    render() {
        return (
            <div className="Log">
                {

                }
            </div>
        );
    }
}

export default Log;