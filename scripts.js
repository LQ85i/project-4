let inputList = [];
const operators = ["+","-","*","/"];
let resultOnScreen = false;
const maxOutputLength = 40;
const decimalPrecision = 1000000;

function add(n1,n2){
    const r = n1+n2;
    return Math.round(r * decimalPrecision) / decimalPrecision;
}
function substract(n1,n2){
    const r = n1-n2;
    return Math.round(r * decimalPrecision) / decimalPrecision;
}
function multiply(n1,n2){
    const r = n1*n2;
    return Math.round(r * decimalPrecision) / decimalPrecision;
}
function divide(n1,n2){
    if(n2 == 0){return NaN};
    const r = n1/n2;
    return Math.round(r * decimalPrecision) / decimalPrecision;
}

function operate(n1,n2,operator) {
    if (operator == "+"){
        return add(n1,n2);
    }
    else if (operator == "-"){
        return substract(n1,n2);
    }
    else if (operator == "*"){
        return multiply(n1,n2);
    }
    else if (operator == "/"){
        return divide(n1,n2);
    }
}

function storeInput(input){
    let last = inputList[inputList.length-1];
    let secondToLast = null;
    if(inputList.length>1){
        secondToLast = inputList[inputList.length-2];
    }
    const outputLength = inputList.join("").toString().length;
    if(outputLength<=maxOutputLength){
        if(!isNaN(input)){
            if(resultOnScreen){
                inputList = [];
            }
            inputList.push(input);
            resultOnScreen = false;
        }
        else if(input == "pi"){
            inputList.push("π");
            resultOnScreen = false;
        }
        else if(input == "+"){
            if(operators.includes(last) && secondToLast != "(" && !operators.includes(secondToLast)){
                inputList.pop();
                inputList.push("+");
                resultOnScreen = false;
            }
            else if(!isNaN(last) || last == ")" || last == "π"){
                inputList.push('+');
                resultOnScreen = false;
            }
            
        }
        else if(input == "-"){
            if(last != "-" && last != "."){
                inputList.push('-');
                resultOnScreen = false;
            }
        }
        else if(input == "*"){
            if(operators.includes(last) && secondToLast != "(" && !operators.includes(secondToLast)){
                inputList.pop();
                inputList.push("*");
                resultOnScreen = false;
            }
            else if(!isNaN(last) || last == ")" || last == "π"){
                inputList.push('*');
                resultOnScreen = false;
            }
        }
        else if(input == "/"){
            if(operators.includes(last) && secondToLast != "(" && !operators.includes(secondToLast)){
                inputList.pop();
                inputList.push("/");
                resultOnScreen = false;
            }
            else if(!isNaN(last) || last == ")" || last == "π"){
                inputList.push('/');
                resultOnScreen = false;
            }
        }
        else if(input == "("){
            if((last != "." && (isNaN(last) && last != "π")) || operators.includes(last)){
                inputList.push('(');
            }
        }
        else if(input == ")"){
            let left = 0;
            let right = 0;
            for(let i = 0; i < inputList.length; i++){
                if(inputList[i] == "("){
                    left++;
                }
                else if(inputList[i] == ")"){
                    right++;
                }
            }
            if(left > right){
                inputList.push(')');
            }
        }
        
        else if(input == "."){
            let allowPoint = true;
            for(let i = inputList.length - 1; i >= 0; i--){
                const item = inputList[i];
                if(item == "."){
                    allowPoint = false;
                    break;
                }
                else if(operators.includes(item)){
                    allowPoint = true;
                    break;
                }
            }
            if(resultOnScreen){
                allowPoint = false;
            }
            if(!isNaN(last) && allowPoint){
                inputList.push('.');
            }
        }
    }
    if(input == "clear"){
        inputList.length = 0;
        resultOnScreen = false;
    }
    else if(input == "backspace"){
        inputList.pop();
        resultOnScreen = false;
    }
    else if(input == "=" && inputList.length>0){
        while(operators.includes(last) || last == "." || last == "("){
            inputList.pop();
            last = inputList[inputList.length-1];
        }
        let left = 0;
        let right = 0;
        for(let i = 0; i < inputList.length; i++){
            if(inputList[i] == "("){
                left++;
            }
            else if(inputList[i] == ")"){
                right++;
            }
        }
        while(right < left){
            inputList.push(')');
            right++;
        }
        for(let i = 0; i < inputList.length; i++){
            if(inputList[i] == "π"){
                inputList[i] = Math.PI;
                if(i != 0){
                    if(!isNaN(inputList[i-1])){
                        inputList.splice(i,0,"*");
                        continue;
                    }
                }
                if(i != inputList.length-1){
                    if(!isNaN(inputList[i+1])){
                        inputList.splice(i+1,0,"*");
                    }
                }
            }
        }
        inputList = processInput(inputList);
        resultOnScreen = true;
    }
    updateOutput();
}

