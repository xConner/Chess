import { Rook } from "./pieces/rook.js";
import { Bishop } from "./pieces/bishop.js";
import { Queen } from "./pieces/queen.js";
import { King } from "./pieces/king.js";
import { Pawn } from "./pieces/pawn.js";
import { Knight } from "./pieces/knight.js";

//Create empty 2D Array containing Pieces
export let board = new Array(8);
export let whitesTurn = true;
export let chosenPiece;
for(let i = 0; i < 8; i++) {
    board[i] = new Array(8);
}
export let pieceList = [];

export let whiteKing;
export let blackKing;
//createPieces();
whiteKing = new King(4,7,true);
blackKing = new King(4,0,false);
new Queen(3,7,true);

function createPieces() {
    //Create white pieces
    new Rook(0,7,true);
    new Knight(1,7,true);
    new Bishop(2,7,true);
    new Queen(3,7,true);
    whiteKing = new King(4,7,true);
    new Bishop(5,7,true);
    new Knight(6,7,true);
    new Rook(7,7,true);
    for(let i = 0; i < 8; i++) {
        new Pawn(i,6,true);
    }

    //Create black pieces
    new Rook(0,0,false);
    new Knight(1,0,false);
    new Bishop(2,0,false);
    new Queen(3,0,false);
    blackKing = new King(4,0,false);
    new Bishop(5,0,false);
    new Knight(6,0,false);
    new Rook(7,0,false);
    for(let i = 0; i < 8; i++) {
        new Pawn(i,1,false);
    }
}

export function resetBoard() {
    board = new Array(8);
    for(let i = 0; i < 8; i++) {
        board[i] = new Array(8);
    }
    whitesTurn = true;
    pieceList.forEach(piece => {
        console.log(piece);
        piece.$element.off();
        piece.$element.remove();
    });
    pieceList = [];
    chosenPiece = undefined;
}

export function getFieldByMouse(mouseX, mouseY) {
    //Width and height of any field needed
    const fieldWidth = $('#00').width();
    const fieldHeight = $('#00').height(); 

    const boardRect = $(".board")[0].getBoundingClientRect();

    const x = Math.floor((mouseX - boardRect.x) / fieldWidth);
    const y = Math.floor((mouseY - boardRect.y) / fieldHeight);
    return [x,y];
}

$(document).on('mousedown', (e) => {
    if(chosenPiece) {
        $(".marked").remove();
        const [x, y] = getFieldByMouse(e.pageX, e.pageY);
        if(chosenPiece.isMoveLegal(x, y)) {
            //remove field in array from old coordinates, rest is handled in moveToField method
            board[chosenPiece.x][chosenPiece.y] = undefined;
            //execute the move
            chosenPiece.moveToField(x, y)
        }
        chosenPiece = undefined;
    }
});

export function toggleWhitesTurn() {
    //remove check mark
    $(".check").remove();
    whitesTurn = !whitesTurn;
    const check = checkForCheck();
    //shows old piece where new piece is supposed to be
    console.log(board);
    const noMoves = checkForNoMoves();
    if(noMoves) {
        //game ends
        if(check) {
            $(".turn").text(`Checkmate! ${whitesTurn ? "Black" : "White"} wins!`);
        }else {
            $(".turn").text("Stalemate!");
        }
        endGame();
        return;
    }
    if(whitesTurn) {
        $(".turn").text("White's turn");
    } else {
        $(".turn").text("Black's turn");
    }
}

function endGame() {
    $(".board").off();
}

export function setChosenPiece(piece) {
    chosenPiece = piece;
}

function checkForCheck() {
    let king;
    //get opponents king
    if(whitesTurn) {
        king = whiteKing;
    }else {
        king = blackKing;
    }
    if(king.isInCheck()) {
        $(`#${king.x}${king.y}`).append(`<div class="check"></div>`);
        return true;
    }
    return false;
}

function checkForNoMoves() {
    
    for(let piece of pieceList) {
        if(piece.isWhite === whitesTurn) {
            if(piece.removeIllegalChecks(piece.getLegalMoves()).length > 0) {
                return false;
            }
        }
    }
    
    return true;
}