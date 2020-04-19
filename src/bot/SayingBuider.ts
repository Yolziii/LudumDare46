import { BotMood } from "./BotModel";
import partsData from '../data/botSayingParts.json';
import scriptData from '../data/botScript.json';
import { BotActionType } from "./BotMind";

export enum SayPart {
    None = 'none',
    Hello = 'hello',
    Intro = 'intro',
    Happy = 'happy',
    Warning = 'warning',
    Sad = 'sad',
    Back = 'back',
    Confirm = 'confirm',
    Approve = 'approve',
    Negation = 'negate'
}

enum SentenceKind { Part, One, Many }

enum SentenceSense { Question, Exclamation, Sense }

const questions = [SayPart.Confirm];
const exclamations = [SayPart.Hello, SayPart.Warning, SayPart.Happy, SayPart.Sad, ];

export type PartsType = { [key: string]: string[] }

export type SimplePartType = SayPart | string | string[];
export type CustomDurationSentenseType = {text: string, duration: number}
export type ExplicitTypingType = {typing: boolean, duration: number}
export type TerminalCommandType = {shell: string}
export type ExplicitPauseType = {pause: boolean, duration: number}
//sexport type MergesPhraseType = { merge: SimplePartType[], duration?: number }
export type SentenseType = SimplePartType | CustomDurationSentenseType | ExplicitTypingType | ExplicitPauseType | TerminalCommandType;
export type PhrasesType = {phrases: SentenseType[], duration?: number}
export type VariantsType = {variants: SentenseType}
export type ScriptLineType = VariantsType | PhrasesType | SentenseType
export type ScriptDataType = { [key: string]: ScriptLineType[] }

export class Part {
    public constructor(private texts: string[]) { }

    select() {
        const index = Math.floor(Math.random() * this.texts.length); 
        return this.texts[index];
    }
}

const parts: {[key: string]: Part} = {};
const keys: string[] = Object.values(SayPart).filter(x => typeof x === 'string');
    for (let key of keys) {
        let tests: string[] = (partsData as PartsType)[key] as string[];
        parts[key] = new Part(tests);
    }

export class Sentense {
    actionType: BotActionType = BotActionType.StopThinking;
    kind: SentenceKind;

    many: string[] = [];
    merge: SimplePartType[] = [];
    one: string = ''
    part: SayPart = SayPart.None;

    private choiseIndex = -1;

    constructor(public sentense: SentenseType, public duration: number = 500) { 
        if (Array.isArray(sentense)) {
            this.actionType = BotActionType.SaySomething;
            this.kind = SentenceKind.Many;
            this.many = sentense as string[];
        }
        else if (this.isCustomPauseSentense(sentense)) {
            this.actionType = BotActionType.SaySomething;
            this.kind = SentenceKind.One;
            this.one = sentense.text;
            this.duration = sentense.duration ? sentense.duration : this.duration;
        }
        else if (this.isExplicitTyping(sentense)) {
            this.actionType = BotActionType.Typing;
            this.kind = SentenceKind.One;
            this.one = '';
            this.duration = sentense.duration;
        }
        else if (this.isExplicitPause(sentense)) {
            this.actionType = BotActionType.WaitForPlayer;
            this.kind = SentenceKind.One;
            this.one = '';
            this.duration = sentense.duration;
        }
        else if (this.isTerminalCommand(sentense)) {
            this.actionType = BotActionType.TerminalCommand;
            this.kind = SentenceKind.One;
            this.one = sentense.shell;
            this.duration = 0;
        }
        else {
            this.actionType = BotActionType.SaySomething;
            this.kind = SentenceKind.One;
            this.one = sentense as string;
        }

        if (this.kind === SentenceKind.One) {
            if (parts[this.one]) {
                this.kind = SentenceKind.Part;
                this.part = sentense as SayPart;
                this.one = parts[this.one].select();
            }
        }
    }

