//import commandList from './commands.json';

import { TerminalStore } from '../TernimalStore';

export enum TerminalCommands {
    Ls = 'ls',
    Help = 'help'
}

export abstract class Command {
    public constructor(protected store: TerminalStore) {}
    abstract run(cmd: string): void;
}

export class CommandHelp {
    run(cmd: string): void { 
        /*for (let cmd of commandList) {

        }*/
    }
}