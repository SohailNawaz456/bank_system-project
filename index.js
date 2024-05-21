#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { faker } from "@faker-js/faker";
console.log(chalk.cyanBright.italic.bold("    'Welcome to Sohailnawaz - with code ✨✨✨'"));
// Class representing a customer
class Customer {
    firstname;
    lastname;
    age;
    gender;
    mobilenumber;
    accountnumber;
    constructor(firstname, lastname, age, gender, mobilenumber, accountnumber) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.age = age;
        this.gender = gender;
        this.mobilenumber = mobilenumber;
        this.accountnumber = accountnumber;
    }
}
// Class representing a bank
class Bank {
    customer = []; // Array to store customers
    account = []; // Array to store bank accounts
    // Method to add a customer to the bank
    addCustomer(obj) {
        this.customer.push(obj);
    }
    // Method to add a bank account to the bank
    addAccount(obj) {
        this.account.push(obj);
    }
}
let myBank = new Bank();
// Create 10 customers with associated bank accounts
for (let i = 1; i <= 10; i++) {
    let firstname = faker.person.firstName("female"); // Generate a random first name
    let lastname = faker.person.lastName(); // Generate a random last name
    let num = parseInt(faker.phone.number("03#########")); // Generate a random mobile number
    const customer = new Customer(firstname, lastname, 18 + i, "female", num, 1000 + i); // Create a new customer
    myBank.addCustomer(customer); // Add the customer to the bank
    myBank.addAccount({ accountNumber: customer.accountnumber, balance: 100 * i }); // Create and add an associated bank account
}
// Function to handle repeated cash deposits
async function handleCashDeposit(bank) {
    let continueDepositing = true;
    while (continueDepositing) {
        // Prompt the user for bank account number and deposit amount
        let res = await inquirer.prompt([
            {
                type: "input",
                name: "num",
                message: "Please enter your bank account number",
            },
            {
                type: "input",
                name: "amount",
                message: "Please enter the amount to deposit",
            }
        ]);
        // Find the account corresponding to the entered account number
        let account = bank.account.find((acc) => acc.accountNumber == parseInt(res.num));
        if (!account) {
            // If account number is invalid, display an error message
            console.log(chalk.red.bold.italic("Invalid Account Number"));
        }
        else {
            // Otherwise, update the account balance and display the new balance
            account.balance += parseFloat(res.amount);
            console.log(chalk.green.bold(`You have successfully deposited $${res.amount}. Your new balance is $${account.balance}.`));
        }
        // Ask the user if they want to make another deposit
        let anotherDeposit = await inquirer.prompt({
            type: "confirm",
            name: "confirm",
            message: "Do you want to make another deposit?",
            default: false
        });
        // Update the loop condition based on the user's response
        continueDepositing = anotherDeposit.confirm;
    }
}
// Function to provide bank services
async function bankService(bank) {
    // Prompt the user to select a service
    let service = await inquirer.prompt({
        name: "select",
        type: "list",
        message: "Please select the service",
        choices: ["View Balance", "Cash Withdraw", "Cash Deposit"],
    });
    if (service.select == "View Balance") {
        // Handle 'View Balance' service
        let res = await inquirer.prompt({
            type: "input",
            name: "num",
            message: "Please enter your bank account number",
        });
        // Find the account and customer corresponding to the entered account number
        let account = bank.account.find((acc) => acc.accountNumber == parseInt(res.num));
        if (!account) {
            // If account number is invalid, display an error message
            console.log(chalk.red.bold.italic("Invalid Account Number"));
        }
        else {
            // Otherwise, display the account balance
            let name = bank.customer.find((item) => item.accountnumber == parseInt(res.num));
            console.log(`Dear ${chalk.green.italic(name?.lastname)}, your account balance is ${chalk.bold.blueBright("$" + account.balance)}`);
        }
    }
    if (service.select == "Cash Withdraw") {
        // Handle 'Cash Withdraw' service
        let res = await inquirer.prompt([
            {
                type: "input",
                name: "num",
                message: "Please enter your bank account number",
            },
            {
                type: "input",
                name: "amount",
                message: "Please enter the amount to withdraw",
            }
        ]);
        // Find the account corresponding to the entered account number
        let account = bank.account.find((acc) => acc.accountNumber == parseInt(res.num));
        if (!account) {
            // If account number is invalid, display an error message
            console.log(chalk.red.bold.italic("Invalid Account Number"));
        }
        else if (account.balance < parseFloat(res.amount)) {
            // If account balance is insufficient, display an error message
            console.log(chalk.red.bold.italic("Insufficient balance"));
        }
        else {
            // Otherwise, update the account balance and display the new balance
            account.balance -= parseFloat(res.amount);
            console.log(chalk.green.bold(`You have successfully withdrawn $${res.amount}. Your new balance is $${account.balance}.`));
        }
    }
    if (service.select == "Cash Deposit") {
        // Handle 'Cash Deposit' service by calling handleCashDeposit function
        await handleCashDeposit(bank);
    }
}
// Start the bank service
bankService(myBank);
