import { SayingBuilder, SentenseType, Sentense } from "./SayingBuider";

export enum BotMood {
    Happy,
    Neutral,
    Worry,
    Angry,
}

export class BotModel {
    //public goal: IBotGoal;
    //goalCheckpoints;
    public mood: BotMood = BotMood.Neutral;

    public buider: SayingBuilder = new SayingBuilder();

    constructor() {

    }

    saySomething(toSay: Sentense) {
        return this.buider.build(toSay, this.mood);
    }
}