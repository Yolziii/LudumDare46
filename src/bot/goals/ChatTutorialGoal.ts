import { Task } from "../BotMind";
import { IPlayerAction } from "../../player/PlayerMind";
import { BotGoal } from "./BotGoal";
import { TerminalTutorialGoal } from "./TerminalTutorialGoal";
import { AppStore } from "../../bricks/PcScreen/AppStore";

enum State {
    Hello,
    ChatTutorial,
    Waiting,
    EndChatTutorial,
    StartingTerminal,
}


export class ChatTutorialGoal extends BotGoal {
    abort: boolean = false;
    itFinished: boolean = false;
    

    wasPlayerMessage = false;
    state = State.Hello;

    get tasks(): Task[] {
        switch (this.state) {
            case State.Hello:
                this.state = State.ChatTutorial;
                return this.fillTasks('chatTutorial-intro');
        
            case State.ChatTutorial:
                this.state = this.wasPlayerMessage ? State.EndChatTutorial : State.Waiting;
                return this.fillTasks('chatTutorial-tutorial');

            case State.EndChatTutorial:
                this.state = State.StartingTerminal;
                return this.fillTasks('chatTutorial-end');

            case State.StartingTerminal:
                this.state = State.Waiting;
                if (AppStore.terminalStore.active) {
                    this.itFinished = true;
                }
                return this.fillTasks('chatTutorial-startTerminal');

            default:
            case State.Waiting:
                if (this.wasPlayerMessage) {
                    if (AppStore.terminalStore.active) {
                        this.itFinished = true;
                    }
                    this.state = State.StartingTerminal;
                } else {
                    this.state = State.ChatTutorial;
                }
                return this.waitingTasks(5000);
        }
}

    get nextGoal(): BotGoal {return new TerminalTutorialGoal()};

    public onPlayerAction(action: IPlayerAction): void {
        if (this.isChatMessageAction(action)) {
            if (!this.wasPlayerMessage) {
                this.state = State.EndChatTutorial;
                this.wasPlayerMessage = true;
            }
        }
    }
}