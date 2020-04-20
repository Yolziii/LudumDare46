import { Task, BotAction, BotActionType, BotMind } from "../BotMind";
import { ScriptLine } from "../SayingBuider";
import { IPlayerAction, PlayerChatMessageAction, PlayerTerminalCommandAction } from "../../player/PlayerMind";

type ChooseIndexes = {
    [key: string]: number
}

class ScriptIndexesImpl {
    private indexes: ChooseIndexes = {};

    public getIndex(id: string): number {
        if (this.indexes[id] === undefined) {
            this.indexes[id] = 0;
        } else {
            this.indexes[id]++;
        }

        return this.indexes[id];
    }
}

export const ScriptIndexes = new ScriptIndexesImpl();

export abstract class BotGoal {
    botMind: BotMind | null = null;

    initBotMind(botMind: BotMind) {
        this.botMind = botMind;
    }

    itFinished = false;

    abstract onPlayerAction(action: IPlayerAction): void;
    abstract get tasks(): Task[];
    abstract get nextGoal(): BotGoal | null;

    fillTasks(id: string): Task[] {
       
        const line = new ScriptLine(id);
        const tasks: Task[] = [];
        while(!line.done) {
            const sentense = line.next();
            tasks.push({
                action: new BotAction(sentense.actionType, sentense),
                duration: sentense.duration
            })
        }

        return tasks;
    }

    waitingTasks(duration = 1000): Task[] {
        return [
            {action: new BotAction(BotActionType.WaitForPlayer), duration: duration}
        ];
    }

    isChatMessageAction = (playerAction: IPlayerAction): playerAction is PlayerChatMessageAction =>
        (playerAction as PlayerChatMessageAction).chatMessage !== undefined;

    isTerminalCommandAction = (playerAction: IPlayerAction): playerAction is PlayerTerminalCommandAction =>
        (playerAction as PlayerTerminalCommandAction).command !== undefined;
}