    isCustomPauseSentense = (sentense: SentenseType): sentense is CustomDurationSentenseType =>
        (sentense as CustomDurationSentenseType).text !== undefined;
    isExplicitTyping = (sentense: SentenseType): sentense is ExplicitTypingType =>
        (sentense as ExplicitTypingType).typing !== undefined;
    isExplicitPause = (sentense: SentenseType): sentense is ExplicitPauseType =>
        (sentense as ExplicitPauseType).pause !== undefined;
    isTerminalCommand = (sentense: SentenseType): sentense is TerminalCommandType =>
        (sentense as TerminalCommandType).shell !== undefined;

    chooseOne() {
        switch (this.kind) {
            case SentenceKind.Many:
                this.choiseIndex++;
                if (this.choiseIndex >= this.many.length) {
                    this.choiseIndex = 0;
                }
                return this.many[this.choiseIndex];

            default:
                return this.one;
        }
    }
}

export class ScriptLine {
    private sentencies: Sentense[] = []
    private index = -1;

    constructor(id: string) {
        const line = ((scriptData as any) as ScriptDataType)[id] as ScriptLineType;
        if (this.isPhrases(line)) {
            this.sentencies = line.phrases.map(sentense => {
                //if (this.isMergedPhrase(sentense)) {}
                return new Sentense(sentense, line.duration ? line.duration : undefined)
            });
        } else if (this.isVariants(line)) {
            this.sentencies = [ new Sentense(line.variants) ];
        } else {
            this.sentencies = [ new Sentense(line) ];
        }
    }

    isPhrases = (line: ScriptLineType): line is PhrasesType => (line as PhrasesType).phrases !== undefined;
    isVariants = (line: ScriptLineType): line is VariantsType => (line as VariantsType).variants !== undefined;
    //isMergedPhrase = (line: ScriptLineType): line is MergesPhraseType => (line as MergesPhraseType).merge !== undefined;
    
    next(): Sentense {
        this.index++;
        return this.sentencies[this.index];
    }

    get done(): boolean { return this.index >= this.sentencies.length-1; }
}


export class SayingBuilder {
    public build(instance: Sentense, mood: BotMood): string {
        let result = '';
        //for (let sentense of sentenses) { 
            //const instance = new Sentense(sentense);
            const text = instance.chooseOne();

            let type = SentenceSense.Sense;
            if (instance.kind === SentenceKind.Part) {
                if (questions.includes(instance.part)) type = SentenceSense.Question;
                if (exclamations.includes(instance.part )) type = SentenceSense.Exclamation;
            }
            result += this.addMood(text, type, mood) + ' ';
        //}
        return result;
    }

    private addMood(text: string, type: SentenceSense, mood: BotMood) {
        text = text.trim();
        let addExpressiveChars = 0.1;
        if (mood === BotMood.Angry || mood === BotMood.Happy) {
            addExpressiveChars = 0.1 + Math.random() * 0.9;
        } else if (mood === BotMood.Worry) {
            addExpressiveChars = 0.1 + Math.random() * 0.5;
        }

        let totalExpressiveChars = 0;
        if (addExpressiveChars <= 0.1) totalExpressiveChars = 1;
        else if (addExpressiveChars <= 0.4) totalExpressiveChars = 2;
        else if (addExpressiveChars <= 0.8) totalExpressiveChars = 3;
        else totalExpressiveChars = 4;

        let lastChar = text.substr(text.length-1, 1);
        if ([')', '(', '/', '\\'].includes(lastChar)) return text;
        if (!['!', '?', ','].includes(lastChar)) lastChar = '';
        
        const char = lastChar ? lastChar : this.getExpresiveChar(type, mood);

        for (let i = lastChar ? 1 : 0; i < totalExpressiveChars; i++) {
            text += char;
        }

        // TODO: UPPERCASE?

        return text;
    }

    private getExpresiveChar(type: SentenceSense, mood: BotMood) {
        if (type === SentenceSense.Question) return '?';
        if (mood === BotMood.Neutral) return '.';

        var choise = 0.5 + Math.random() * 0.5;
        return choise < 0.6 ? '.' : '!';
    }
}