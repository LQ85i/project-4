const inputList = [];

function operate(n1,n2,operator) {
    if (operator = "add"){
        add(n1,n2);
    }
    else if (operator = "subtract"){
        substract(n1,n2);
    }
    else if (operator = "multiply"){
        multiply(n1,n2);
    }
    else if (operator = "divide"){
        divide(n1,n2);
    }
}

function add(n1,n2){
    return n1 + n2;
}
function substract(n1,n2){
    return n1 - n2;
}
function multiply(n1,n2){
    return n1 * n2;
}
function divide(n1,n2){
    if(n2 == 0){return "ERROR: Division by zero"};
    return n1 / n2;
}

function storeInput(input){
    if(inputList.length<40){
        if(!isNaN(input)){
            inputList.push(input);
        }
        else if(input == "add"){
            if(!isNaN(inputList[inputList.length-1])){
                inputList.push('+');
            }
        }
        else if(input == "substract"){
            if(inputList[inputList.length-1] != "-"){
                inputList.push('-');
            }
        }
        else if(input == "multiply"){
            if(!isNaN(inputList[inputList.length-1])){
                inputList.push('*');
            }
        }
        else if(input == "divide"){
            if(!isNaN(inputList[inputList.length-1])){
                inputList.push('/');
            }
        }
        else if(input == "leftParentheses"){
            inputList.push('(');
        }
        else if(input == "rightParentheses"){
            inputList.push(')');
        }
        
        else if(input == "point"){
            if(!inputList.includes('.') && !isNaN(inputList[inputList.length-1])){
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
    
    processInput();
    updateOutput();
}

function processInput(){
    return;
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