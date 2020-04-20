import { Task } from "../BotMind";
import { EndGameGoal } from "./EndGameGoal";
import { IPlayerAction } from "../../player/PlayerMind";
import { BotGoal } from "./BotGoal";

enum State {
    Hello,
    ChatTutorial,
    Waiting,
    EndChatTutorial,
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
                this.state = State.Waiting;
                this.itFinished = true;
                return this.fillTasks('chatTutorial-end');

            default:
            case State.Waiting:
                this.state = State.ChatTutorial;
                return this.waitingTasks(5000);
        }
}

    get nextGoal(): BotGoal {return new EndGameGoal()};

    public onPlayerAction(action: IPlayerAction): void {
        if (this.isChatMessageAction(action)) {
            this.state = State.EndChatTutorial;
            this.wasPlayerMessage = true;
        }
    }
}