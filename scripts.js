let inputList = [];
const operators = ["+","-","*","/"];

function add(n1,n2){
    const r = n1+n2;
    return Math.round(r * 1000000000) / 1000000000;
}
function substract(n1,n2){
    const r = n1-n2;
    return Math.round(r * 1000000000) / 1000000000;
}
function multiply(n1,n2){
    const r = n1*n2;
    return Math.round(r * 1000000000) / 1000000000;
}
function divide(n1,n2){
    if(n2 == 0){return NaN};
    const r = n1/n2;
    return Math.round(r * 1000000000) / 1000000000;
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
    if(input.length>1){
        secondToLast = inputList[inputList.length-2];
    }
    if(inputList.length<40){
        if(!isNaN(input)){
            inputList.push(input);
        }
        else if(input == "add"){
            if(operators.includes(last) && secondToLast != "(" && !operators.includes(secondToLast)){
                inputList.pop();
                inputList.push("+");
            }
            else if(!isNaN(last) || last == ")"){
                inputList.push('+');
            }
        }
        else if(input == "substract"){
            if(last != "-" && last != "."){
                inputList.push('-');
            }
        }
        else if(input == "multiply"){
            if(operators.includes(last) && secondToLast != "(" && !operators.includes(secondToLast)){
                inputList.pop();
                inputList.push("*");
            }
            else if(!isNaN(last) || last == ")"){
                inputList.push('*');
            }
        }
        else if(input == "divide"){
            if(operators.includes(last) && secondToLast != "(" && !operators.includes(secondToLast)){
                inputList.pop();
                inputList.push("/");
            }
            else if(!isNaN(last) || last == ")"){
                inputList.push('/');
            }
        }
        else if(input == "leftParentheses"){
            if((last != "." && isNaN(last)) || operators.includes(last)){
                inputList.push('(');
            }
        }
        else if(input == "rightParentheses"){
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
        
        else if(input == "point"){
            let allowPoint = true;
            for(let i = inputList.length - 1; i >= 0; i--){
                const item = inputList[i];
                if(item == "."){
                    allowPoint = false;
                    break;
                }
                else if(operators.includes(item)){
                    allowPoint = true
                    break;
                }
            }
            if(!isNaN(last) && allowPoint){
                inputList.push('.');
            }
        }
    }
    if(input == "clear"){
        inputList.length = 0;
    }
    else if(input == "backspace"){
        inputList.pop();
    }
    else if(input == "equals" && inputList.length>0){
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
        inputList = processInput(inputList);
    }
    updateOutput();
}

function processInput(input){
    console.log(input.join(""));
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
                console.log("now it looks like: " + result);
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
                //  -12       *       34
                //       |operator|        
                // | n1|
                //                   |n2|
                // 
                // operate(n1,n2,operator)
                for(let j = i-1; j >= 0;j--){
                    if(j==0){
                        n1LeftIndex = j;
                        break;
                    }
                    else if(operators.includes(result[j])){
                        if(result[j] == "-"){
                            // if symbol before - is operator, include - to number
                            if(isNan(result[j-1])){
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
                console.log("n1 indexes: ",n1LeftIndex,n1RightIndex);
                n1 = Number(result.slice(n1LeftIndex,n1RightIndex+1).join(""));
                console.log("n1: "+n1);

                console.log("n2 indexes: ",n2LeftIndex,n2RightIndex);
                n2 = Number(result.slice(n2LeftIndex,n2RightIndex+1).join(""));
                console.log("n2: "+n2);

                subResult = operate(n1,n2,operator);
                console.log("subResult: "+subResult);

                const arrayEnd = result.slice(n2RightIndex+1);
                console.log("part after result: "+arrayEnd);
                
                if(n1LeftIndex>1){
                    result = result.slice(0, n1LeftIndex);
                }
                else {
                    result = [];
                }
                console.log("part before result: "+result);

                result = result.concat(subResult);
                console.log("result with start: "+result);

                result = result.concat(arrayEnd);
                console.log("result with end: "+result);

                i = n1LeftIndex;
                console.log("new i index: ",i);
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
                //  -12       +       34
                //       |operator|        
                // | n1|
                //                   |n2|
                // 
                // operate(n1,n2,operator)
                for(let j = i-1; j >= 0;j--){
                    if(j==0){
                        n1LeftIndex = j;
                        break;
                    }
                    else if(operators.includes(result[j])){
                        if(result[j] == "-"){
                            // if symbol before - is operator, include - to number
                            if(isNan(result[j-1])){
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

                console.log("n1 indexes: ",n1LeftIndex,n1RightIndex);
                n1 = Number(result.slice(n1LeftIndex,n1RightIndex+1).join(""));
                console.log("n1: "+n1);

                console.log("n2 indexes: ",n2LeftIndex,n2RightIndex);
                n2 = Number(result.slice(n2LeftIndex,n2RightIndex+1).join(""));
                console.log("n2: "+n2);

                subResult = operate(n1,n2,operator);
                console.log("subResult: "+subResult);

                const arrayEnd = result.slice(n2RightIndex+1);
                console.log("part after result: "+arrayEnd);
                
                if(n1LeftIndex>1){
                    result = result.slice(0, n1LeftIndex-1);
                }
                else {
                    result = [];
                }
                console.log("part before result: "+result);

                result = result.concat(subResult);
                console.log("result with start: "+result);

                result = result.concat(arrayEnd);
                console.log("result with end: "+result);

                i = n1LeftIndex;
                console.log("new i index: ",i);
            }
        }
    }
    console.log("return result: ",result.join(""));
    console.log("reduce depth");
    return result;
}

function updateOutput(){
    if(inputList.length>=33){
        document.getElementById("output").style.fontSize = 10 + "px";
    }
    else if(inputList.length>=28){
        document.getElementById("output").style.fontSize = 12 + "px";
    }
    else if(inputList.length>=23){
        document.getElementById("output").style.fontSize = 15 + "px";
    }
    else if(inputList.length>=18){
        document.getElementById("output").style.fontSize = 17 + "px";
    }
    else if(inputList.length<18){
        document.getElementById("output").style.fontSize = 22 + "px";
    }
    document.getElementById("output").innerHTML = inputList.join("");
    
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

const buttonPoint = document.querySelector('#point');
const buttonBackspace = document.querySelector('#backspace');
const buttonEquals = document.querySelector('#equals');
const buttonClear = document.querySelector('#clear');
const buttonLeftParentheses = document.querySelector('#leftParentheses');
const buttonRightParentheses = document.querySelector('#rightParentheses');

buttonAdd.addEventListener("click", function(){storeInput("add"); });
buttonSubstract.addEventListener("click", function(){storeInput("substract"); });
buttonMultiply.addEventListener("click", function(){storeInput("multiply"); });
buttonDivide.addEventListener("click", function(){storeInput("divide"); });

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

buttonPoint.addEventListener("click", function(){storeInput("point"); });
buttonBackspace.addEventListener("click", function(){storeInput("backspace"); });
buttonEquals.addEventListener("click", function(){storeInput("equals"); });
buttonClear.addEventListener("click", function(){storeInput("clear"); });
buttonLeftParentheses.addEventListener("click", function(){storeInput("leftParentheses"); });
buttonRightParentheses.addEventListener("click", function(){storeInput("rightParentheses"); });