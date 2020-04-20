import React, { Component } from 'react';
import './Window.scss';

interface IWindowProps {
    title: string;
    className: string;
    childRef: any;
}

export interface IWindowed {
    setWindow(window: Window): void;
}

export class Window extends Component<IWindowProps> {
    focusedClass: string = '';

    componentDidMount() {
        (this.props.childRef.current as IWindowed).setWindow(this);
        // TODO: Generic
        /*React.Children.forEach(this.props.children, child => {
            const windowed = child as IWindowed;
            if (windowed && windowed['setWindow']) windowed.setWindow(this);
        })*/
    }

    setFocusedClass(focusedClass: string) {
        this.focusedClass = focusedClass;
        this.forceUpdate();
    }

    render() {
        // TODO: Window Drag'n'drop
        return (
            <div className={`Window ${this.props.className} ${this.focusedClass}`}>
                <div className="Window-title" >
                    <span>&nbsp;{this.props.title}</span>
                </div>
                {this.props.children}
            </div>
        );
    }
}

export default Window;