import { TerminalStore, SimpleString, CommandString } from './TernimalStore';
import { AudioManager } from '../../utils/AudioManager';
import { CommandCat } from './commands/CommandCat';
import { TerminalController } from './TerminalController';
import { CommandLs } from './commands/CommandLs';
import { CommandCd } from './commands/CommandCd';
import { CommandHelp } from './commands/CommandHelp';
import { CommandLogin } from './commands/CommandLogin';
import { Command } from './commands/Command';
import { CommandUsers } from './commands/CommandUsers';
import { CommandPoison } from './commands/CommandPoison';
import { CommandUnlock } from './commands/CommandUnlock';
import { AppStore } from '../PcScreen/AppStore';

export interface ICmdist {
    [key: string]: Command;
}

class CommandsImpl {
    private cmds: ICmdist | null = null;

    get commands(): ICmdist {return this.cmds as ICmdist}

    initCommands(controller: TerminalController) {
        // TODO: Lock command (to stop antoganist)
        this.cmds = {
            'cat' : new CommandCat(controller),
            'help' : new CommandHelp(controller),
            'ls' : new CommandLs(controller),
            'cd' : new CommandCd(controller),
            'login' : new CommandLogin(controller),
            'poison' : new CommandPoison(controller),
            'unlock' : new CommandUnlock(controller),
            'users' : new CommandUsers(controller),
        };
    }
}

export const Commands = new CommandsImpl();

export class Commander {
    commands: string[] = [];
    commandIndex = -1;

    public constructor(private store: TerminalStore, private controller: TerminalController) {
        Commands.initCommands(controller);
    }
    
    run(cmd: string): boolean {
        cmd = cmd.trim();
        if (cmd === '') {
            this.store.addString(new CommandString());
            return false;
        }

        if (this.commands[this.commandIndex-1] !== cmd) {
            this.commands.push(cmd);
            this.commandIndex = this.commands.length;
    
        }

        for (let [key, command] of Object.entries(Commands.commands)) {
            if (cmd.substr(0, key.length) === key) {
                this.store.locked = true;
                return command.run(cmd);
            }
        }
      
        AudioManager.play(AudioManager.errorAudio);
        this.store.addString(new SimpleString("unknown command", 'commandError'));
        this.store.addString(new CommandString());

        return false;
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