function processInput(input){
    let result = input;
    // compute parentheses here
    if(input.includes("(")){
        for(let i = 0; i < input.length;i++){
            if(input[i] == "("){
                let depth = 1;
                let leftIndex = i+1;
                let j = i+1;
                while(depth > 0 && j < input.length){
                    if(input[j] == "("){
                        depth++;
                    }
                    else if(input[j] == ")"){
                        depth--;
                    }
                    j++;
                }
                let rightIndex = j-1;
                const subInput = input.slice(leftIndex,rightIndex);
                const arrayEnd = result.slice(rightIndex+1);
                result = result.slice(0, leftIndex-1);
                result = result.concat(processInput(subInput));
                result = result.concat(arrayEnd);
                i = j+1;
            }
        }
    }
    // compute * and / here
    if(result.includes("*") || result.includes("/")){
        let n1LeftIndex = null;
        let n1RightIndex = null;
        let n2LeftIndex = null;
        let n2RightIndex = null;
        let n1 = null;
        let n2 = null;
        let operator = null;
        for(let i = 0; i < result.length;i++){
            if(result[i] == "*" || result[i] == "/"){
                n1RightIndex = i-1;
                n2LeftIndex = i+1;
                operator = result[i];
                for(let j = i-1; j >= 0;j--){
                    if(j==0){
                        n1LeftIndex = j;
                        break;
                    }
                    else if(operators.includes(result[j])){
                        if(result[j] == "-"){
                            // if symbol before - is operator, include - to number
                            if(isNaN(result[j-1])){
                                n1LeftIndex = j;
                                break;
                            }
                            else {
                                n1LeftIndex = j+1;
                                break;
                            }
                        }
                        else{
                            n1LeftIndex = j+1;
                            break;
                        }
                    }
                    else if(result[j] == "."){
                        continue;
                    }
                }
                for(let j = i+1; j < result.length;j++){
                    if(j == result.length - 1){
                        n2RightIndex = j;
                        break;
                    }
                    else if(operators.includes(result[j])){
                        if(result[j]=="-" && j == i+1){
                            continue;
                        }
                        n2RightIndex = j-1;
                        break;
                    }
                }
                n1 = Number(result.slice(n1LeftIndex,n1RightIndex+1).join(""));
                n2 = Number(result.slice(n2LeftIndex,n2RightIndex+1).join(""));
                subResult = operate(n1,n2,operator);
                const arrayEnd = result.slice(n2RightIndex+1);
                if(n1LeftIndex>1){
                    result = result.slice(0, n1LeftIndex);
                }
                else {
                    result = [];
                }
                result = result.concat(subResult);
                result = result.concat(arrayEnd);
                i = n1LeftIndex;
            }
        }
    }
    // compute + and - here
    if(result.includes("+") || result.includes("-")){
        let n1LeftIndex = null;
        let n1RightIndex = null;
        let n2LeftIndex = null;
        let n2RightIndex = null;
        let n1 = null;
        let n2 = null;
        let operator = null;
        for(let i = 0; i < result.length;i++){
            if(result[i] == "+" || result[i] == "-"){
                n1RightIndex = i-1;
                n2LeftIndex = i+1;
                operator = result[i];
                for(let j = i-1; j >= 0;j--){
                    if(j==0){
                        n1LeftIndex = j;
                        break;
                    }
                    else if(operators.includes(result[j])){
                        if(result[j] == "-"){
                            // if symbol before - is operator, include - to number
                            if(isNaN(result[j-1])){
                                n1LeftIndex = j;
                                break;
                            }
                            else {
                                n1LeftIndex = j+1;
                                break;
                            }
                        }
                        else{
                            n1LeftIndex = j+1;
                            break;
                        }
                    }
                }
                for(let j = i+1; j < result.length;j++){
                    if(j == result.length - 1){
                        n2RightIndex = j;
                        break;
                    }
                    else if(operators.includes(result[j])){
                        n2RightIndex = j-1;
                        break;
                    }
                }
                n1 = Number(result.slice(n1LeftIndex,n1RightIndex+1).join(""));
                n2 = Number(result.slice(n2LeftIndex,n2RightIndex+1).join(""));
                subResult = operate(n1,n2,operator);
                const arrayEnd = result.slice(n2RightIndex+1);
                if(n1LeftIndex>1){
                    result = result.slice(0, n1LeftIndex-1);
                }
                else {
                    result = [];
                }
                result = result.concat(subResult);
                result = result.concat(arrayEnd);
                i = n1LeftIndex;
            }
        }
    }
    return result;
}
function updateOutput(){
    const output = inputList.join("");
    if(output.length>=maxOutputLength){
        document.getElementById("output").style.fontSize = 8 + "px";
    }
    else if(output.length>=33){
        document.getElementById("output").style.fontSize = 10 + "px";
    }
    else if(output.length>=28){
        document.getElementById("output").style.fontSize = 12 + "px";
    }
    else if(output.length>=23){
        document.getElementById("output").style.fontSize = 15 + "px";
    }
    else if(output.length>=18){
        document.getElementById("output").style.fontSize = 17 + "px";
    }
    else if(output.length<18){
        document.getElementById("output").style.fontSize = 22 + "px";
    }
    document.getElementById("output").innerHTML = output;
    
}

