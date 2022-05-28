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

const additionButton = document.querySelector('.operator #add');
const substractButton = document.querySelector('.operator #substract');
const multiplyButton = document.querySelector('.operator #multiply');
const divideButton = document.querySelector('.operator #divide');