import { Piece } from "./piece.js";
import { board } from "../script.js";

export class King extends Piece {

    constructor(x, y, isWhite) {
        super(x,y,isWhite);
    }
    
    getLegalMoves() {
        const kingMoves = [
            [-1, -1], [-1, 0], [-1, 1],
            [ 0, -1],          [ 0, 1],
            [ 1, -1], [ 1, 0], [ 1, 1]
        ];

        return this.getMovesFromSet(kingMoves)
    }

    isInCheck() {
        return (
            this.checkDirection([[1, 0], [-1, 0], [0, 1], [0, -1]], ['Rook', 'Queen']) || 
            this.checkDirection([[1, 1], [-1, -1], [1, -1], [-1, 1]], ['Bishop', 'Queen']) || 
            this.checkSet([[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]], "Knight") ||
            this.checkSet([[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]], "King") ||
            this.checkPawns()
        );
    }

    checkDirection(directions, attackers) {
        for (let [dx, dy] of directions) {

            let x = this.x
            let y = this.y;

            while (this.isInField(x += dx, y += dy)) {
                if (board[x][y]) {

                    //non attacking piece or own piece found -> next direction
                    if (!attackers.includes(board[x][y].constructor.name) || board[x][y].isWhite === this.isWhite) {
                        break; 
                    }
                    return true;
                }
            }
        }
        return false;
    }

    checkSet(directions, attacker) {
        
        return directions.some(([dx, dy]) => {
            const newX = this.x + dx;
            const newY = this.y + dy;
    
            return (
                this.isInField(newX, newY) &&
                board[newX][newY]?.constructor.name === attacker &&
                board[newX][newY].isWhite !== this.isWhite
            );
        })
        
    }

    
    checkPawns() {
        const pawnMoves = [[-1, -1], [1, -1]];
        return pawnMoves.some(([dx, dy]) => 
            this.isInField(this.x + dx, this.y + (this.isWhite ? -1 : 1)) && 
            board[this.x + dx][this.y + (this.isWhite ? -1 : 1)]?.constructor.name === 'Pawn' && 
            board[this.x + dx][this.y + (this.isWhite ? -1 : 1)].isWhite !== this.isWhite
        );
    }

    isInField(x, y) {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    }
}