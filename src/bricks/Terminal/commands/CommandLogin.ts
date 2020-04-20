import { TerminalController } from "../TerminalController";
import { ICommand } from "../Commander";
import { FileSystem } from "../FileSystem";

type ContentType = {content: string[]};

export class CommandLogin implements ICommand {
    public constructor(public controller: TerminalController) {
    }

    public run(cmd: string) {
        let [, newUser, newPwd] = cmd.split(' ');

        if (!newUser) {
            this.controller.showString(`login: wrong params`);
            this.controller.backControl();
            return;
        }

        if (newUser === FileSystem.currentUser) {
            this.controller.showString(`User ${newUser} already loged in!`);
            this.controller.backControl();
            return;
        }

        const users: ContentType = require(`../../../data/fs/etc/passwd`);
        let findUser = false;
        let rightPwd = false;
        for (let line of users.content) {
            const [user, pwd] = line.split(' ');
            if (user === newUser) {
                findUser = true;
                if (`[${newPwd}]` === pwd) {
                    rightPwd = true;
                }
            }
        }

        if (!findUser) {
            this.controller.showString(`Unknown user ${newUser} `);
        } else {
            if (!rightPwd) {
                this.controller.showString(`Wrong password!`);
            }
            else {
                FileSystem.currentUser = newUser;
                this.controller.runCommand(`cd /usr/${newUser}`);
            }
        }

        this.controller.backControl();
    }
}