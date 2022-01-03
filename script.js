'use strict';

const gridItems = document.querySelectorAll('.grid-item');
const winnerText = document.getElementById('winner');
const reset = document.getElementById('reset');
const startBtn = document.getElementById('start');

const playerOneSelects = document.querySelectorAll('.player > .one > li');
const playerTwoSelects = document.querySelectorAll('.player > .two > li');

//functionality
//game
const newGame = () => {
    let gameBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let playerOne = null;
    let playerTwo = null;
    let winner = null;
    let isTie = false;
    let currentPlayer = null;
    let eventListen = true;

    const player = (playerSelects) => {
        let playerName = null;
        let isTurn = false;

        function playerNameSelections() {
            this.classList.add('select');
            let array = [...playerSelects];
            let removeSelects = array.filter(val => val !== this);
            removeSelects.forEach(select => {
                select.classList.remove('select');
            });
        }

        function setName() {
            let name = null;
            playerSelects.forEach(item => {
                if (item.classList.contains('select')) {
                    name = item.textContent;
                }
            });
            this.playerName = name;
        }

        const addItemListeners = () => {
            playerSelects.forEach(item => {
                item.addEventListener('click', playerNameSelections);
            });
        }

        const removeItemListeners = () => {
            playerSelects.forEach(item => {
                item.removeEventListener('click', playerNameSelections);
            });
        }

        return { playerName, isTurn, setName, addItemListeners, removeItemListeners };
    }

    function setPlayerAndStart() {
        const playOne = player(playerOneSelects);
        playOne.addItemListeners();

        const playTwo = player(playerTwoSelects);
        playTwo.addItemListeners();

        startBtn.addEventListener('click', () => {
            if (winner !== null) return;
            playOne.setName();
            
            playTwo.setName();
            
            if (playOne.playerName === null || playTwo.playerName === null) {
                alert('Choose player name');
            } else {
                makeListItemUnclickable(playerOneSelects);
                makeListItemUnclickable(playerTwoSelects);

                playOne.removeItemListeners();
                playTwo.removeItemListeners();
                playerOne = playOne;
                playerTwo = playTwo;
                currentPlayer = playerOne;
    
                addGridItemListeners();
            }
        });
    }

    function changePlayer() {
        if (playerOne.isTurn) {
            currentPlayer = playerOne;
            playerOne.isTurn = false;
            playerTwo.isTurn = true;
        } else {
            currentPlayer = playerTwo;
            playerOne.isTurn = true;
            playerTwo.isTurn = false;
        }
    }

    function markSpotOnBoard(event, index) {
        console.log(playerOne.playerName);
        if (gameBoard[index] !== playerOne.playerName && gameBoard[index] !== playerTwo.playerName) {
            event.target.textContent = currentPlayer.playerName;
            gameBoard[index] = currentPlayer.playerName;
            checkWinnerOrTie();
            changePlayer();
        }
    }

    function checkWinnerOrTie() {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c]) {
                const winnerName = playerOne.playerName === gameBoard[a] ? playerOne.playerName : playerTwo.playerName;
                winner = winnerName;
                declareWinner();
                eventListen = false;
            }
        }

        isTie = true;
        let hasNumber = false;
        for (let i = 0; i < gameBoard.length; i++) {
            if (typeof gameBoard[i] === 'number') {
                hasNumber = true;
            }
            if (hasNumber || winner !== null) {
                isTie = false;
            }
        }

        if (isTie) {
            declareTie();
            eventListen = false;
        }

        if (!eventListen) {
            removeGridItemListeners();
        }
    }

    function declareWinner() {
        winnerText.textContent = "Winner... " + winner;
    }

    function declareTie() {
        winnerText.textContent = "Tie Game";
    }

    function markOnBoard(event) {
        let childNodes = Array.from(grid.childNodes);
        let gridItem = event.target;
        let index = childNodes.indexOf(gridItem);
        index = Math.floor(index / 2);
        markSpotOnBoard(event, index);
    }

    function addGridItemListeners() {
        gridItems.forEach(gridItem => {
            gridItem.addEventListener('click', markOnBoard);
        });
    }

    function removeGridItemListeners() {
        gridItems.forEach(gridItem => {
            gridItem.removeEventListener('click', markOnBoard);
        });
    }

    return {
        setPlayerAndStart,
    };
};

let game = newGame();
game.setPlayerAndStart();

reset.addEventListener('click', () => {
    window.location.reload();
});


// UI

function makeListItemUnclickable(playerSelects) {
    playerSelects.forEach(item => {
        item.style.cursor = 'not-allowed';
    })
}