const buttonAdd = document.querySelector('#add');
const buttonSubstract = document.querySelector('#substract');
const buttonMultiply = document.querySelector('#multiply');
const buttonDivide = document.querySelector('#divide');

const button0 = document.querySelector('#zero');
const button1 = document.querySelector('#one');
const button2 = document.querySelector('#two');
const button3 = document.querySelector('#three');
const button4 = document.querySelector('#four');
const button5 = document.querySelector('#five');
const button6 = document.querySelector('#six');
const button7 = document.querySelector('#seven');
const button8 = document.querySelector('#eight');
const button9 = document.querySelector('#nine');
const buttonPi = document.querySelector('#pi');

// Force Enter key to always submit 'Equals' button 
const buttons = document.querySelectorAll('button');
buttons.forEach(
    function(item){
        item.addEventListener('keydown', (e) => {
            if(e.key === 'Enter'){
                e.preventDefault();
            }
        });
    }
)

const buttonPoint = document.querySelector('#point');
const buttonBackspace = document.querySelector('#backspace');
const buttonEquals = document.querySelector('#equals');
const buttonClear = document.querySelector('#clear');
const buttonLeftParentheses = document.querySelector('#leftParentheses');
const buttonRightParentheses = document.querySelector('#rightParentheses');

buttonAdd.addEventListener("click", function(){storeInput("+"); });
buttonSubstract.addEventListener("click", function(){storeInput("-"); });
buttonMultiply.addEventListener("click", function(){storeInput("*"); });
buttonDivide.addEventListener("click", function(){storeInput("/"); });

button0.addEventListener("click", function(){storeInput(0); });
button1.addEventListener("click", function(){storeInput(1); });
button2.addEventListener("click", function(){storeInput(2); });
button3.addEventListener("click", function(){storeInput(3); });
button4.addEventListener("click", function(){storeInput(4); });
button5.addEventListener("click", function(){storeInput(5); });
button6.addEventListener("click", function(){storeInput(6); });
button7.addEventListener("click", function(){storeInput(7); });
button8.addEventListener("click", function(){storeInput(8); });
button9.addEventListener("click", function(){storeInput(9); });
buttonPi.addEventListener("click", function(){storeInput("pi"); });

document.addEventListener('keydown',(event) => {
let name = event.key;
let code = event.code;
event = event || window.event;
if(!isNaN(name)){
    storeInput(name);
}
else if(operators.includes(name)){
    storeInput(name);
}
else if(event.code == "Digit8" && event.shiftKey){
    storeInput("(");
}
else if(event.code == "Digit9" && event.shiftKey){
    storeInput(")");
}
else if(name == "Enter"){
    storeInput("=");
}
else if(name == "Backspace"){
    storeInput("backspace");
}
else if(name == ","){
    storeInput(".");
}
else if(name == 'Delete'){
    storeInput('clear');
} 
}, false);

buttonPoint.addEventListener("click", function(){storeInput("."); });
buttonBackspace.addEventListener("click", function(){storeInput("backspace"); });
buttonEquals.addEventListener("click", function(){storeInput("="); });
buttonClear.addEventListener("click", function(){storeInput("clear"); });
buttonLeftParentheses.addEventListener("click", function(){storeInput("("); });
buttonRightParentheses.addEventListener("click", function(){storeInput(")"); });