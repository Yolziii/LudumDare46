import { AudioManager } from "../../../utils/AudioManager";
import { Command } from "./Command";

type ContentType = {content: string[]};

export class CommandUsers extends Command {
    file: ContentType | null = null;
    index = -1;
    params: string = '';

    public run(cmd: string): boolean {
       AudioManager.play(AudioManager.ok);
        this.file = require(`../../../data/fs/etc/passwd.json`);
        this.controller.showString(`Registered user:`);
        for (let line of (this.file as ContentType).content) {
            const [user,] = line.split(' ');
            
            this.controller.showString(`    ${user}`);
        }    
        
        this.controller.backControl();
        return true;   
    }

    usage(): string {
        return 'users              - list of registered users';
    }
}