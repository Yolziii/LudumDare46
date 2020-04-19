import { IBotGoal, Task } from "../BotMind";
import { WinGoal } from "./WinGoal";
import { IPlayerAction } from "../../player/PlayerMind";


export class IntroGoal implements IBotGoal {
    abort: boolean = false;
    itFinished: boolean = false;
    
    get tasks(): Task[] {
        return [
            
        ]; // TODO:
    }

    nextGoal: IBotGoal = new WinGoal();

    public onPlayerAction(action: IPlayerAction): void {

    }

}