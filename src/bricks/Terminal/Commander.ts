import commandList from './commands.json';
import { TerminalStore, SimpleString, CommandString } from './TernimalStore';
import { AudioManager } from '../../utils/AudioManager';
import { CommandCat } from './commands/CommandCat';
import { TerminalController } from './TerminalController';
import { CommandLs } from './commands/CommandLs';
import { CommandCd } from './commands/CommandCd';
import { CommandHelp } from './commands/CommandHelp';
import { CommandLogin } from './commands/CommandLogin';

interface ICommandDescription {
    description: string;
}

interface ICommandList {
    [key: string]: ICommandDescription;
}

export interface ICommand {
    run(cmd: string): void;
}

export class Commander {
    cmds: {[key: string]: ICommand}

    commands: string[] = [];
    commandIndex = -1;

    public constructor(private store: TerminalStore, private controller: TerminalController) {
        this.cmds = {
            'cat' : new CommandCat(controller),
            'help' : new CommandHelp(controller),
            'ls' : new CommandLs(controller),
            'cd' : new CommandCd(controller),
            'login' : new CommandLogin(controller),
        }
    }
    
    run(cmd: string) {
        const commands = commandList as ICommandList;
        cmd = cmd.trim();
        if (cmd === '') {
            this.store.addString(new CommandString());
            return;
        }

        if (this.commands[this.commandIndex-1] !== cmd) {
            this.commands.push(cmd);
            this.commandIndex = this.commands.length;
        }

        for (let [key, command] of Object.entries(this.cmds)) {
            if (cmd.substr(0, key.length) === key) {
                this.store.locked = true;
                command.run(cmd);
                return;
            }
        }

        if (!commands[cmd]) {          
            AudioManager.play(AudioManager.errorAudio);
            this.store.addString(new SimpleString("ERROR! Unknown command!", 'commandError'));
            this.store.addString(new CommandString());
            return 
        }
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