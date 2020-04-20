import { TerminalController } from "../TerminalController";
import { AudioManager } from "../../../utils/AudioManager";
import { FileSystem } from "../FileSystem";
import {ICommand} from "../Commander";

type ContentType = {content: string[]};

export class CommandCat implements ICommand {
    file: ContentType | null = null;
    index = -1;
    params: string = '';

    public constructor(public controller: TerminalController ) {
        this.logFile = this.logFile.bind(this);
    }

    public run(cmd: string) {
        this.index = -1;
        const file = cmd.substring(4).trim();
        this.params = FileSystem.fullPath( file );

        if (!FileSystem.allowAccess(this.params, true)) {
            this.controller.showString(`Access denided!`);
            this.controller.backControl();
            return;
        }

        try {
            this.file = require(`../../../data/fs${this.params}`);
            this.logFile();
        } catch (e) {
            this.controller.showString(`cat: wrong parameter: ${file}`);
            this.controller.backControl();
            return;
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

}