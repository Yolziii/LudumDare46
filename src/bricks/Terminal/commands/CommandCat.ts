import { TerminalController } from "../TerminalController";
import { AudioManager } from "../../../utils/AudioManager";
import { FileSystem } from "../FileSystem";
import { Command } from "./Command";

type ContentType = {content: string[]};

export class CommandCat extends Command {
    file: ContentType | null = null;
    index = -1;
    params: string = '';

    public constructor(public controller: TerminalController ) {
        super(controller);
        this.logFile = this.logFile.bind(this);
    }

    public run(cmd: string) {
        this.index = -1;
        const file = cmd.substring(4).trim();
        this.params = FileSystem.fullPath( file );

        if (!FileSystem.allowAccess(this.params, true)) {
            return this.error('cat: unknown error');
        }

        try {
            AudioManager.play(AudioManager.ok);
            this.file = require(`../../../data/fs${this.params}`);
            this.logFile();
        } catch (e) {
            return this.error(`cat: wrong parameter: ${file}`);
        }
    }

    logFile() {
        setTimeout(() => {
            if (this.params === '/usr/qubick/win') {
                AudioManager.play(AudioManager.guideWin);
            }
            
            this.index++;
            if (this.index >= (this.file as ContentType).content.length) {
                this.controller.backControl();
                return;
            }

            const str =  (this.file as ContentType).content[this.index];
            this.controller.showString(str);
            this.logFile();
        }, 100);
    }

    usage(): string {
        return 'cat [FILE]         - show file content';
    }
}