import { Piece } from "./piece.js";

export class Queen extends Piece {

    constructor(x, y, isWhite) {
        super(x,y,isWhite);
    }
    
    getLegalMoves() {
        let allLegalMoves = [];
        
        //left, right, top, bottom
        allLegalMoves.push(...super.scanDirection(-1,0));
        allLegalMoves.push(...super.scanDirection(1,0));
        allLegalMoves.push(...super.scanDirection(0,-1));
        allLegalMoves.push(...super.scanDirection(0,1));

        //top left, top right, bottom left, bottom right
        allLegalMoves.push(...super.scanDirection(-1,-1));
        allLegalMoves.push(...super.scanDirection(1,-1));
        allLegalMoves.push(...super.scanDirection(-1,1));
        allLegalMoves.push(...super.scanDirection(1,1));

        return allLegalMoves;
    }

}