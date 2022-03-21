import { keys } from '../constants/constants';
import './keyboard.css';

const Keyboard = ({ boardData, handleKeyPress }) => {
  const getKeyColor = (key) => {
    if (boardData?.correctCharArray.includes(key.toString()))
      return 'key-correct';
    if (boardData?.presentCharArray.includes(key.toString()))
      return 'key-present';
    if (boardData?.absentCharArray.includes(key.toString()))
      return 'key-absent';
    return 'key';
  };

  return (
    <div className="keyboard-rows">
      {keys.map((item, index) => (
        <div className="row" key={index}>
          {item.map((key, i) => {
            const keyClass = getKeyColor(key);
            return (
              <button
                key={i}
                className={`${keyClass} `}
                onClick={() => {
                  handleKeyPress(key);
                }}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
