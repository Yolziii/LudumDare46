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

    public run(cmd: string): boolean {
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

        return true;
    }

    logFile() {
        setTimeout(() => {
            if (this.params === '/usr/qubick/win') {
                AudioManager.play(AudioManager.guideWin);
            }
            
            if (!(this.file as ContentType).content) {
                return this.error(`cat: wrong file name`);
            }
            this.index++;
            if (this.index >= (this.file as ContentType).content.length) {
                this.controller.backControl();
                return;
            }

            let str =  (this.file as ContentType).content[this.index];
            for (var pattern of ["#1d", "#2d", "#3d", "#4d"]) {
                if (str.indexOf(pattern) === -1) continue;
                str = str.replace(pattern, this.gatDate(+pattern.substr(1,1)));
            }

            this.controller.showString(str);
            this.logFile();
        }, 100);
    }

    gatDate(daysBehind: number): string {
        var day = new Date()
        day.setDate( day.getDate() - daysBehind);
        return `${this.getNumber(day.getDate())}/${this.getNumber(day.getMonth())}/${day.getFullYear()}`;
    }

    getNumber = (number: number): string => number > 10 ? number.toString() : '0' + number;

    usage(): string {
        return 'cat FILE_NAME      - show file content';
    }
}