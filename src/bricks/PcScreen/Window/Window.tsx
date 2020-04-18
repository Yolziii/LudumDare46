import React, { Component } from 'react';
import './Window.scss';

interface IWindowProps {
    title: string;
    className: string;
}

class Window extends Component<IWindowProps> {
    render() {
        return (
            <div className={`Window ${this.props.className}`}>
                <div className="Window-title">
                    <span>&nbsp;{this.props.title}</span>
                </div>
                {this.props.children}
            </div>
        );
    }
}

export default Window;