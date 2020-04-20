
import { Command } from "./Command";
import { FileSystem } from "../FileSystem";
import { AppStore } from "../../PcScreen/AppStore";
import { EndGameGoal } from "../../../bot/goals/EndGameGoal";

export class CommandUnlock extends Command {
    
    public run(cmd: string): boolean {

        if (FileSystem.currentUser === 'guest') {
            return this.error('access demied!', true);
        }

        this.controller.showString('All doors was unlocked');
        AppStore.botMind.setGoal(new EndGameGoal('win'));

        this.controller.backControl();
        return true;
    
    }

    usage(): string {
        return 'unlock             - emergency unlocks all doors';
    }
}