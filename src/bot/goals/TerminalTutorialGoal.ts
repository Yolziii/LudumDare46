import { Task } from "../BotMind";
import { BotGoal } from "./BotGoal";
import { IPlayerAction } from "../../player/PlayerMind";
import { EndGameGoal } from "./EndGameGoal";
import { AppStore } from "../../bricks/PcScreen/AppStore";

enum State {
    Intro,
    TypeHelp,
    Waiting
}

export class TerminalTutorialGoal extends BotGoal {
    abort: boolean = false;
    itFinished: boolean = false;
    
    wasHelp = false;
    wasLogin = false;

    state = State.Intro;

    get tasks(): Task[] {
        switch (this.state) {
            case State.Intro:
                this.state = State.TypeHelp;
                return this.fillTasks('terminalTutorial-intro');
        
            case State.TypeHelp:
                this.state = State.Waiting;
                return this.fillTasks('terminalTutorial-helpCmd');

            default:
            case State.Waiting:
                this.state = this.nextState();
                return this.waitingTasks(5000);
        }
    }

    get nextGoal(): BotGoal | null {return null};
 
    private nextState(): State {
        if (!AppStore.chatStore.active) return State.Waiting;
        return State.TypeHelp;
    }

    public onPlayerAction(action: IPlayerAction): void {
        // TODO: Not here, in terminal, it's black!
        if (!this.isTerminalCommandAction(action)) return;
        
        if (action.name === 'help' && action.success) {
            if (this.state === State.TypeHelp) this.state = State.Waiting;
            this.wasHelp = true;

        }
    }
}