import { ChatStore } from "./ChatStore";
import { KeyCode } from "../../utils/KeyCode";
import { KeyboardEvent } from "react";

export class ChatController {
    private textRef: HTMLDivElement | null = null;
    private logRef: HTMLDivElement | null = null;

    constructor(private store: ChatStore) {
        this.onFocusIn = this.onFocusIn.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);
        this.blinkCursor = this.blinkCursor.bind(this);   
        this.onPaste = this.onPaste.bind(this);
        this.onKey = this.onKey.bind(this);
        this.botTyping = this.botTyping.bind(this);
        this.checkLogOffset = this.checkLogOffset.bind(this);

        this.blinkCursor();

        store.initController(this);
    }

    botTyping(isTypeing: boolean) {
        this.store.botTyping = isTypeing;
    }

    botSay(text: string) {
        this.store.addMessage(this.store.guide, text);
        this.checkLogOffset();
    }

    blinkCursor() {
        setTimeout(() => {
            this.store.cursorVisible = !this.store.cursorVisible;
            if (!this.store.focused) this.store.cursorVisible = false;

            this.blinkCursor();
        }, 500);
    }

    public onPaste(event: any) {
        const store = this.store;
        event.clipboardData.items[0].getAsString((text: string) => store.addText(text));
    }

    public onKey(event: KeyboardEvent<HTMLElement>): void {
        //console.log(`Press key: ${event.key}[${event.keyCode.toString()}]`);
        switch (event.keyCode) {
            case KeyCode.Up: 
                break;

            case KeyCode.Down: 
                break;

            case KeyCode.BackSpace: 
                this.store.removeChar();
                break;

            case KeyCode.Enter: 
                if (this.store.currentText.trim() === '') break;
                this.store.addMessage(this.store.player, this.store.currentText);
                this.store.currentText = '';
                this.checkLogOffset();
                break;

            default:
                if (event.key.length !== 1) break;
                if (event.ctrlKey) break;
                if (['<', '>', '\\', '&', '#'].includes(event.key)) return;

                this.store.addChar(event.key);
                break;
        }

        if (this.textRef === null) return;
        this.textRef.scrollLeft = this.textRef.scrollWidth - this.textRef.clientWidth;
        //console.log(`${this.textRef.scrollLeft}`);
    }

    public onFocusIn() {
        //console.log('ChatController.onFocusIn()');
        this.store.focused = true;
    }

    public onFocusOut() {
        //console.log('ChatController.onFocusOut()');
        this.store.focused = false;
    }

    public checkLogOffset() {
        if (this.logRef === null) return;
        this.logRef.scrollTop = this.logRef.scrollHeight - this.logRef.clientHeight;
        //console.log(`${this.logRef.scrollLeft}`);
    }

    public setTextRef(textRef: HTMLDivElement) {
        this.textRef = textRef;
    }

    public setLogRef(logRef: HTMLDivElement) {
        this.logRef = logRef;
    }
}