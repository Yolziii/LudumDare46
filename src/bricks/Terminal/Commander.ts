import commandList from './commands.json';
import { TerminalStore, SimpleString, CommandString } from './TernimalStore';

interface ICommandDescription {
    description: string;
}

interface ICommandList {
    [key: string]: ICommandDescription;
}

export class Commander {

    public constructor(private store: TerminalStore) {
        
    }

    commands: string[] = [];
    commandIndex = -1;
    
    run(cmd: string) {
        const commands = commandList as ICommandList;
        if (cmd.trim() === '') {
            this.store.addString(new CommandString(this.store.user));
            return;
        }

        if (this.commands[this.commandIndex-1] !== cmd) {
            this.commands.push(cmd);
            this.commandIndex = this.commands.length;
        }

        if (!commands[cmd]) {          
            this.store.addString(new SimpleString("ERROR! Unknown command!", 'commandError'));
            this.store.addString(new CommandString(this.store.user));
            return 
        }
        // TODO: An access
        // TODO: Run commands
    }

    nextCommand(): string {
        this.commandIndex++;
        if (this.commandIndex >= this.commands.length) {
            this.commandIndex = this.commands.length - 1;
            return '';
        }
        return this.commands[this.commandIndex];
    }

    previousCommand(): string {
        this.commandIndex--;
        if (this.commandIndex <= 0) {
            this.commandIndex = 0;
        }
        if (this.commands.length > 0) return this.commands[this.commandIndex];
        return '';
    }
}