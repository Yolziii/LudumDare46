
import { Command } from "./Command";
import { FileSystem } from "../FileSystem";
import { AppStore } from "../../PcScreen/AppStore";
import { EndGameGoal } from "../../../bot/goals/EndGameGoal";

export class CommandPoison extends Command {
    
    public run(cmd: string): boolean {

        if (FileSystem.currentUser !== 'root') {
            return this.error("access denied!", true);
        }
        
        this.controller.showString('Poison procedure was started');
        AppStore.botMind.setGoal(new EndGameGoal('lose'));

        this.controller.backControl();
        return true;
    
    }

    usage(): string {
        return 'poison             - emergency kill all experimental objects';
    }
}