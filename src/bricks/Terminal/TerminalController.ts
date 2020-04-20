import { TerminalStore, CommandString, ITerminalString, SimpleString } from "./TernimalStore";
import { KeyboardEvent } from "react";
import { Commander } from "./Commander";
import { KeyCode } from "../../utils/KeyCode";
import { BotMind } from "../../bot/BotMind";
import { PlayerTerminalCommandAction } from "../../player/PlayerMind";

export class TerminalController {
    private botMind: BotMind | null = null;
    private commander: Commander;

    constructor(private store: TerminalStore) {
        this.commander = new Commander(store, this);

        this.onKey = this.onKey.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.onFocusIn = this.onFocusIn.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);
        this.blinkCursor();
    }

    public initBotMind(botMind: BotMind) {
        this.botMind = botMind;
    }

    public onFocusIn() {
        this.store.focused = true;
    }

    public onFocusOut() {
        this.store.focused = false;
    }

    public onPaste(event: any) {
        const store = this.store;
        event.clipboardData.items[0].getAsString((text: string) => store.addText(text));
    }

    public onKey(event: KeyboardEvent<HTMLElement>): void {
        if (this.store.locked) return;
        //console.log(`Press key: ${event.key}[${event.keyCode.toString()}]`);
        const str: CommandString = this.store.current as CommandString;
        if (!str) return;
        switch (event.keyCode) {
            case KeyCode.Up: 
                const prevCmd = this.commander.previousCommand();
                if (prevCmd) this.store.replaceString(new CommandString(prevCmd));
                break;

            case KeyCode.Down: 
                const nextCmd = this.commander.nextCommand();
                if (nextCmd) this.store.replaceString(new CommandString(nextCmd));
                break;

            case KeyCode.BackSpace: 
                str.removeChar();
                break;

            case KeyCode.Enter: 
                this.commander.run(str.content);
                this.botMind?.playerAction(
                    new PlayerTerminalCommandAction(str.content)
                );
                break;

            default:
                if (event.key.length !== 1) break;
                if (event.ctrlKey) break;
                if (['<', '>', '\\', '&', '#'].includes(event.key)) return;

                str.addChar(event.key);
                break;
        }
    }

    public runCommand(cmd: string) {
        if (this.isCommand(this.store.current)) {
            this.store.current.setText(cmd);
        } else {
            this.store.addString(new CommandString(cmd));
        }
        this.commander.run(cmd);
    }

    public showString(str: string, className: string= '') {
        this.store.addString(new SimpleString(str, className));
    }

    isCommand = (sentense: ITerminalString): sentense is CommandString =>
        (sentense as CommandString).addChar !== undefined;


    public backControl() {
        this.store.addString(new CommandString());
        this.store.locked = false;
    }

    private blinkCursor(): void {
        setTimeout(() => {
            // TODO: Move this logic to store
            this.store.cursorVisible = !this.store.cursorVisible;
            if (!this.store.focused) this.store.cursorVisible = false;
            if (this.store.locked) this.store.cursorVisible = false;
            this.blinkCursor();
        }, 500);
    }
}