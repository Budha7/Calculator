const calcKeys = document.querySelector(".all-buttons"),
    calculator = document.querySelector(".calculator"),
    userInput = document.querySelector("#user-input"),
    displayResult = document.querySelector("#result");
let isEqualsPressed = false, equation = 0, checkForDecimal = '';

calcKeys.addEventListener('click', (e) => {
    const key = e.target;
    const keyValue = key.value;
    let inputDisplay = userInput.textContent;
    const {type} = key.dataset;
    const {previousKeyType} = calculator.dataset;

    if (type === 'number' && !isEqualsPressed) {
        if (inputDisplay === '0') {
            userInput.textContent = (previousKeyType === 'operator') ? inputDisplay + keyValue : keyValue;
            equation = (previousKeyType === 'operator') ? equation + keyValue : keyValue;
            checkForDecimal = checkForDecimal + keyValue;
        } else {
            if (checkForDecimal.length >= 19) {
                let replaceNumber = checkForDecimal;
                checkForDecimal = Number(checkForDecimal).toExponential(2);
                userInput.textContent = inputDisplay.replace(replaceNumber, checkForDecimal);
            } else {
                //check for infinity OR NaN in Display
                userInput.textContent = userInput.textContent.includes('I') ? 'Infinity' : userInput.textContent.includes('N') ? 'Infinity' : inputDisplay + keyValue;
                equation = equation + keyValue;
                checkForDecimal = checkForDecimal + keyValue;
            }
        }
    }

    /*
    1. Check if operator is pressed AND Equals To (=) is not yet pressed
    2. AND Display dose not include Infinity
    3. Replace checkForDecimal with blank to store next number
*/
    if (type === 'operator' && !isEqualsPressed && !userInput.textContent.includes('Infinity')) {
        userInput.textContent = inputDisplay + ' ' + keyValue + ' ';
        equation = equation + ' ' + keyValue + ' ';
        checkForDecimal = '';
    }
    /*
    1. Check if Decimal button is pressed AND Equals To (=) is not yet pressed
    2. AND was a previously pressed button a number or was display a 0
    3. #2 required so that if user presses decimal after operator, it is not displayed
    4. check if the number already contains a decimal
*/
    if (type === 'decimal' && (previousKeyType === 'number' || inputDisplay === '0')
        && !isEqualsPressed && !inputDisplay.includes('Infinity')) {
        if (!checkForDecimal.includes('.')) {
            userInput.textContent = inputDisplay + keyValue;
            equation = equation + key.value;
            checkForDecimal = checkForDecimal + keyValue;
        }
    }

    if ((type === 'backspace' || type === 'reset') && inputDisplay !== '0') {
        if (type === 'backspace' && !isEqualsPressed) {
            userInput.textContent = inputDisplay.substring(0, inputDisplay.length - 1);
            equation = equation.substring(0, equation.length - 1);
            checkForDecimal = checkForDecimal.substring(0, checkForDecimal.length - 1);
        } else {
            inputDisplay = '0';
            userInput.textContent = inputDisplay;
            displayResult.innerHTML = '&nbsp;';
            isEqualsPressed = false;
            equation = '';
            checkForDecimal = '';
        }

    }

    //Send equation for calculation after Equals To (=) is pressed
    if (type === 'equal') {
        // Perform a calculation
        isEqualsPressed = true;
        const finalResult = handleEquation(equation);

        if (finalResult || finalResult === 0) {
            displayResult.textContent = (!Number.isInteger(finalResult)) ? finalResult.toFixed(2) :
                (finalResult.toString().length >= 16) ? finalResult.toExponential(2) : finalResult;
        } else {
            displayResult.textContent = 'Math Error';
        }

    }

    calculator.dataset.previousKeyType = type;

});

function calculate(firstNumber, operator, secondNumber) {
    firstNumber = Number(firstNumber);
    secondNumber = Number(secondNumber);

    switch (operator) {
        case '+' || 'plus' :
            return firstNumber + secondNumber;
        case '-' || 'minus' :
            return firstNumber - secondNumber;
        case 'x' || 'multiply' :
            return firstNumber * secondNumber;
        case '/' || 'divide' :
            return firstNumber / secondNumber;
        case '%' || 'remainder' :
            return firstNumber % secondNumber;
    }
}

function handleEquation(equation) {
    // const
    equation = equation.split(' ');
    const operators = ['/', 'x', '%', '+', '-'];
    let firstNumber;
    let secondNumber;
    let operator;
    let operatorIndex;
    let result;

    /*
        1. Perform calculations as per BODMAS Method
        2. For that use operators array
        3. after calculation of 1st numbers replace them with result
        4. use splice method
    */
    operators.forEach((op) => {
        while (equation.includes(op)) {
            operatorIndex = equation.findIndex(item => item === op);
            firstNumber = equation[operatorIndex - 1];
            operator = equation[operatorIndex];
            secondNumber = equation[operatorIndex + 1];
            result = calculate(firstNumber, operator, secondNumber);
            equation.splice(operatorIndex - 1, 3, result);
        }
    });
    return result;
}


// Event Listener for keyboard button press
document.addEventListener('keydown', (e) => {
    let getOperators = {
        '/': 'divide',
        'x': 'multiply',
        '*': 'multiply',
        '%': 'remainder',
        '+': 'plus',
        '-': 'minus'
    }

    if (!isNaN(Number(e.key)) && e.key !== ' ') {
        document.getElementById(`digit-${e.key}`).click();
    }
    if (['/', 'x', '+', '-', '*', '%'].includes(e.key)) {
        document.getElementById(getOperators[e.key]).click();
    }
    if (e.key === 'Backspace' || e.key === 'c' || e.key === 'C') {
        document.getElementById('clear').click();
    }
    if (e.key === '=' || e.key === 'Enter') {
        document.getElementById('equals').click();
    }
    if (e.key === '.') {
        document.getElementById('decimal').click();
    }
})