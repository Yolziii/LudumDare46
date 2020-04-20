import { FileSystem } from "../FileSystem";
import { Command } from "./Command";
import { AudioManager } from "../../../utils/AudioManager";

type ContentType = {content: string[]};

export class CommandLogin extends Command {

    public run(cmd: string): boolean {
        let [, newUser, newPwd] = cmd.split(' ');

        if (!newUser) {
            return this.error(`login: wrong params`);
        }

        if (newUser === FileSystem.currentUser) {
            return this.error(`login: user ${newUser} already loged in!`);
        }

        const users: ContentType = require(`../../../data/fs/etc/passwd`);
        let findUser = false;
        let rightPwd = false;
        for (let line of users.content) {
            const [user, pwd] = line.split(' ');
            if (user === newUser) {
                findUser = true;
                // eslint-disable-next-line eqeqeq
                if ((newPwd as any).hashCode() == pwd) {
                    rightPwd = true;
                }
            }
        }

        if (!findUser) {
            return this.error(`login: unknown user ${newUser}`);
        } else {
            if (!rightPwd) {
                return this.error(`login: wrong password`);
            }
            else {
                AudioManager.play(AudioManager.ok);
                FileSystem.currentUser = newUser;
                this.controller.runCommand(`cd /usr/${newUser}/`);
            }
        }

        this.controller.backControl();
        return true;
    }

    usage(): string {
        return 'login [USER] [PWD] - log in by another user';
    }
}