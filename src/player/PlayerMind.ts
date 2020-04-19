export enum PlayerActionType {
    ChatMessage,
    TerminalCommand
}

export interface IPlayerAction {
    type: PlayerActionType;
    text: string;
}

export class PlayerMind {

}