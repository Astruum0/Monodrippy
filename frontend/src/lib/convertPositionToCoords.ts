import { Vector } from "p5";
import { P5Vector } from "vue-p5-component";

const cornersCoords = [
    {x: 117, y: 117},
    {x: -117, y: 117},
    {x: -117, y: -117},
    {x: 117, y: -117},
]

export function convertCaseToCoords(caseNumber: number, shifted: number | undefined = undefined): P5Vector {
    const side = Math.floor(caseNumber / 9)
    const positionRelativeToSide = caseNumber % 9
    const coords = new Vector(cornersCoords[side].x, cornersCoords[side].y); 
    
    const extraCoords = positionRelativeToSide * 26
    if (side === 0) { 
        coords.x -= extraCoords 
    } else if (side === 1) { 
        coords.y -= extraCoords 
    } else if (side === 2) {
        coords.x += extraCoords
    } else {
        coords.y += extraCoords
    }
    return coords
}