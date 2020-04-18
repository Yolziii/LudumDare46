import { TerminalStore, CommandString } from "./TernimalStore";
import { KeyboardEvent } from "react";
import { Commander } from "./Commander";

enum KeyCode {
    BackSpace = 8,
    Enter = 13,
    Up = 38,
    Down = 40,
}

export class TerminalController {
    private commander: Commander;

    constructor(private store: TerminalStore) {
        this.commander = new Commander(store);

        this.onKey = this.onKey.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.blinkCursor();
    }

    public onPaste(event: any) {
        const store = this.store;
        event.clipboardData.items[0].getAsString((text: string) => store.addText(text));
    }

    public onKey(event: KeyboardEvent<HTMLElement>): void {
        console.log(`Press key: ${event.key}[${event.keyCode.toString()}]`);
        const str: CommandString = this.store.current as CommandString;
        if (!str) return;
        switch (event.keyCode) {
            case KeyCode.Up: 
                const prevCmd = this.commander.previousCommand();
                if (prevCmd) this.store.replaceString(new CommandString(this.store.user, prevCmd));
                break;

            case KeyCode.Down: 
                const nextCmd = this.commander.nextCommand();
                if (nextCmd) this.store.replaceString(new CommandString(this.store.user, nextCmd));
                break;

            case KeyCode.BackSpace: 
                str.removeChar();
                break;

            case KeyCode.Enter: 
                this.commander.run(str.content);
                break;

            default:
                if (event.key.length !== 1) break;
                if (event.ctrlKey) break;
                if (['<', '>', '\\', '&', '#'].includes(event.key)) return;

                str.addChar(event.key);
                break;
        }
    }

    private blinkCursor(): void {
        setTimeout(() => {
            this.store.cursorVisible = !this.store.cursorVisible;
            this.blinkCursor();
        }, 500);
    }
}