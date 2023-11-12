import { useState } from "react";
import "./App.css";
function App() {
  const [displayValue, setDisplayValue] = useState("0");
  const [clickedDecimalFlag, setClickedDecimalFlag] = useState(false);
  const [clickedOpeartorFlag, setClickedOpeartorFlag] = useState(false);
  const buttons = [
    ["AC", "( )", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "⬅︎", "="],
  ];
  const toPercent = (number) => {
    let percent;
    percent = Number(number) * 100;
    percent += "%";
    return percent;
  };
  const isPercentAble = (expression) => {
    //假如匹配中运算符不可百分比
    const operators = ["+", "-", "*", "/"];

    if (operators.includes(expression)) {
      return false;
    } else if (expression.match(/[%]/)) {
      return false;
    } else {
      return true;
    }
  };

  const calculate = (expression) => {
    let result;
    const splitString = (expression) => {
      const operators = ["+", "-", "*", "/"];
      const numbers = [];
      let currentNumber = "";
      for (let index = 0; index < expression.length; index++) {
        // if (!isFinite(displayValue[index])) {
        //   console.log("第一位不是数字");
        //   continue;
        // }
        // console.log("第" + index + 1 + "次循环");
        const element = expression[index];
        if (operators.includes(element) || index === expression.length - 1) {
          if (index === expression.length - 1) {
            currentNumber += element;
          }
          numbers.push(currentNumber);
          //存入数组后清空currentNumber
          currentNumber = "";
        } else {
          currentNumber += element;
        }
      }
      return numbers;
    };
    // const numbers = expression.split(/[+*-/]/);
    const numbers = splitString(expression);
    const tokens = expression.match(/[+\-*/]/g);
    console.log("numbers-->", numbers);
    console.log("tokens-->", tokens);

    for (let index = 0; index < tokens.length; index++) {
      //split的返回值是是字符串需要转为number类型
      const firstNumber = +numbers.shift();
      const secondNumber = +numbers.shift();
      switch (tokens[index]) {
        case "+":
          numbers.unshift(firstNumber + secondNumber);
          break;
        case "-":
          numbers.unshift(firstNumber - secondNumber);
          break;
        case "*":
          numbers.unshift(firstNumber * secondNumber);
          break;
        case "/":
          numbers.unshift(firstNumber / secondNumber);
          break;

        default:
          console.log("error");
          break;
      }
    }

    result = parseFloat(numbers[0]).toFixed(3);
    //假如为0删除最后一位

    // while (result[result.length - 1] === "0") {
    //   console.log("删除最后一位");
    //   // result = result.slice(0, result.length - 1);
    // }
    result = result.slice(0, result.length - 1);

    return result;
  };
  const isClickable = (button) => {
    const operators = ["+", "-", "*", "/"];
    let isIncludedOpeartor;
    displayValue.split("").forEach((item) => {
      if (operators.includes(item)) {
        isIncludedOpeartor = true;
      }
    });
    switch (button) {
      case ".":
        return clickedDecimalFlag ? false : true;
      case "=":
        if (
          isFinite(displayValue[displayValue.length - 1]) &&
          isIncludedOpeartor
        ) {
          return true;
        } else {
          return false;
        }
      case "%":
        return isPercentAble(displayValue);
      default:
        return true;
    }
  };

  const clickButtonHandler = (button) => {
    switch (button) {
      case "AC":
        setDisplayValue("");
        //假如重置计算器允许点击小数点
        setClickedDecimalFlag(false);
        break;
      case "⬅︎":
        setDisplayValue(displayValue.slice(0, displayValue.length - 1));
        break;
      case "%":
        setDisplayValue(toPercent(displayValue));
        break;
      case ".":
        if (!clickedDecimalFlag) {
          if (displayValue.length === 0) {
            setDisplayValue("0.");
            setClickedDecimalFlag(true);

            return;
          }
          setClickedDecimalFlag(true);
          setDisplayValue(displayValue + button);
        }
        break;
      case "×":
        if (!clickedOpeartorFlag) {
          setDisplayValue(displayValue + "*");
          setClickedOpeartorFlag(true);

          setClickedDecimalFlag(false);
        } else {
          setDisplayValue(
            displayValue.replace(displayValue[displayValue.length - 1], "*")
          );
        }

        break;
      case "÷":
        if (!clickedOpeartorFlag) {
          setDisplayValue(displayValue + "/");
          setClickedOpeartorFlag(true);
          //设置小数点可点击？
          setClickedDecimalFlag(false);
        } else {
          setDisplayValue(
            displayValue.replace(displayValue[displayValue.length - 1], "÷")
          );
        }
        break;
      case "-":
        if (!clickedOpeartorFlag) {
          setDisplayValue(displayValue + "-");
          setClickedOpeartorFlag(true);
          setClickedDecimalFlag(false);
        } else {
          setClickedDecimalFlag(false);
          setDisplayValue(
            displayValue.replace(displayValue[displayValue.length - 1], "-")
          );
        }
        break;
      case "+":
        if (!clickedOpeartorFlag) {
          setDisplayValue(displayValue + "+");
          setClickedOpeartorFlag(true);
          setClickedDecimalFlag(false);
        } else {
          setClickedDecimalFlag(false);
          setDisplayValue(
            displayValue.replace(displayValue[displayValue.length - 1], "+")
          );
        }
        break;
      case "=":
        setDisplayValue(calculate(displayValue));
        break;
      default:
        setClickedOpeartorFlag(false);
        setDisplayValue(displayValue + button);
    }
  };

  return (
    <div
      className="Caculator  bg-slate-50 p-4 rounded-md"
      style={{ width: "22rem" }}
    >
      <h1
        className="max-h-60 bg-slate-300 text-5xl text-end  p-4  rounded-m "
        style={{
          wordBreak: "break-all",
          maxWidth: "100%",
          // overflow: "hidden",
          // maxWidth: "25vw",
        }}
      >
        {displayValue
          ? displayValue
              .toString()
              .split("")
              .map((char) => {
                if (char === "*") {
                  return "×";
                } else if (char === "/") {
                  return "÷";
                } else {
                  return char;
                }
              })
          : "0"}
      </h1>
      <div className=" ">
        {buttons.map((row, index) => {
          return (
            <div key={index} className="row">
              {row.map((button, index) => {
                return (
                  <button
                    className="  font-light w-20 h-20 rounded-full text-4xl active:backdrop-brightness-75  "
                    key={index}
                    disabled={!isClickable(button)}
                    onClick={() => {
                      clickButtonHandler(button);
                    }}
                  >
                    {button}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
