import { FileSystem } from "../FileSystem";
import { Command } from "./Command";
import { AudioManager } from "../../../utils/AudioManager";

export class CommandCd extends Command {
    public run(cmd: string): boolean {
        let file = cmd.substring(3).trim();
        if (file.substring(file.length-1) === '/') {
            file = file.substring(0, file.length-1);
        }
        //let filePath = FileSystem.fullPath( file );
        //filePath = filePath.substring(0, filePath.length-1);

        //console.log(`filePath: ${filePath}`);

        const result = FileSystem.moveTo(file);
        if (typeof result === 'string') {
            AudioManager.play(AudioManager.ok);
            this.controller.showString(`Current directory: ${FileSystem.currentDir.path ? FileSystem.currentDir.path : '/'}`);
        } else {
            return this.error(`cd: ${result[0]}`);
        }

        this.controller.backControl();
        return true;
    }

    usage(): string {
        return 'cd [DIRECTORY]     - move to directory';
    }
}