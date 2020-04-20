import { Task } from "../BotMind";
import { IPlayerAction } from "../../player/PlayerMind";
import { BotGoal } from "./BotGoal";

export class EndGameGoal extends BotGoal {
    abort: boolean = false;
    itFinished: boolean = false;

    private totalRequests = 0;

    constructor(private scenario: string) {
        super();
    }

    get tasks(): Task[] {
        this.totalRequests++;
        if (this.totalRequests === 1) {
            return this.fillTasks(this.scenario);
        }
        return this.waitingTasks();
    }
    get nextGoal(): BotGoal | null {return null}

    public onPlayerAction(action: IPlayerAction): void {
    }
}