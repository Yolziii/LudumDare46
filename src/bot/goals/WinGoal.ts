import { IBotGoal, Task } from "../BotMind";
import { IPlayerAction } from "../../player/PlayerMind";
import { BotGoal } from "./BotGoal";

export class WinGoal extends BotGoal implements IBotGoal {
    abort: boolean = false;
    itFinished: boolean = false;

    private totalRequests = 0;

    get tasks(): Task[] {
        this.totalRequests++;
        if (this.totalRequests === 1) {
            return this.fillTasks('win');
        }
        return this.waitingTasks();
    }
    nextGoal: IBotGoal | null = null;

    public onPlayerAction(action: IPlayerAction): void {
    }
}