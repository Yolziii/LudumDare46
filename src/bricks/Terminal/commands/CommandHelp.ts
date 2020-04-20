import { Command } from "./Command";
import { AudioManager } from "../../../utils/AudioManager";
import { ICmdist } from "../Commander";

export class CommandHelp extends Command {
    usage(): string {
        return "help               - show allowed commands";
    }

    commands: ICmdist | null = null;

    public run(cmd: string) {
        AudioManager.play(AudioManager.ok);
        for (let [, cmd] of Object.entries(this.commands as ICmdist)) {
            this.controller.showString(`    ${cmd.usage()}`);        
        };
        

        // TODO: Commands for current user

        this.controller.backControl();
    }

    public initCommands(commands: ICmdist) {
        this.commands = commands;
    }
}