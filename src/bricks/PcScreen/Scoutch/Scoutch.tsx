/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import "./Scoutch.scss";
import { TerminalStore } from '../../Terminal/TernimalStore';
import { observer } from 'mobx-react';

interface IScoutchProps {
    store: TerminalStore
}

@observer
class Scoutch extends Component<IScoutchProps> {
    className = "";

    onDoubleClick = (e: React.MouseEvent) => {
        this.props.store.active = true;
    }

    onClick = (e: React.MouseEvent) => {
        this.className="Scoutch-selected";
        this.forceUpdate();
    }

    render() {
        if (!this.props.store.available) return null;
        return (
            <div 
                className={"Scoutch " + this.className} 
                onDoubleClick={this.onDoubleClick} 
                onClick={this.onClick}
            >
                 <img 
                    className="Scoutch-icon"
                    src={process.env.PUBLIC_URL + '/img/terminal.png'}  />
                 <div className="Scoutch-text">
                    Start&nbsp;terminal
                 </div>
            </div>
        );
    }
}

export default Scoutch;