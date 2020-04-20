import { IBotGoal, Task } from "../BotMind";
import { WinGoal } from "./WinGoal";
import { IPlayerAction } from "../../player/PlayerMind";
import { BotGoal } from "./BotGoal";

enum IntroState {
    Hello,
    ChatTutorial,
    Waiting,
    EndChatTutorial,
}

export class IntroGoal extends BotGoal implements IBotGoal {
    abort: boolean = false;
    itFinished: boolean = false;
    
    wasPlayerMessage = false;
    state = IntroState.Hello;

    get tasks(): Task[] {
        switch (this.state) {
            case IntroState.Hello:
                this.state = IntroState.ChatTutorial;
                return this.fillTasks('intro');
        
            case IntroState.ChatTutorial:
                this.state = this.wasPlayerMessage ? IntroState.EndChatTutorial : IntroState.Waiting;
                return this.fillTasks('chatTutorial');

            default:
            case IntroState.Waiting:
                this.state = IntroState.ChatTutorial;
                return this.waitingTasks(5000);

            case IntroState.EndChatTutorial:
                this.state = IntroState.Waiting;
                this.itFinished = true;
                return this.fillTasks('endChatTutorial');
        }
}

    nextGoal: IBotGoal = new WinGoal();

    public onPlayerAction(action: IPlayerAction): void {
        if (this.isChatMessageAction(action)) {
            this.state = IntroState.EndChatTutorial;
            this.wasPlayerMessage = true;
        }
    }
}