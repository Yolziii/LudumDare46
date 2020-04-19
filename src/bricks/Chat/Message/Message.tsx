import React, { Component } from 'react';
import './Message.scss';
import { ChatMessage, ChatUser } from '../ChatStore';
import Typing from './Typing';

interface IMessageProps {
    message: ChatMessage;
    player: ChatUser,
    showOwner: boolean
}

class Message extends Component<IMessageProps> {
    render() {
        return (
            <div className="Message">
                {this.props.message.ower === this.props.player &&
                    <div className="Message-bodyPlayer">
                        <div className="Message-player">{this.props.message.text}</div>
                    </div>
                }
                {this.props.message.ower !== this.props.player &&
                    
                    <div className="Message-bodyUser">
                        {this.props.showOwner && 
                            <div className="Message-icon">{this.props.message.ower.firstLetter}</div>
                        }
                          {!this.props.showOwner && 
                            <div className="Message-noIcon"></div>
                        }
                        
                        {this.props.message.typing &&
                            <Typing className="Message-typing" />
                        }
                        {!this.props.message.typing &&
                            <div className={'Message-user'}>{this.props.message.text}</div>
                        }
                        
                    </div>
                }
            </div>
        );
    }
}

export default Message;