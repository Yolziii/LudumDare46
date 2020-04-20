import { Command } from "./Command";
import { AudioManager } from "../../../utils/AudioManager";
import { ICmdist, Commands } from "../Commander";
import { FileSystem } from "../FileSystem";

export class CommandHelp extends Command {
    public run(cmd: string): boolean {
        AudioManager.play(AudioManager.ok);
        for (let [key, cmd] of Object.entries(Commands.commands as ICmdist)) {
            if (key === 'poison' && FileSystem.currentUser !== 'root') continue;
            if (key === 'unlock' && FileSystem.currentUser === 'guest') continue;
            this.controller.showString(`    ${cmd.usage()}`);        
        };
        

        // TODO: Commands for current user

        this.controller.backControl();
        return true;
    }

    usage(): string {
        return "help               - show allowed commands";
    }
}