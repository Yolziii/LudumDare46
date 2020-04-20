import fs from "../../data/fs.json";
import { observable } from "mobx";

// TODO: Autobuild files structure
var root = ((fs as any) as IFsItem);
root.root = true;
root.path = '';

function proceedFile(dir: IFsItem, key: string, parent: IFsItem | undefined) {
    dir.parent = parent;
    dir.path = (parent ? parent.path : '') + (key === '' ? '' : '/' + key);
    if (!dir.files) return;
    for (let [key, file] of Object.entries(dir.files as FilesType)) {
        proceedFile(file, key, dir);
    }
}

proceedFile(root, '', undefined);

export type FilesType = {[key: string]: IFsItem};

export interface IFsItem {
    user: string,
    files?: FilesType;
    root?: boolean,
    parent?: IFsItem;
    path: string;
}

class FileSystemImpl {
    currentDir: IFsItem = {user: '', path: ''};
    @observable currentUser: string = '';

    constructor() {
        const dir = (fs as any).files['usr'].files['guest'] as IFsItem;
        this.currentDir = dir;
    }

    fullPath(filePath: string) {
        const path = filePath.split('/');
        if (path[0] === '') return filePath;
        return this.currentDir.path + '/' + path[path.length-1];
    }

    findDir(filePath: string, isFile: boolean): IFsItem | null {
        const path = filePath.split('/');

        let dir: IFsItem = path[0] === '' ? ((fs as any) as IFsItem) : this.currentDir;
        for (let file of path) {
            if ( file === '') {
                dir = (fs as any);
            } else if (file === '.') {
                dir = this.currentDir;
            } else if (file === '..') {
                if (dir.root) {
                    //console.log('[false]: dir.root')
                    return null;
                }
                dir = dir.parent as IFsItem;
            } else {
                if (!dir.files || !dir.files[file]) {
                    //console.log(`[false]: not found: ${filePath} dir: ${dir.path}, file: ${file}`);
                    if (isFile) return null;
                }
                else {
                    if (dir.files[file].path === filePath && 
                        dir.files[file].user !== this.currentUser && 
                        this.currentUser !== 'root') {
                        //console.log(`[false]: wrong user: ${this.currentUser} != ${dir.files[file].user}`);
                        // TODO: 
                        return null;
                    }
                    if (!isFile && !dir.files[file].files) continue;
                    dir = dir.files[file];
                }
            }
        }
        return dir;
    }

    moveTo(filePath: string): string | [string] {
        const dir = this.findDir(filePath, false);
        if (dir) {
            if (this.currentDir === dir) return ['unknown directory'];
            if (dir.user !== this.currentUser && this.currentUser !== 'root') return ['access denided'];
            this.currentDir = dir;
            return this.currentDir.path ? this.currentDir.path : '/';
        }
        return ['unknown directory'];
    }

    allowAccess(filePath: string, isFile: boolean): boolean {
        const dir = this.findDir(filePath, isFile);
        return dir !== null;
    }
}

export const FileSystem = new FileSystemImpl();