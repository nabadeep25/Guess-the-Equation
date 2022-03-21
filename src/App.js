import React, { useState, useEffect } from 'react';
import './App.css';
import Info from './components/Info';
import Keyboard from './components/Keyboard';
import { equationList } from './constants/data';
import { getExpvalue } from './utils/evaluate';

const App = () => {
  const [boardData, setBoardData] = useState(null);
  const [message, setMessage] = useState({});
  const [charArray, setCharArray] = useState([]);
  const [col, setCol] = useState(5);
  const [colArr, setColArr] = useState([0, 1, 2, 3, 4]);

  const setupgame = (colNo) => {
    const boardCol = colNo || col;
    var eqIndex = Math.floor(Math.random() * equationList[boardCol].length);
    let newBoardData = {
      ...boardData,
      equation: equationList[boardCol][eqIndex],
      rowIndex: 0,
      boardStrings: [],
      boardRowStatus: [],
      presentCharArray: [],
      absentCharArray: [],
      correctCharArray: [],
      status: 'IN_PROGRESS',
    };
    setBoardData(newBoardData);
  };
  useEffect(() => {
    setupgame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMessage = (message, type) => {
    setMessage({ msg: message, type });
    setTimeout(() => {
      setMessage({});
    }, 5000);
  };

  const handleChange = (event) => {
    const colNo = event.target.value;
    setCol(colNo);
    var arr = [];
    for (let i = 0; i < colNo; i++) arr.push(i);

    setColArr(arr);
    setupgame(colNo);
  };
  const enterBoardWord = (str) => {
    let boardStrings = boardData.boardStrings;
    let boardRowStatus = boardData.boardRowStatus;
    let equation = boardData.equation;
    let presentCharArray = boardData.presentCharArray;
    let absentCharArray = boardData.absentCharArray;
    let correctCharArray = boardData.correctCharArray;
    let rowIndex = boardData.rowIndex;
    let rowStatus = [];
    let matchCount = 0;
    let status = boardData.status;

    for (let index = 0; index < str.length; index++) {
      if (equation.charAt(index) === str.charAt(index)) {
        matchCount++;
        rowStatus.push('correct');
        if (!correctCharArray.includes(str.charAt(index)))
          correctCharArray.push(str.charAt(index));
        if (presentCharArray.indexOf(str.charAt(index)) !== -1)
          presentCharArray.splice(
            presentCharArray.indexOf(str.charAt(index)),
            1
          );
      } else if (equation.includes(str.charAt(index))) {
        rowStatus.push('present');
        if (
          !correctCharArray.includes(str.charAt(index)) &&
          !presentCharArray.includes(str.charAt(index))
        )
          presentCharArray.push(str.charAt(index));
      } else {
        rowStatus.push('absent');
        if (!absentCharArray.includes(str.charAt(index)))
          absentCharArray.push(str.charAt(index));
      }
    }
    if (matchCount === col) {
      status = 'WIN';
      handleMessage('🎉YOU WON', 'success');
    } else if (rowIndex + 1 === 6) {
      status = 'LOST';
      handleMessage(`Equation ${boardData.equation}`, 'info');
    }
    boardRowStatus.push(rowStatus);
    boardStrings[rowIndex] = str;
    let newBoardData = {
      ...boardData,
      boardStrings: boardStrings,
      boardRowStatus: boardRowStatus,
      rowIndex: rowIndex + 1,
      status: status,
      presentCharArray: presentCharArray,
      absentCharArray: absentCharArray,
      correctCharArray: correctCharArray,
    };
    setBoardData(newBoardData);
  };

  const enterCurrentChar = (str) => {
    let boardStrings = boardData.boardStrings;
    let rowIndex = boardData.rowIndex;
    boardStrings[rowIndex] = str;
    let newBoardData = { ...boardData, boardStrings: boardStrings };
    setBoardData(newBoardData);
  };

  const handleKeyPress = (key) => {
    if (boardData.rowIndex > 5 || boardData.status === 'WIN') {
      handleMessage('Please Reset the game', 'info');
      return;
    }
    if (key === 'ENTER') {
      if (charArray.length === col) {
        let expression = charArray.join('').toLowerCase();
        if (!expression.match(/=/g) || expression.match(/=/g).length !== 1) {
          handleMessage('Invalid Expression', 'error');
          return;
        }
        const [exp, res] = expression.split(/=/);
        if (getExpvalue(exp) !== parseFloat(res, 10)) {
          handleMessage('Invalid Expression', 'error');
          return;
        }
        enterBoardWord(expression);
        setCharArray([]);
      } else {
        handleMessage('Incomplete Expression', 'error');
      }
      return;
    }
    if (key === 'BACKSPACE') {
      charArray.splice(charArray.length - 1, 1);
      setCharArray(charArray);
    } else if (charArray.length < col) {
      charArray.push(key);
      setCharArray(charArray);
    }
    enterCurrentChar(charArray.join('').toLowerCase());
  };

  const getClass = (row, col) => {
    if (boardData?.boardRowStatus[row])
      return boardData.boardRowStatus[row][col];
    return '';
  };

  const showMessage = () => {
    return (
      message.msg && (
        <div className={`message ${message?.type}`}>{message.msg}</div>
      )
    );
  };
  const showBox = () => (
    <div className="box">
      {[0, 1, 2, 3, 4].map((row) => (
        <div className={'box-row '} key={row}>
          {colArr.map((column) => {
            const classColor = getClass(row, column);

            return (
              <div key={column} className={`char ${classColor}`}>
                {boardData &&
                  boardData.boardStrings[row] &&
                  boardData.boardStrings[row][column]}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
  return (
    <div className="container">
      <div className="header">
        <div className="title">Guess the Equation</div>
        <div className="setting">
          <select
            value={col}
            onChange={handleChange}
            placeholder="Select rows"
            className="select"
          >
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
          </select>

          <button className="reset-btn" onClick={() => setupgame()}>
            Play again
          </button>
        </div>
      </div>

      {showMessage()}

      {col && (
        <>
          {showBox()}
          <div className="keyboard-container">
            <Keyboard boardData={boardData} handleKeyPress={handleKeyPress} />
          </div>
          <Info />
        </>
      )}
    </div>
  );
};

export default App;
