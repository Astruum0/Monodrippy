export interface Luck {
    id: number

    name: string

    content: string

    effect: CardEffect

}

interface CardEffect {
    effect: string
    value: number
}