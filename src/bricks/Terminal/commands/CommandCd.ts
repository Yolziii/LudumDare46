import { TerminalController } from "../TerminalController";
import { FileSystem } from "../FileSystem";
import { ICommand } from "../Commander";

export class CommandCd implements ICommand {
    public constructor(public controller: TerminalController) {
    }

    public run(cmd: string) {
        let file = cmd.substring(3).trim();
        if (file.substring(file.length-1) === '/') {
            file = file.substring(0, file.length-1);
        }
        //let filePath = FileSystem.fullPath( file );
        //filePath = filePath.substring(0, filePath.length-1);

        console.log(`file: ${file}`);
        //console.log(`filePath: ${filePath}`);



        if (FileSystem.moveTo(file)) {
            this.controller.showString(`Current directory: ${FileSystem.currentDir.path ? FileSystem.currentDir.path : '/'}`);
        } else {
            this.controller.showString(`cd: wrong parameter ${cmd.substring(3).trim()}`);
        }

        this.controller.backControl();
    }
}