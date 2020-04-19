import {observable, computed} from 'mobx';
import { User } from './User';
import { stripHtml } from '../../utils/utils';
import data from '../../data/terminal.json';

export const TERMINAL_WIDTH = 80;
export const TERMINAL_HEIGHT = 25;

export interface ITerminalString {
    hasCursor: boolean
    cursorX: number;
    value: string;    
}

export class SimpleString implements ITerminalString {
    hasCursor = false;
    cursorX = 0;

    public constructor(public value: string, className: string='') {
        if (className === '') className = 'commandResult';
        this.value = `<span class="${className}">${value}</span>`;
    }
}

export class CommandString implements ITerminalString {
    hasCursor = true;
    @computed get cursorX() { return this.length - 1};

    @observable public content: string;
    @observable private welcome: string;

    @computed get value() {
        return this.welcome + this.content;
    }

    @computed get length() { return stripHtml(this.value).length }

    public constructor(private user: User, content: string = '') {
        this.welcome = `<span class="notSelectable"><span class="userName">@${user.name}</span>: ></span>`;
        this.content = content;
    }

    public addChar(char: string) {
        if (this.length >= TERMINAL_WIDTH) return;
        this.content += char;
    }

    public addText(text: string) {
        for (let c of text) this.addChar(c);
    }

    public removeChar() {
        const length = this.content.length;
        if (length === 0) return;
        this.content = this.content.substring(0, length - 1);
    }
    
    public setText(text: string) {
        this.content = text;
    }
}

export class TerminalStore {
    public constructor(public user: User) {
        this.addString(new SimpleString(data.welcome.replace('#user', user.name)))
        this.addString(new CommandString(user));
    }

    @observable offset = 0;
    @observable cursorVisible = true;
    @observable strings:  ITerminalString[] = []; 

    @computed get content(): string {
        let result = '';

        for (let i = this.offset; i < this.offset + TERMINAL_HEIGHT; i++) {
            if (this.strings.length <= i) break;
            const str = this.strings[i];
            result += str.value + '<span class="notSelectable">\n</span>';
        }

        return result;
    }

    @computed get cursorX() { return this.strings[this.currentIndex].cursorX }
    @computed get cursorY() { return this.currentIndex - this.offset}
    @computed get current() { return this.strings[this.currentIndex] }

    @observable currentIndex = 0;
    @observable focused = false;

    public addString(string: ITerminalString) {
        this.strings.push(string);
        this.currentIndex = this.strings.length - 1;
        this.offset = (this.currentIndex > TERMINAL_HEIGHT) ? this.currentIndex - TERMINAL_HEIGHT + 1: 0;
    }
   
    public replaceString(string: ITerminalString) {
        this.strings[this.currentIndex] = string;
    }

    public addText(text: string) {
        if ((this.current as CommandString).addText) (this.current as CommandString).addText(text);
    }
}