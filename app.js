const fs = require("fs");
const readlineSync = require("readline-sync");

// Check if the database file exists, if not, create an empty one
const databaseFile = "database.json";
if (!fs.existsSync(databaseFile)) {
  fs.writeFileSync(databaseFile, "[]");
}

// Function to read accounts from the JSON file
function loadAccounts() {
  const data = fs.readFileSync(databaseFile);
  return JSON.parse(data);
}

// Function to save accounts to the JSON file
function saveAccounts(accounts) {
  const data = JSON.stringify(accounts, null, 2);
  fs.writeFileSync(databaseFile, data);
}

// Function to generate a unique 6-digit account number
function generateAccountNumber() {
  let accountNumber;
  do {
    accountNumber = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
  } while (accounts.some((account) => account.accountNumber === accountNumber)); // Ensure uniqueness
  return accountNumber;
}

// Function to get current timestamp
function getCurrentTimestamp() {
  return new Date().toISOString();
}

// Initialize accounts from the JSON file
let accounts = loadAccounts();

// Function to create a new account
function createAccount() {
  const name = readlineSync.question("Enter your name: ");
  const initialBalance = parseFloat(
    readlineSync.question("Enter initial balance: ")
  );
  const accountNumber = generateAccountNumber();
  const timestamp = getCurrentTimestamp();
  const account = {
    accountNumber: accountNumber,
    name: name,
    balance: initialBalance,
    transactions: [
      {
        timestamp: timestamp,
        action: "Account created",
        amount: initialBalance,
      },
    ],
  };
  accounts.push(account);
  saveAccounts(accounts);
  console.log(
    `Account created successfully for ${name} with account number ${accountNumber} and initial balance ${initialBalance}`
  );
}

// Function to find an account by account number
function findAccountByNumber(accountNumber) {
  return accounts.find((account) => account.accountNumber === accountNumber);
}

// Function to update account balance based on transactions
function updateBalance(account) {
  account.balance = account.transactions.reduce((total, transaction) => {
    if (transaction.action.startsWith("Deposit")) {
      return total + transaction.amount;
    } else if (transaction.action.startsWith("Withdrawal")) {
      return total - transaction.amount;
    } else if (transaction.action.startsWith("Transfer to")) {
      return total - transaction.amount;
    } else if (transaction.action.startsWith("Transfer from")) {
      return total + transaction.amount;
    }
    return total;
  }, 0);
}

// Function to deposit funds into an account
function deposit() {
  const accountNumber = parseInt(
    readlineSync.question("Enter account number: ")
  );
  const account = findAccountByNumber(accountNumber);
  if (account) {
    const amount = parseFloat(readlineSync.question("Enter deposit amount: "));
    if (!isNaN(amount) && amount > 0) {
      const timestamp = getCurrentTimestamp();
      account.transactions.push({
        timestamp: timestamp,
        action: "Deposit",
        amount: amount,
      });
      updateBalance(account);
      saveAccounts(accounts);
      console.log(
        `Deposited ${amount} into account with account number ${accountNumber}. New balance: ${account.balance}`
      );
    } else {
      console.log("Invalid deposit amount.");
    }
  } else {
    console.log("Account not found.");
  }
}

// Function to withdraw funds from an account
function withdraw() {
  const accountNumber = parseInt(
    readlineSync.question("Enter account number: ")
  );
  const account = findAccountByNumber(accountNumber);
  if (account) {
    const amount = parseFloat(
      readlineSync.question("Enter withdrawal amount: ")
    );
    if (!isNaN(amount) && amount > 0 && amount <= account.balance) {
      const timestamp = getCurrentTimestamp();
      account.transactions.push({
        timestamp: timestamp,
        action: "Withdrawal",
        amount: amount,
      });
      updateBalance(account);
      saveAccounts(accounts);
      console.log(
        `Withdrawn ${amount} from account with account number ${accountNumber}. New balance: ${account.balance}`
      );
    } else {
      console.log("Invalid withdrawal amount or insufficient funds.");
    }
  } else {
    console.log("Account not found.");
  }
}

// Function to transfer funds between accounts
function transfer() {
  const senderAccountNumber = parseInt(
    readlineSync.question("Enter sender's account number: ")
  );
  const senderAccount = findAccountByNumber(senderAccountNumber);
  if (senderAccount) {
    const receiverAccountNumber = parseInt(
      readlineSync.question("Enter receiver's account number: ")
    );
    const receiverAccount = findAccountByNumber(receiverAccountNumber);
    if (receiverAccount) {
      const amount = parseFloat(
        readlineSync.question("Enter transfer amount: ")
      );
      if (!isNaN(amount) && amount > 0 && amount <= senderAccount.balance) {
        const timestamp = getCurrentTimestamp();
        senderAccount.transactions.push({
          timestamp: timestamp,
          action: "Transfer to " + receiverAccountNumber,
          amount: amount,
        });
        receiverAccount.transactions.push({
          timestamp: timestamp,
          action: "Transfer from " + senderAccountNumber,
          amount: amount,
        });
        updateBalance(senderAccount);
        updateBalance(receiverAccount);
        saveAccounts(accounts);
        console.log(
          `Transferred ${amount} from account with account number ${senderAccountNumber} to account with account number ${receiverAccountNumber}`
        );
      } else {
        console.log("Invalid transfer amount or insufficient funds.");
      }
    } else {
      console.log("Receiver account not found.");
    }
  } else {
    console.log("Sender account not found.");
  }
}

// Function to generate account statement
function generateStatement() {
  const accountNumber = parseInt(
    readlineSync.question("Enter account number: ")
  );
  const account = findAccountByNumber(accountNumber);
  if (account) {
    console.log(
      `Account statement for account with account number ${accountNumber}:`
    );
    console.log(`Balance: ${account.balance}`);
    console.log("Transaction History:");
    account.transactions.forEach((transaction) => {
      console.log(
        `- ${transaction.timestamp}: ${transaction.action} ${transaction.amount}`
      );
    });
  } else {
    console.log("Account not found.");
  }
}

// Function to list all users
function listUsers() {
  console.log("All Users:");
  accounts.forEach((account) => {
    console.log(
      `- Name: ${account.name},\n  Account Number: ${account.accountNumber},\n  Account Balance: ${account.balance}`
    );
  });
}

// Main function to run the banking system
function main() {
  let isRunning = true;
  while (isRunning) {
    console.log("\nWelcome to the Banking System");
    console.log("1. Create Account");
    console.log("2. Deposit");
    console.log("3. Withdraw");
    console.log("4. Transfer");
    console.log("5. Generate Statement");
    console.log("6. List Users");
    console.log("7. Exit");

    const choice = readlineSync.question("Enter your choice: ");

    switch (choice) {
      case "1":
        createAccount();
        break;
      case "2":
        deposit();
        break;
      case "3":
        withdraw();
        break;
      case "4":
        transfer();
        break;
      case "5":
        generateStatement();
        break;
      case "6":
        listUsers();
        break;
      case "7":
        isRunning = false;
        console.log("Exiting the Banking System. Goodbye!");
        break;
      default:
        console.log("Invalid choice. Please try again.");
    }
  }
}

// Run the main function
main();
