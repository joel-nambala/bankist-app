'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// DOM Elements
const labelBalance = document.querySelector('.balance__total');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');

const containeMovements = document.querySelector('.movements');

const displayMovements = function (movements) {
  // 1. Clear the movements container
  containeMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    // 2. Check the type of the movement
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // 3. Create a HTML string
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">$${Math.abs(mov)}</div>
      </div>
    `;

    // 4. Append the movements to the UI
    containeMovements.insertAdjacentHTML('afterbegin', html);
  });
};

displayMovements(account1.movements);

const calcDisplayBalance = function (movements) {
  // 1. Calculate the total balance of the movements
  const balance = movements.reduce((acc, mov) => acc + mov, 0);

  // 2. Display the balance to the UI
  labelBalance.textContent = `$${balance}`;
};

calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (movements) {
  // 1. Calculate the total deposits
  const income = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  // 2. Display the total deposits to the UI
  labelSumIn.textContent = `$${income}`;

  // 3. Calculate the total withdrawals
  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  // 4. Display the total withdrawals to the UI
  labelSumOut.textContent = `$${Math.abs(out)}`;

  // 5. Calculate the interest - The bank offers an interest of 1.2% on every deposit
  const interest = movements
    .filter(mov => mov > 0)
    .map(mov => (mov * 1.2) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  // 6. Display the interest to the UI
  labelSumInterest.textContent = `$${interest}`;
};

calcDisplaySummary(account1.movements);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);
