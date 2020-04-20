import { Task } from "../BotMind";
import { BotGoal } from "./BotGoal";
import { IPlayerAction } from "../../player/PlayerMind";
import { EndGameGoal } from "./EndGameGoal";

enum State {
    Intro,
    TypeHelp,
    FileList,
    MoveToReports,
    FindDate,
    LoginAsLab20,
    EndTerminalTutorial,
    Waiting
}

export class TerminalTutorialGoal extends BotGoal {
    abort: boolean = false;
    itFinished: boolean = false;
    
    wasHelp = false;
    wasLs = false;
    wasCat = false;
    wasCd = false;
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

            case State.FileList:
                this.state = State.Waiting;
                return this.fillTasks('terminalTutorial-lsCmd');

            case State.MoveToReports:
                this.state = State.Waiting;
                return this.fillTasks('terminalTutorial-cdCmd');

            case State.FindDate:
                this.state = State.Waiting;
                return this.fillTasks('terminalTutorial-catCmd');

            case State.LoginAsLab20:
                this.state = State.Waiting;
                return this.fillTasks('terminalTutorial-loginCmd');

            case State.EndTerminalTutorial:
                this.itFinished = true; 
                return this.fillTasks('terminalTutorial-end');

            default:
            case State.Waiting:
                this.state = this.nextState();
                return this.waitingTasks(5000);
        }
    }

    get nextGoal(): BotGoal {return new EndGameGoal()};
 
    private nextState(): State {
        if (this.wasLogin) return State.EndTerminalTutorial;
        if (this.wasCat) return State.LoginAsLab20;
        if (this.wasCd) return State.FindDate;
        if (this.wasLs) return State.MoveToReports;
        if (this.wasHelp) return State.FileList;
        return State.TypeHelp;
    }

    public onPlayerAction(action: IPlayerAction): void {
        // TODO: Not here, in terminal, it's black!
        if (!this.isTerminalCommandAction(action)) return;
        
        if (action.name === 'help' && action.success) {
            if (this.state === State.TypeHelp) this.state = State.FileList;
            this.wasHelp = true;

        }
        if (action.name === 'ls' && action.success) {
            if (this.state === State.FileList) this.state = State.MoveToReports;
            this.wasLs = true;
        }
        if (action.name === 'cd' && action.success) {
            if (this.state === State.MoveToReports) this.state = State.FindDate;
            this.wasCd = true;
        }
        if (action.name === 'cat' && action.success) {
            if (this.state === State.FindDate) this.state = State.LoginAsLab20;
            this.wasCat = true;
        }
        
        if (action.name === 'login' && action.success) {
            if (this.state === State.LoginAsLab20) this.state = State.EndTerminalTutorial;
            // TODO: Wrong login
            this.wasLogin = true;
        }
    }
}