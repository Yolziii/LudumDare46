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

    get text(): string {return this.command}

    constructor(public command: string) {
    }
}


export class PlayerMind {

}