import { TerminalController } from "../TerminalController";
import { FileSystem, FilesType, IFsItem } from "../FileSystem";
import { ICommand } from "../Commander";

export class CommandLs implements ICommand {
    public constructor(public controller: TerminalController ) {
    }

    public run(cmd: string) {

        const files = this.getDirFiles(FileSystem.currentDir);
        if (!files) {
            this.controller.showString(`No files in directory ${FileSystem.currentDir.path}!`);
            this.controller.backControl();
            return;
        }

        this.controller.showString(`Files (${files.length}) in directory ${FileSystem.currentDir.path}:`);
        for (let [key, file] of Object.entries(FileSystem.currentDir.files as FilesType)) {
            const isDir = this.getDirFiles(file) !== null;
            this.controller.showString(`    ${key + (isDir ? '/' : '')}`);
        }

        this.controller.backControl();
    
    }

    private getDirFiles(directory: IFsItem): IFsItem[] | null {
        if (!directory.files) return null;
        return Object.values(directory.files) 
    }
}