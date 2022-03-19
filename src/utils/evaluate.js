const { operatorList } = require('../constants/constants');

const isOperator = (ele) => {
  if (operatorList.includes(ele)) return true;
  return false;
};

const stringExpSplitter = (str) => {
  let arr = [];
  let num = '';
  let isPointBefore = false;
  str.split('').forEach((v) => {
    if (!Number.isNaN(parseInt(v, 10)) || (v === '.' && !isPointBefore)) {
      if (v === '.') isPointBefore = true;
      num += v;
    } else if (isOperator(v) || v === '(' || v === ')') {
      if (num) {
        arr.push(num);
        num = '';
        isPointBefore = false;
      }
      arr.push(v);
    } else {
      throw new Error(`Invalid element ${v} `);
    }
  });
  arr.push(num);
  return arr;
};

const priorityOf = (ele) => {
  let priority = -1;
  switch (ele) {
    case '^':
      priority = 4;
      break;
    case '*':
    case '/':
      priority = 3;
      break;
    case '+':
    case '-':
      priority = 2;
      break;

    default:
      priority = -1;
      break;
  }
  return priority;
};

const infixToPostfix = (infixExp) => {
  if (typeof infixExp !== 'string') return infixExp;
  const infixExpression = stringExpSplitter(infixExp);
  infixExpression.push(')');
  infixExpression.unshift('(');
  const postfixExp = [];
  const operatorStack = [];
  console.log(infixExpression);

  infixExpression.forEach((element) => {
    if (!Number.isNaN(parseFloat(element, 10))) {
      postfixExp.push(element);
    } else if (isOperator(element)) {
      // while element <= top of stack push to postfix
      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];

        if (priorityOf(top) < priorityOf(element)) {
          operatorStack.push(element);
          break;
        } else {
          postfixExp.push(element);
          operatorStack.pop();
        }
      }
    } else if (element === '(') {
      operatorStack.push(element);
    } else if (element === ')') {
      while (operatorStack.length > 0) {
        const op = operatorStack.pop();
        if (op === '(') break;
        else postfixExp.push(op);
      }
    } else {
      //==
    }
  });

  console.log('Operator Stack', operatorStack, 'PostFix', postfixExp);
  return postfixExp;
};
const evaluatePostfix = (expression) => {
  let stack = [];
  expression.forEach((item) => {
    if (!Number.isNaN(parseFloat(item, 10))) {
      stack.push(item);
    } else if (isOperator(item)) {
      let num1;
      let num2;
      if (stack.length > 0) num1 = parseFloat(stack.pop());
      if (stack.length > 0) num2 = parseFloat(stack.pop());
      let result = '';
      switch (item) {
        case '+':
          result = num2 + num1;
          break;
        case '-':
          result = num2 - num1;
          break;
        case '*':
          result = num2 * num1;
          break;
        case '/':
          result = num2 / num1;
          break;
        case '^':
          result = Math.pow(num2, num1);
          break;
        default:
          throw new Error('operation unavailable');
      }

      stack.push(result);
    }
  });

  return parseFloat(stack.shift());
};

export const getExpvalue = (exp) => {
  return evaluatePostfix(infixToPostfix(exp));
};
