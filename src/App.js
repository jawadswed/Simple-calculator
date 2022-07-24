import { useReducer } from 'react';
import DigitButton from './digit-button';
import styles from './app.module.scss'
import OperationButton from './operation-button';



export const ACTION = {
  ADD_DIGIT: 'add-digit',
  REMOVE_DIGIT: 'remove-digit',
  EVALUATE: 'evaluate',
  CLEAR_OUTPUT: 'clear',
  CHOOSE_OPERATION: 'choose'

}

function reducer(state, { type, payload }) {

  switch (type) {
    case ACTION.ADD_DIGIT:
      if (state.overWrite) 
      return {
        ...state,
        currentOperand: payload.digit,
        overWrite:false
      }
      if (payload.digit === '0' && state.currentOperand === '0') return state
      if (payload.digit === '.' && state.currentOperand.includes('.')) return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTION.CLEAR_OUTPUT:
      return {}

    case ACTION.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) return state
      if (state.previousOperand == null){
        return{
          ...state,
          operation: payload.operation,
          previousOperand:state.currentOperand,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null)
      return {
        ...state,
        operation: payload.operation,
      }

      return {
        ...state,
        previousOperand: evalute(state),
        operation: payload.operation,
        currentOperand: null,
      }
     case ACTION.EVALUATE:
      if (state.currentOperand == null || state.previousOperand == null || state.operation == null)
       return state
      return {
        ...state,
        overWrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evalute(state)
      }
     case ACTION.REMOVE_DIGIT:
      if (state.overWrite){
        return{
          ...state,
          overWrite:false,
          currentOperand: null
        }
      }
      if (state.currentOperand ==null) return state
      if(state.currentOperand.length ===1) return {...state, currentOperand:null}
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      }

    default: return

  }

}

function evalute({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return ""
  let ans = ""
  switch (operation) {
    case "+":
      ans = prev + current;
      break
    case "-":
      ans = prev - current;
      break
    case "x":
      ans = prev * current;
      break
    case "/":
      ans = prev / current;
      break
    default: return
  }
  return ans.toString();


}

const INTEGER_FORMATER = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0})

function formatOperand(operand) {
  if(operand == null) return
  const [integer, decimal] = operand.split(".");
  if(decimal == null) return INTEGER_FORMATER.format(integer)
  return `${INTEGER_FORMATER.format(integer)}.${decimal}`
}

function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});


  //  dispatch({type: ACTION.ADD_DIGIT , payload: {digit: 1}});

  return (
    <div className={styles.gridContainer}>
      <div className={styles.output}>
        <div className={styles.output_prevOperand}>{formatOperand(previousOperand)} {operation}</div>
        <div className={styles.output_currentOperand}>{formatOperand(currentOperand)}</div>
      </div>
      <button className={styles.spanTwo} onClick={() => dispatch({ type: ACTION.CLEAR_OUTPUT })}>AC</button>
      <button onClick={() => dispatch({ type: ACTION.REMOVE_DIGIT })}>DEL</button>
      <OperationButton dispatch={dispatch} operation="/" />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />
      <OperationButton dispatch={dispatch} operation="x" />
      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />
      <OperationButton dispatch={dispatch} operation="+" />
      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />
      <OperationButton dispatch={dispatch} operation="-" />
      <DigitButton dispatch={dispatch} digit="0" />
      <DigitButton dispatch={dispatch} digit="." />
      <button className={styles.spanTwo} onClick={() => dispatch({ type: ACTION.EVALUATE })}>=</button>



    </div>
  );
}

export default App;
