import React, { Component, MouseEvent } from 'react';
import './LoginBtn.scss'
import { FileSystem } from '../../Terminal/FileSystem';

class LoginBtn extends Component {
    onClick = (e: React.MouseEvent) => {
        FileSystem.currentUser = 'guest';
    }
    render() {
        return (
            <div className="LoginBtn">
                 <div className="LoginBtn-button" onClick={this.onClick}>
                    Login as guest
                 </div>
            </div>
        );
    }
}

export default LoginBtn;