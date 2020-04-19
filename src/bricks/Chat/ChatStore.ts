import { observable, computed, autorun } from "mobx"
import { AudioManager } from "../../utils/AudioManager";
import { ChatController } from "./ChatController";

const MAX_LENGTH = 30;

export class ChatUser {
    get firstLetter() {return this.name.substring(0, 1)}

    constructor(public name: string) {}
}

export class ChatMessage {
    constructor(public ower: ChatUser, public text: string, public typing: boolean) {
    }
}

export class ChatStore {
    player = new ChatUser('guest');
    guide = new ChatUser('qubick');

    private controller: ChatController | null = null;

    @observable messages: ChatMessage[] = [];
    @observable cursorVisible = false;

    @observable botTyping = false;
    @observable focused = false;
    @computed get cursorX() {return this.currentText.length + 1}

    @observable currentText = '';

    private typingMessage:  ChatMessage;

    constructor() {
        this.typingMessage =  new ChatMessage(this.guide, '', true);
        autorun(() => this.checkBotTypeing());
    }

    initController(controller: ChatController) {
        this.controller = controller;
    }

    checkBotTypeing() {
        if (this.botTyping) {
            if (!this.messages.includes(this.typingMessage)) this.messages.push(this.typingMessage);
        } else {
            this.removeMessage(this.typingMessage);
        }

        if (this.controller) this.controller.checkLogOffset();
    }

    public addMessage(user: ChatUser, text: string, typing: boolean=false) {
        if (user === this.player) AudioManager.play(AudioManager.playerMessage);
        else AudioManager.play(AudioManager.guideMessage);
        const message = new ChatMessage(user, text, typing);
        this.messages.push(message);
        this.checkBotTypeing();
    }

    public removeMessage(msg: ChatMessage) {
        const index = this.messages.indexOf(msg);
        if (index !== -1) {
            this.messages.splice(index, 1);
        }
    }

    public addChar(char: string) {
        if (this.currentText.length >= MAX_LENGTH) return;
        this.currentText += char;
    }

    public removeChar() {
        if (this.currentText.length === 0) return;
        this.currentText = this.currentText.substring(0, this.currentText.length-1);
    }

    public addText(text: string) {
        for (let char of text) this.addChar(char);
    }
}