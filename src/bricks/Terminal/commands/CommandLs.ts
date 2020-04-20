import { FileSystem, FilesType, IFsItem } from "../FileSystem";
import { Command } from "./Command";
import { AudioManager } from "../../../utils/AudioManager";

export class CommandLs extends Command {
    
    public run(cmd: string): boolean {

        const files = this.getDirFiles(FileSystem.currentDir);
        if (!files) {
            return this.error(`ls: no files in directory ${FileSystem.currentDir.path}`);
        }

        AudioManager.play(AudioManager.ok);
        this.controller.showString(`Files (${files.length}) in directory ${FileSystem.currentDir.path}:`);
        for (let [key, file] of Object.entries(FileSystem.currentDir.files as FilesType)) {
            const isDir = this.getDirFiles(file) !== null;
            this.controller.showString(`    ${key + (isDir ? '/' : '')}`);
        }

        this.controller.backControl();
        return true;
    
    }

    private getDirFiles(directory: IFsItem): IFsItem[] | null {
        if (!directory.files) return null;
        return Object.values(directory.files) 
    }

    usage(): string {
        return 'ls                 - list of files in current directory';
    }
}