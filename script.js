import Grid from "./Grid.js"
import Tile from "./Tile.js"

const gameBoard = document.getElementById("game-board")

let grid = new Grid(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
var executed = false;

document.getElementById("clickMe").onclick = function () {
    document.getElementById('lose').classList.remove('show')
    document.getElementById('win').classList.remove('show')
    document.getElementById('joke').classList.remove('notHidden')
    document.getElementById('joke').classList.remove('notHidden')
    executed = false
    reset()
    grid.randomEmptyCell().tile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = new Tile(gameBoard)
    setupInput()
}

function reset() {
    return resetting(grid.cells)
}

function resetting(cellss) {
    cellss.forEach((element) => {
        let removalTile = element.tile
        if (removalTile != null) {
            element.tile.remove()
            element.tile = undefined
            element.mergeTile = undefined
        }
    })
}

function info() {
    setTimeout(function () {
        document.getElementById('howToPlay').classList.toggle('show')
    }, 10)
}
document.getElementById("information").onclick = info

setupInput()

function setupInput() {
    window.addEventListener("keydown", handleInput, { once: true })
}

async function handleInput(e) {
    switch (e.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                setupInput()
                return
            }
            await moveUp()
            break
        case "ArrowDown":
            if (!canMoveDown()) {
                setupInput()
                return
            }
            await moveDown()
            break
        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInput()
                return
            }
            await moveLeft()
            break
        case "ArrowRight":
            if (!canMoveRight()) {
                setupInput()
                return
            }
            await moveRight()
            break
        default:
            setupInput()
            return
    }

    grid.cells.forEach(cell => cell.mergeTiles())

    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        newTile.waitForTransition(true).then(() => {
            setTimeout(function () {
                document.getElementById('lose').classList.toggle('show')
            }, 10)
        })
        return
    }

    var checkWin = (function () {
        return function () {
            if (!executed) {
                // do something
                grid.cells.forEach((element) => {
                    let newArray = []
                    let getTiles = element.tile
                    if (getTiles != null) {
                        newArray.push(getTiles)
                    }
                    for (let i = 0; i < newArray.length; i++) {
                        if (newArray[i].value == 3072) {
                            newTile.waitForTransition(true).then(() => {
                                setTimeout(function () {
                                    document.getElementById('win').classList.toggle('show')
                                }, 10)
                            })
                            executed = true;
                        }
                    }
                })
            }
        };
    })();

    checkWin()
    document.getElementById('win').classList.remove('show')
    setupInput()
}

function moveUp() {
    return slideTiles(grid.cellsByColumn)
}

function moveDown() {
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
    return slideTiles(grid.cellsByRow)
}

function moveRight() {
    return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells) {
    return Promise.all(
        cells.flatMap(group => {
            const promises = []
            for (let i = 1; i < group.length; i++) {
                const cell = group[i]
                if (cell.tile == null) continue
                let lastValidCell
                for (let j = i - 1; j >= 0; j--) {
                    const moveToCell = group[j]
                    if (!moveToCell.canAccept(cell.tile)) break
                    lastValidCell = moveToCell
                }

                if (lastValidCell != null) {
                    promises.push(cell.tile.waitForTransition())
                    if (lastValidCell.tile != null) {
                        lastValidCell.mergeTile = cell.tile
                    }
                    else {
                        lastValidCell.tile = cell.tile
                    }
                    cell.tile = null
                }

            }
            return promises
        })
    )
}

function canMoveUp() {
    return canMove(grid.cellsByColumn)
}

function canMoveDown() {
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}

function canMoveLeft() {
    return canMove(grid.cellsByRow)
}

function canMoveRight() {
    return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

function canMove(cells) {
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) return false
            if (cell.tile == null) return false
            const moveToCell = group[index - 1]
            return moveToCell.canAccept(cell.tile)
        })
    })
}

var executed2 = false
setupInput3()
setupInput2()


function setupInput3() {
    window.addEventListener("keydown", getJokesFirst, { once: true })
}

function getJokesFirst(e) {

    if (executed2 == false) {
        switch (e.key) {
            case "ArrowUp":
                fetchingJokes()
                break
            case "ArrowDown":
                fetchingJokes()
                break
            case "ArrowLeft":
                fetchingJokes()
                break
            case "ArrowRight":
                fetchingJokes()
                break
            default:
                setupInput3()
        }
    }
    executed2 = true

}

function setupInput2() {
    window.addEventListener("keydown", getJokes)
}

function getJokes(e) {

    switch (e.key) {
        case "ArrowUp":
            // fetchingJokesUp()
            if (canMoveUp()) {
                fetchingJokes()
            }
            break
        case "ArrowDown":
            // fetchingJokesDown()
            if (canMoveDown()) {
                fetchingJokes()

            }
            break
        case "ArrowLeft":
            // fetchingJokesLeft()
            if (canMoveLeft()) {
                fetchingJokes()
            }
            break
        case "ArrowRight":
            // fetchingJokesRight()
            if (canMoveRight()) {
                fetchingJokes()
            }
            break
        default:
            setupInput2()
            return
    }
}

function fetchingJokes() {
    fetch('https://v2.jokeapi.dev/joke/Any?safe-mode')
        .then(response => response.json())
        .then(data => {
            let genre = data.type

            if (genre == 'twopart') {
                let setUp = data.setup
                let punchLine = data.delivery

                let joke1 = document.getElementById('joke')
                joke1.classList.add('notHidden')

                joke1.innerHTML = `${setUp}<br>${punchLine}`
            }
            else {
                let theJoke = data.joke
                let joke2 = document.getElementById('joke')
                joke2.classList.add('notHidden')

                joke2.innerHTML = `${theJoke}`
            }
        })
}