import { observable } from "mobx"

export class ChatUser {
    get firstLetter() {return this.name.substring(0, 1)}

    constructor(public name: string) {}
}

export class ChatMessage {
    constructor(public ower: ChatUser, public text: string) {}
}

export class ChatStore {
    @observable messages: ChatMessage[] = [];

    public constructor(public player: ChatUser) {

    }
}