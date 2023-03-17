import React, { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  // show status
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  // init board items
  let boardRowList = [];
  for (let i = 0; i < 3; i++) {
    let items = [];
    for (let j = 0; j < 3; j++) {
      let index = i * 3 + j;
      items.push(
        <Square
          key={"item-" + index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
        />
      );
    }
    boardRowList.push(
      <div key={"board-row-" + i} className="board-row">
        {items}
      </div>
    );
  }
  return (
    <div>
      <div className="status">{status}</div>
      {boardRowList}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [currentMoveSort, setCurrentMoveSort] = useState("ASC");

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function swapMoveSort() {
    console.log("swapMoveSort");
    setCurrentMoveSort(currentMoveSort === "ASC" ? "DES" : "ASC");
  }

  const moves = history.map((squares, move) => {
    let description;
    let isButton = true;
    if (move === currentMove) {
      description = "You are at move #" + move;
      isButton = false;
    } else if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {isButton ? (
          <button onClick={() => jumpTo(move)}>{description}</button>
        ) : (
          <div>{description}</div>
        )}
      </li>
    );
  });

  const descMoves = moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => swapMoveSort()}>{currentMoveSort}</button>
        <ol>{currentMoveSort === "ASC" ? moves : descMoves}</ol>
      </div>
    </div>
  );
}

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
