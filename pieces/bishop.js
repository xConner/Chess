import { Piece } from "./piece.js";

export class Bishop extends Piece {

    constructor(x, y, isWhite) {
        super(x,y,isWhite);
    }
    
    getLegalMoves() {
        let allLegalMoves = [];
        
        //top left, top right, bottom left, bottom right
        allLegalMoves.push(...super.scanDirection(-1,-1));
        allLegalMoves.push(...super.scanDirection(1,-1));
        allLegalMoves.push(...super.scanDirection(-1,1));
        allLegalMoves.push(...super.scanDirection(1,1));

        return allLegalMoves;
    }

}