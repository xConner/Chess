import { Piece } from "./piece.js";
import { board } from "../script.js";

export class Knight extends Piece {

    constructor(x, y, isWhite) {
        super(x,y,isWhite);
    }
    
    getLegalMoves() {

        const knightMoves = [
            [2, 1], [2, -1], [-2, 1], [-2, -1],
            [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];

        return this.getMovesFromSet(knightMoves);
    }

}