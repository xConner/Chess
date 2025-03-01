import { Piece } from "./piece.js";
import { board } from "../script.js";

export class Pawn extends Piece {

    constructor(x, y, isWhite) {
        super(x,y,isWhite);
    }
    
    getLegalMoves() {
        let allLegalMoves = [];
        // up or down depending on color
        let direction = this.isWhite ? -1 : 1;

        // checks field in front
        if (!board[this.x][this.y + direction]) {
            allLegalMoves.push([this.x, this.y + direction]);

            // checks if it's first move & 2 fields in front
            const startRow = this.isWhite ? 6 : 1;
            if (this.y === startRow && !board[this.x][this.y + direction * 2]) {
                allLegalMoves.push([this.x, this.y + direction * 2]);
            }
        }

        // still in board & diagonal left & piece is enemy
        if (this.x > 0 && board[this.x - 1][this.y + direction] && board[this.x - 1][this.y + direction].isWhite !== this.isWhite) {
            allLegalMoves.push([this.x - 1, this.y + direction]);
        }

        // same as above & diagonal right
        if (this.x < 7 && board[this.x + 1][this.y + direction] && board[this.x + 1][this.y + direction].isWhite !== this.isWhite) {
            allLegalMoves.push([this.x + 1, this.y + direction]);
        }

        return allLegalMoves;
    }
       
}