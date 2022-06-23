'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2022-06-12T10:17:24.185Z',
    '2022-06-13T14:11:59.604Z',
    '2022-06-14T17:01:17.194Z',
    '2022-06-15T17:36:17.929Z',
    '2022-06-16T10:51:36.790Z',
  ],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2022-06-12T10:17:24.185Z',
    '2022-06-13T14:11:59.604Z',
    '2022-06-14T17:01:17.194Z',
    '2022-06-15T17:36:17.929Z',
    '2022-06-16T10:51:36.790Z',
  ],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2022-06-12T10:17:24.185Z',
    '2022-06-13T14:11:59.604Z',
    '2022-06-14T17:01:17.194Z',
    '2022-06-15T17:36:17.929Z',
    '2022-06-16T10:51:36.790Z',
  ],
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2022-06-12T10:17:24.185Z',
    '2022-06-13T14:11:59.604Z',
    '2022-06-14T17:01:17.194Z',
    '2022-06-15T17:36:17.929Z',
    '2022-06-16T10:51:36.790Z',
  ],
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////////////////////////
// Functions

// Compute user names
const computeUsernames = function (account) {
  account.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

computeUsernames(accounts);

// Format numbers
const formatCurrency = function (value, currency, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Format dates
const formatDate = function (date, locale) {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric',
    year: 'numeric',
    month: 'numeric',
    weekday: 'long',
    day: 'numeric',
  }).format(date);
};

// Format movements date
const formatMovementsDate = function (date, locale) {
  const calcDaysPassed = function (date1, date2) {
    return Math.floor(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  };

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);

  // const today = new Intl.DateTimeFormat('en-US', {
  //   day: 'numeric',
  //   month: 'numeric',
  //   year: 'numeric',
  // }).format(date);

  // return today;
};

// Calculate and display balance
const displayBalance = function (account) {
  const balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  account.balance = balance;

  labelBalance.textContent = formatCurrency(balance, 'USD', 'en-US');
};

// Display movements
const displayMovements = function (account) {
  containerMovements.innerHTML = '';
  account.movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(account.movementsDates[i]);

    const formattedMov = formatMovementsDate(date);

    const displayMov = formatCurrency(mov, 'USD', 'en-US');

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${formattedMov}</div>
        <div class="movements__value">${displayMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate and display deposits
const calcDisplayDeposits = function (movements) {
  const income = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCurrency(income, 'USD', 'en-US');
};

// Calculate and display withdrawals
const calcDisplayWithdrawals = function (movements) {
  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formatCurrency(Math.abs(out), 'USD', 'en-US');
};

// Calculate and display interest
const calcDisplayInterest = function (account) {
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(int => int * (account.interestRate / 100))
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formatCurrency(interest, 'USD', 'en-US');
};

const updateUI = function (account) {
  // Display balance
  displayBalance(account);

  // Display summary
  calcDisplayDeposits(account.movements);

  calcDisplayWithdrawals(account.movements);

  calcDisplayInterest(account);

  // Display movements
  displayMovements(account);
};

// Events
let currentAccount;
// Log in events
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  // Get the input data from log in fields
  const username = inputLoginUsername.value;
  const pin = +inputLoginPin.value;

  // Find the account with the corresponding username
  currentAccount = accounts.find(acc => acc.username === username);
  if (!currentAccount) return;

  if (currentAccount.pin === pin) {
    // Display the UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    // Display date
    const today = new Date();
    labelDate.textContent = formatDate(today, 'en-US');

    // Update the UI
    updateUI(currentAccount);
  }

  // Empty input fields
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginUsername.focus();
});

// Transfer events
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // Get the details of the receiver
  const username = inputTransferTo.value;
  const amount = +inputTransferAmount.value;

  const receiverAccount = accounts.find(acc => acc.username === username);

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount.username !== currentAccount.username
  ) {
    // Add a movement to the accounts
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // Add new date to account
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // Update the UI
    updateUI(currentAccount);
  }

  // Clear the input fields
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
});

// Request a loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(+inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add a positive movement
    currentAccount.movements.push(amount);

    // Add a new date to the account
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }

  // Clear the input fields
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // Get the input values
  const username = inputCloseUsername.value;
  const pin = +inputClosePin.value;

  if (currentAccount.username === username && currentAccount.pin === pin) {
    // Find the account
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete the account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    // Change welcome message
    labelWelcome.textContent = 'Log in and get started';
  }

  // Clear the input fields
  inputCloseUsername.value = inputClosePin.value = '';
});
