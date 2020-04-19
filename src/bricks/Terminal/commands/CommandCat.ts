import { TerminalController } from "../TerminalController";
import { EILSEQ } from "constants";
import { AudioManager } from "../../../utils/AudioManager";

type ContentType = {content: string[]};

export class CommandCat {
    file: ContentType | null = null;
    index = -1;

    constructor(private controller: TerminalController, private cmd: string) {
        this.cmd = cmd.trim();

        this.logFile = this.logFile.bind(this);
    }

    

    run() {
        const params = this.cmd.substring(3).trim();
        try {
            this.file = require(`../../../data/${params}`) as ContentType;
            this.logFile();
        } catch {
            this.controller.showString(`Wrong cat parameter: ${params}`);
        }
    }

    logFile() {
        setTimeout(() => {
            AudioManager.play(AudioManager.guideWin);
            this.index++;
            if (this.index >= (this.file as ContentType).content.length) return;

            const str =  (this.file as ContentType).content[this.index];
            this.controller.showString(str);
            this.logFile();
        }, 100);
    }

}