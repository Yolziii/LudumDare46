import { BotModel } from "./BotModel";
import { ChatController } from "../bricks/Chat/ChatController";
import { IPlayerAction } from "../player/PlayerMind";
import { Sentense } from "./SayingBuider";
import { TerminalController } from "../bricks/Terminal/TerminalController";
import { BotGoal } from "./goals/BotGoal";
import { AppStore } from "../bricks/PcScreen/AppStore";
import { AudioManager } from "../utils/AudioManager";
import { throws } from "assert";

export enum BotActionType {
    Typing, 
    WaitForPlayer,
    SaySomething,
    TerminalCommand,
    StopThinking,
    TerminalVisibility,
    ChatVisibility,
}

export class BotAction {
    constructor(public type: BotActionType, public sentense?: Sentense) {}
}

export type Task = {
    action: BotAction,
    duration: number
}

export class BotMind {
    taskIndex = -1;
    tasks: Task[] = [];

    constructor(
        private model: BotModel, 
        private chat: ChatController, 
        private terminal: TerminalController, 
        private goal: BotGoal) 
    {
        this.think = this.think.bind(this);
        this.typeText = this.typeText.bind(this);
        this.waitForPlayer = this.waitForPlayer.bind(this);
        this.decideWhatToDo = this.decideWhatToDo.bind(this);

        chat.initBotMind(this);
        terminal.initBotMind(this);

        goal.initBotMind(this);
    }

    setGoal(goal: BotGoal) {
        if (AppStore.gameOver) return;
        AppStore.gameOver = true;
        this.goal = goal;
        goal.initBotMind(this);
        this.taskIndex = -1;
        this.think();
    }

    playerAction(action: IPlayerAction) {
        this.goal.onPlayerAction(action);
    }

    think() {
        this.chat.botTyping(false);
        this.taskIndex++;
        if (this.taskIndex >= this.tasks.length) {
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
            case BotActionType.TerminalCommand: 
                this.typeCommand((task.action.sentense as Sentense).one);
                break;
            case BotActionType.TerminalVisibility: 
                this.setTerminalVisibility((task.action.sentense as Sentense).one === "1");
                break;
            case BotActionType.ChatVisibility: 
                this.setChatVisibility((task.action.sentense as Sentense).one === "1");
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

    typeCommand(cmd: string) {
        this.terminal.runCommand(cmd);
        this.think();
    }

    decideWhatToDo() {
        if (this.goal.itFinished && this.goal.nextGoal !== null) {
            this.goal = this.goal.nextGoal;
            this.goal.initBotMind(this);
        }
        this.tasks = this.goal.tasks;
        this.taskIndex = -1;
        this.think();
    }

    setTerminalVisibility(visibility: boolean) {
        AppStore.terminalStore.available = visibility; // TODO: injections
        this.think();
    }

    setChatVisibility(visibility: boolean) {
        AudioManager.play(AudioManager.chatOn);
        AppStore.chatStore.active = visibility;
        this.think();
    }
}