import { Commands } from "../bricks/Terminal/Commander";

export enum PlayerActionType {
    ChatMessage,
    TerminalCommand
}

export interface IPlayerAction {
    type: PlayerActionType;
    text: string;
}

export class PlayerChatMessageAction implements IPlayerAction {
    type = PlayerActionType.ChatMessage;

    get text(): string {return this.chatMessage}

    constructor(public chatMessage: string) {
    }
}

export class PlayerTerminalCommandAction implements IPlayerAction {
    type = PlayerActionType.TerminalCommand;
    name: string = '';

    get text(): string {return this.command}

    constructor(public command: string, public success: boolean) {
        for (let [key,] of Object.entries(Commands.commands)) {
            if (command.substring(0, key.length) === key) {
                this.name = key;
            }
        }
    }
}


export class PlayerMind {

}