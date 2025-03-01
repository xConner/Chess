import { board, getFieldByMouse, whitesTurn, toggleWhitesTurn, pieceList, resetBoard, chosenPiece, setChosenPiece, whiteKing, blackKing } from "../script.js";

export class Piece {
    constructor(x, y, isWhite) {
        if(new.target === Piece) throw new Error("Abstact class cannot be instanciated");
        if(this.getLegalMoves === undefined) throw new Error("Must override method");
        this.x = x;
        this.y = y;
        this.isWhite = isWhite;

        //white or black icon
        this.imgPath = `./assets/images/${new.target.name.toLowerCase()}-${isWhite ? 'w' : 'b'}.png`;

        //place Piece in Arrays and HTML as img
        board[x][y] = this;
        pieceList.push(this);
        this.placeOnField(x,y);

    }

    isMoveLegal(x, y) {
        return this.allLegalMoves.some(([a,b]) => a === x && b === y);
    }

    placeOnField(x, y) {
        const $field = $(`#${x}${y}`);
        this.$element = $(`<img src="${this.imgPath}" draggable="false" class="piece">`)
        $field.append(this.$element);

        //track dragging
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;

        this.$element.on('mousedown', (e) => {
            e.preventDefault();
            if(whitesTurn !== this.isWhite) return;
            e.stopPropagation();
            $(".marked").remove();
            this.dragging = true;
            setChosenPiece(this);
            this.allLegalMoves = this.removeIllegalChecks(this.getLegalMoves());
            this.displayLegalMoves();

            // calculates absolute coordinates of img center using absolute coordinates of field
            const field = this.$element[0].getBoundingClientRect();
            this.fieldCenterX = field.width / 2 + field.left;
            this.fieldCenterY = field.height / 2 + field.top;
        
            // element set absolute to move freely
            this.$element.css({
                position: 'absolute',
                zIndex: 100,
                cursor: 'grabbing'
            });
        });
        
        //place image on mouse position
        $(document).on('mousemove', (e) => {
            if (this.dragging) {
                // difference between cursor and imgCenter
                const newLeft = e.pageX  - this.fieldCenterX;
                const newTop  = e.pageY  - this.fieldCenterY;
            
                this.$element.css({
                    left: newLeft + 'px',
                    top: newTop + 'px'
                });
            }
        });


        $(document).on('mouseup', (e) => {
            if (this.dragging) {
                this.dragging = false;
                this.$element.css({
                    cursor: 'grab'
                });

                const newField = getFieldByMouse(e.pageX, e.pageY);
                const x = newField[0];
                const y = newField[1];
     
                //Checks if allLegalMoves includes move [x,y]
                if(this.isMoveLegal(x,y)) {

                    //removes pieces from board array and it's markings
                    board[this.x][this.y] = undefined;
                    $(".marked").remove();
                    setChosenPiece(undefined);
                    this.moveToField(x, y);
                }

                //Piece returns to center of it's field
                this.$element.css({
                    left: '0',
                    top: '0',
                    zIndex: 7
                });
            }
        });
    }

    removeIllegalChecks(legalMoves) {
        return legalMoves.filter(([newX, newY]) => {
                    
                // simulate move
                let originalPiece = board[newX][newY];
                board[this.x][this.y] = undefined;
                board[newX][newY] = this;
                    
                // temporary new position
                const oldX = this.x;
                const oldY = this.y;
                this.x = newX;
                this.y = newY;

                const king = this.isWhite ? whiteKing : blackKing;
                const inCheck = king.isInCheck();
            
                // back to normal
                this.x = oldX;
                this.y = oldY;
                board[this.x][this.y] = this;
                board[newX][newY] = originalPiece;
                    
                //removes move if in check
                return !inCheck; 
            });;
    }

    moveToField(x, y) {
        console.log(this);
        this.x = x;
        this.y = y;
        if(board[x][y]) {

            pieceList.splice(pieceList.indexOf(board[x][y]), 1);
            //removes all event listener
            board[x][y].$element.off();
            //remove DOM-element
            board[x][y].$element.remove();
            //delete it for now
            board[x][y] = undefined;
        }
        board[x][y] = this;
        console.log(board[x][y]);
        $(`#${x}${y}`).append(this.$element);
        toggleWhitesTurn();
    }

    displayLegalMoves() {
       this.allLegalMoves.forEach(legalMove => {
        $(`#${legalMove[0]}${legalMove[1]}`).append(`<div class="marked"></div>`);
       });
    }

    //gets all Legal Moves in direction
    scanDirection (dx, dy){
        let legalMoves = [];
        let x = this.x + dx;
        let y = this.y + dy;

        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
            //field occupied?
            if (board[x][y]) {
                //enemy piece? -> legal move, still break as next fields are blocked
                if (board[x][y].isWhite !== this.isWhite) {
                    legalMoves.push([x, y]);
                }
                break; 
            }

            legalMoves.push([x, y]);
            x += dx;
            y += dy;
        }
        return legalMoves;
    }
    
    getMovesFromSet(moveSet) {
        let legalMoves = [];
    
        for (let [dx, dy] of moveSet) {
            let newX = this.x + dx;
            let newY = this.y + dy;
    
            if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                if (!board[newX][newY] || board[newX][newY].isWhite !== this.isWhite) {
                    legalMoves.push([newX, newY]);
                }
            }
        }
    
        return legalMoves;
    }
    
}

