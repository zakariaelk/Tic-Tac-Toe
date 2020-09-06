import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// Starting with the most inner Component, and going all the way up.


/* SQUARE COMPONENT */

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >

            {/* Here using the value prop to display the value of the clicked upon square[i] */}

            {props.value}
        </button>
    )
}


/* BOARD COMPONENT */

class Board extends React.Component {

    // RENDER SQUARE

    renderSquare(i) {
        return <Square
            value={this.props.squares[i]} // We're getting our clicked square from our Game comp. using the squares[i] to set it in its position in the squares array.
            onClick={() => this.props.handleClick(i)} // here we're calling the handleClick function with our (i) to take care of our current square in the squares array.
        />;
    }


    // RENDER BOARD

    render() {

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        )
    }
}



/* GAME COMPONENT */

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true // we're gonna be filling up the square values based on the boolean value of xIsNext, we start with true for X. See below in handleClick for better understanding
        }
    }


    // HANDLE CLICK

    handleClick(i) {

        const history = this.state.history.slice(0, this.state.stepNumber + 1); // remember that when using slice(a, b) the b is not inclusive in the results.
        const current = history[history.length - 1];
        const squares = [...current.squares]

        // returning if we have a winner winner chicken dinner.
        if (calculateWinner(squares)) {
            return;
        }
        if (!squares[i]) {
            squares[i] = this.state.xIsNext ? 'X' : 'O'; // using the current boolean we check if (true or false), if true we get 'X', if false we get 'O' and have it pushed to our square[i]. We start with X, as we've initially set our xIsNext to true.
            this.setState({
                history: history.concat([{
                    squares,
                }]),
                stepNumber: history.length,
                xIsNext: !this.state.xIsNext
            }); // Now we set our state and each time we flip the boolean.        
        }

    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    render() {


        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                `Go to move #${ move }` : 'Go to Game Start';

            return (<li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>);
        })


        let status;

        if (winner) {
            status = `Winner is: ${ winner }`;

        } else {
            status = `Next Player: ${ this.state.xIsNext ? 'X' : 'O' }`;
        }


        return (
            <div className="game">

                <div className="game-board">
                    <Board
                        squares={current.squares}
                        handleClick={(i) => this.handleClick(i)}
                    />
                </div>

                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>

            </div>
        )
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);




function calculateWinner(squares) {
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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}