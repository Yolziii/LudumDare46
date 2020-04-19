import { IBotGoal, Task, BotActionType, BotAction } from "../BotMind";
import { IPlayerAction } from "../../player/PlayerMind";
import { ScriptLine } from "../SayingBuider";

export class WinGoal implements IBotGoal {
    abort: boolean = false;
    itFinished: boolean = false;

    private totalRequests = 0;

    get tasks(): Task[] {
        this.totalRequests++;
        if (this.totalRequests === 1) {
            const line = new ScriptLine('win');
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
        return [
            {action: new BotAction(BotActionType.WaitForPlayer), duration: 2000}
        ]
    }
    nextGoal: IBotGoal | null = null;

    public onPlayerAction(action: IPlayerAction): void {

    }
}