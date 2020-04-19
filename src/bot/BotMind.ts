import { BotModel } from "./BotModel";
import { ChatController } from "../bricks/Chat/ChatController";
import { IPlayerAction } from "../player/PlayerMind";
import { Sentense } from "./SayingBuider";

export enum BotActionType {
    Typing, 
    WaitForPlayer,
    SaySomething,
    StopThinking
}

export class BotAction {
    constructor(public type: BotActionType, public sentense?: Sentense) {}
}

export type Task = {
    action: BotAction,
    duration: number
}

export interface IBotGoal {
    abort: boolean;
    itFinished: boolean;
    tasks: Task[];
    nextGoal: IBotGoal | null;

    onPlayerAction(action: IPlayerAction): void;
}

export class BotMind {
    taskIndex = -1;
    tasks: Task[] = [];

    constructor(private model: BotModel, private chat: ChatController, private goal: IBotGoal) {
        this.think = this.think.bind(this);
        this.typeText = this.typeText.bind(this);
        this.waitForPlayer = this.waitForPlayer.bind(this);
        this.decideWhatToDo = this.decideWhatToDo.bind(this);

        this.decideWhatToDo();
    }

    think() {
        this.chat.botTyping(false);
        this.taskIndex++;
        if (this.taskIndex >= this.tasks.length) {
            this.decideWhatToDo();
            return;
        }

        if (this.goal.abort) {
            this.decideWhatToDo();
            return;
        }

        const task = this.tasks[this.taskIndex];
        switch(task.action.type) {
            case BotActionType.Typing: 
                this.typeText(task.duration);
                break;
            case BotActionType.StopThinking:
                this.decideWhatToDo();
                break;
            case BotActionType.WaitForPlayer:
                this.waitForPlayer(task.duration);
                break;
            case BotActionType.SaySomething:
                this.saySomething(task.action.sentense as Sentense);
                break;
        }
    } 

    typeText(durationMs: number) {
        this.chat.botTyping(true);
        setTimeout(() => {
            this.think();
        }, durationMs);
    }

    waitForPlayer(durationMs: number = 5000) {
        setTimeout(() => {
            this.think();
        }, durationMs);
    }

    saySomething(toSay: Sentense) {
        this.chat.botTyping(true);
        setTimeout(() => {
            this.chat.botTyping(false);
            const message = this.model.saySomething(toSay);
            this.chat.botSay(message);
            this.think();
        }, toSay.duration);
    }

    decideWhatToDo() {
        if (this.goal.itFinished && this.goal.nextGoal !== null) {
            this.goal = this.goal.nextGoal;
        }
        this.tasks = this.goal.tasks;
        this.taskIndex = -1;
        this.think();
    }
}