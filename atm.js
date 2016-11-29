/**
 *   @author Johnson, Anne (johnson.anne07@gmail.com)
 *   @version 0.0.0
 *   @summary ATM || created: 11.16.2016
 *   @todo
 */


"use strict";
const PROMPT = require('readline-sync');
const IO = require('fs');  // For file I/O
const CARD_NUMBER = 0, PIN = 1, NUM_ACCOUNTS = 4, CHECKING_BALANCE = 5, SAVINGS_BALANCE = 6, VIEW = 1, WITHDRAW = 2, DEPOSIT = 3, CHECKING_ACCOUNT_ONLY = 1, TRANSFER = 4;

let cardNumber, pin, whichChoice, temp, whichAccount, thing, deposit, withdraw, transfer;
let accounts = [];
let currentUser = [];
let continueResponse;

function main() {
    continueResponse = 1;
    populateAccounts();
    while (continueResponse === 1) {
        whichChoice = -1;
        setCardNumber();
        setCurrentUser();
        setPIN();
        setUserMenu();
        setUserAction();
        if (whichChoice === VIEW) {
            displayBalance();
            setContinueResponse();
        } else if (whichChoice === WITHDRAW) {
            setWithdraw();
            setContinueResponse();
        } else if (whichChoice === DEPOSIT) {
            setDeposit();
            setContinueResponse();
        } else {
            setTransfer();
            setContinueResponse();
        }
        writeUserData();
    }
}

main();

function setContinueResponse() {
    if (continueResponse) {
        continueResponse = -1;
        while (continueResponse !== 0 && continueResponse !== 1) {
            continueResponse = Number(PROMPT.question(`\nDo you want to continue? [0=no, 1=yes]: `));
        }
    } else {
        continueResponse = 1;
    }
}

function populateAccounts() {
    let fileContents = IO.readFileSync(`data.csv`, 'utf8');
    let lines = fileContents.toString().split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        accounts.push(lines[i].toString().split(/,/));
    }
}

function setCardNumber() {
    const CARD_NUMBER = 0;
    let found = 0;
    while (cardNumber == null || !/^[0-9]{4}$/.test(cardNumber)) {
        cardNumber = PROMPT.question(`\n Please enter your four-digit card number: `);
    }
    for (let i = 0; i < accounts.length; i++) {
        if (cardNumber === accounts[i][CARD_NUMBER]) {
            found = 1;
            break;
        }
    }
    if (found === 0) {
        return setCardNumber();
    }
}

function setCurrentUser() {
    for(let i = 0; i < accounts.length; i++) {
        if(cardNumber == accounts[i][CARD_NUMBER]) {
            currentUser = accounts[i];
        }
    }
}

function setPIN() {
    const PIN = 1, WRONG_PIN = -1;
    while (pin == null || !/^[0-9]{3}$/.test(pin)) {
        pin = PROMPT.question(`\n Please enter your three-digit PIN: `);
    }
    if (pin !== currentUser[PIN]) {
        pin = WRONG_PIN
        return setPIN();
    }
}

function setUserMenu() {
    if (accounts[NUM_ACCOUNTS] == CHECKING_ACCOUNT_ONLY) {
        console.log(`\n1: View account balance \n2: Withdraw money \n3: Deposit money`);
    } else {
        console.log(`\n1: View account balance \n2: Withdraw money \n3: Deposit money \n4: Transfer money`);
    }
}

function setUserAction() {
    while (whichChoice == null || isNaN(whichChoice) ||(whichChoice != VIEW && whichChoice != WITHDRAW && whichChoice != DEPOSIT && whichChoice != TRANSFER)) {
    whichChoice = Number(PROMPT.question(`\nWhat task would you like to do? `));
    }
}

function displayBalance() {
    if (whichChoice === VIEW) {
        if (currentUser[NUM_ACCOUNTS] == CHECKING_ACCOUNT_ONLY) {
            console.log(` Your checking balance is: ${currentUser[CHECKING_BALANCE]}`);
        } else {
            console.log(` Your checking balance is: ${currentUser[CHECKING_BALANCE]}`);
            console.log(` Your savings balance is: ${currentUser[SAVINGS_BALANCE]}`);
        }
    }
}

function setWithdraw() {
    if (currentUser[NUM_ACCOUNTS] === CHECKING_ACCOUNT_ONLY) {
        withdraw = Number(PROMPT.question(`\nHow much money would you like to withdraw from your checking account? `));
        currentUser[CHECKING_BALANCE] = currentUser[CHECKING_BALANCE] - withdraw;
    } else {
        whichAccount = Number(PROMPT.question(`Which account would you like to withdraw from, checking (1), or savings (2)? `));
        withdraw = Number(PROMPT.question(`How much money would you like to withdraw? `));
        if (whichAccount === 1) {
            currentUser[CHECKING_BALANCE] = currentUser[CHECKING_BALANCE] - withdraw;
        } else {
            currentUser[SAVINGS_BALANCE] = currentUser[SAVINGS_BALANCE] - withdraw;
        }
    }
}

function setDeposit() {
    if (currentUser[NUM_ACCOUNTS] === CHECKING_ACCOUNT_ONLY) {
        deposit = Number(PROMPT.question(`\nHow much would you like to deposit into your checking account?`));
        currentUser[CHECKING_BALANCE] = currentUser[CHECKING_BALANCE] + deposit;
    } else {
        whichAccount = Number(PROMPT.question(`\nWhich account would you like to deposit into, checking (1), or savings (2)? `));
        deposit = Number(PROMPT.question(`How much money would you like to deposit?`));
        if (whichAccount === 1) {
            currentUser[CHECKING_BALANCE] = parseInt(currentUser[CHECKING_BALANCE]) + parseInt(deposit);
        } else {
            currentUser[SAVINGS_BALANCE] = parseInt(currentUser[SAVINGS_BALANCE]) + parseInt(deposit);
        }
    }
}

function setTransfer() {
    let transferAmount;
    transfer = Number(PROMPT.question(`\nWould you like to 1) transfer from savings to checking, or 2) transfer from checkings to savings?`));
    if (transfer === 1) {
        transferAmount = Number(PROMPT.question(`\nHow much would you like to move from your savings to your checkings?`));
        currentUser[CHECKING_BALANCE] = currentUser[CHECKING_BALANCE] + transferAmount;
        currentUser[SAVINGS_BALANCE] = currentUser[SAVINGS_BALANCE] - transferAmount;
    } else {
        transferAmount = Number(PROMPT.question(`\nHow much would you like to move from your checkings to your savings?`));
        currentUser[CHECKING_BALANCE] = currentUser[CHECKING_BALANCE] - transferAmount;
        currentUser[SAVINGS_BALANCE] = currentUser[SAVINGS_BALANCE] + transferAmount;
    }
}

function writeUserData() {
    let userData = "";
    for (let i = 0; i < currentUser.length; i++) {
        if (i < currentUser.length -1) {
            userData += currentUser[i] + ",";
        } else {
            userData += currentUser[i];
        }
    }
    
    console.log(userData);
    let data = IO.readFileSync('data.csv', 'utf8');
    let result = data.replace(new RegExp('^' + userData.slice(0, 4) + '.*'), userData);
    IO.writeFileSync('data.csv', result, 'utf8');
}