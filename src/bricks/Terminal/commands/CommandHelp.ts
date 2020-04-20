import { TerminalController } from "../TerminalController";
import { ICommand } from "../Commander";

export class CommandHelp implements ICommand {
    public constructor(public controller: TerminalController)  {
    }

    public run(cmd: string) {
        this.controller.showString(`    cat [FILE]         - show file content`);
        this.controller.showString(`    cd [DIRECTORY]     - move to directory`);
        this.controller.showString(`    ls                 - list of files in current directory`);
        this.controller.showString(`    login [USER] [PWD] - log in by another user`);

        // TODO: Commands for current user

        this.controller.backControl();
    }
}