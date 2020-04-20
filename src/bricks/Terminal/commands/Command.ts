import { TerminalController } from "../TerminalController";
import { AudioManager } from "../../../utils/AudioManager";

export abstract class Command {
    public constructor(public controller: TerminalController ) {
    }
    
    error(message: string, silent: boolean=false): boolean {
        AudioManager.play(AudioManager.errorAudio);
        this.controller.showString(message, 'commandError');
        if (!silent) {
            this.controller.showString('USAGE:');
            this.controller.showString('    ' + this.usage());
        }
        this.controller.backControl();

        return false;
    }

    abstract usage(): string;

    abstract run(cmd: string): boolean;
}