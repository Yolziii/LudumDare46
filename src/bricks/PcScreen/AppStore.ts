import { TerminalStore } from "../Terminal/TernimalStore";
import { TerminalController } from "../Terminal/TerminalController";
import { ChatStore } from "../Chat/ChatStore";
import { ChatController } from "../Chat/ChatController";
import { BotModel } from "../../bot/BotModel";
import { BotMind } from "../../bot/BotMind";
import { WinGoal } from "../../bot/goals/WinGoal";
import { IntroGoal } from "../../bot/goals/IntroGoal";

class AppStoreImpl {
    public terminalStore: TerminalStore;
    public terminalController: TerminalController;

    public chatStore: ChatStore;
    public chatController: ChatController;
    
    public botModel: BotModel;
    public botMind: BotMind;

    constructor() {
        this.terminalStore = new TerminalStore();
        this.terminalController = new TerminalController(this.terminalStore);

        this.chatStore = new ChatStore();
        this.chatController = new ChatController(this.chatStore);

        this.botModel = new BotModel();
        this.botMind = new BotMind(
            this.botModel, 
            this.chatController, 
            this.terminalController, 
            new IntroGoal());
    }
}

export const AppStore = new AppStoreImpl();