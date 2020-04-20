import { Command } from "./Command";
import { AudioManager } from "../../../utils/AudioManager";
import { ICmdist, Commands } from "../Commander";

export class CommandHelp extends Command {
    public run(cmd: string): boolean {
        AudioManager.play(AudioManager.ok);
        for (let [, cmd] of Object.entries(Commands.commands as ICmdist)) {
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