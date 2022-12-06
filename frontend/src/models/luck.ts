import { Element } from "p5";

export interface Luck {
    id: number
    name: string
    content: string
    cardEffect: CardEffect
}

interface CardEffect {
    effect: string
    value: number
}

export class Luck implements Luck {

    static div: Element | null
    static title: Element | null
    static desc: Element | null

    constructor(payload: Partial<Luck>) {
        this.id = payload.id as number
        this.name = payload.name as string
        this.content = payload.content as string
        this.cardEffect = payload.cardEffect as CardEffect
    }
}