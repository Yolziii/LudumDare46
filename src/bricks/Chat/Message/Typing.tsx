import React, { Component } from 'react';
import './Typing.scss';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

class TypingStore {
    @observable num = 0;
    @observable points = [0, 0, 0];

    constructor() {
        this.showTyping = this.showTyping.bind(this);
    }

    showTyping() {
        for (let i = 0; i<this.points.length; i++) this.points[i] = 0;
        this.points[this.num] = 1;
        this.num++;
        if (this.num >= this.points.length) this.num = 0;
    }
}

interface ITypingProps {
    className: string
}

@observer
class Typing extends Component<ITypingProps> {

    private typingTimer: number = -1;
    private store: TypingStore;
   
    constructor(props: ITypingProps) {
        super(props);

        this.store = new TypingStore();
    }

    componentDidMount() {
        this.typingTimer = window.setInterval(this.store.showTyping, 300);
    }

    componentWillUnmount() {
        if (this.typingTimer !== -1) clearInterval(this.typingTimer)
    }

    render() {
        return (
            <span className={"Typing " + this.props.className}>
                {this.store.points.map((point, index) => {
                    return (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <img 
                            key={index}
                            src={process.env.PUBLIC_URL + '/img/point.png'} 
                            className={point === 1 ? 'Typing-top' : 'Typing-bottom'} />
                    )
                })}
                
            </span>
        );
    }
}

export default Typing;