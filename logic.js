// HTML values
const balance = document.getElementById("balance");
const pay = document.getElementById("pay");
const debt = document.getElementById("debt");
const price = document.getElementById("price")



let userInfo = {
    balance: 0,
    pay: 0,
    hasLoan: false,
    debt: 0
}
// HTML info
balance.innerHTML= userInfo.balance
pay.innerHTML= userInfo.pay
debt.innerHTML= userInfo.debt

// buttons
const loanButton = document.getElementById("Loan")
const bankButton = document.getElementById("Bank")
const workButton = document.getElementById("Work")
const repayLoanButton = document.getElementById("RepayLoan");
const buyButton = document.getElementById("Buy")

// dropdown menu
const pc_dropdwon = document.getElementById("laptops")

//Loan button functionality
loanButton.addEventListener('click', function() {
    console.log(userInfo.balance)
    if (!userInfo.hasLoan && userInfo.balance != 0) {
        value = window.prompt("You can loan between: " + 1 + "-" + 2 * userInfo.balance + "kr");
        let loanAmount = parseInt(Number(value));
        if (isNaN(loanAmount)) {
            alert("inserted value is not a number");
        } else if (loanAmount < 1 || loanAmount > 2 * userInfo.balance){
            alert("You cannot loan that amount");
        } else {
            userInfo.hasLoan = true;
            userInfo.debt = loanAmount
            userInfo.balance += loanAmount
            repayLoanButton.style.display="inline-block";
            updateHTML()
        }
    } else  {
        alert("You cannot take a loan while in debt, or while have 0 balance")
    }
});
//Bank button functionality
bankButton.addEventListener('click', function() {
    if (userInfo.hasLoan) {
        let toLoan = userInfo.pay * 0.1;
        let toBalance = userInfo.pay * 0.9;

        userInfo.debt -= toLoan;
        userInfo.balance += toBalance;
        userInfo.pay = 0;
        
        checkDebtPayed();
        userInfo.maxLoan = 2 * userInfo.balance;
    } else {
        userInfo.balance += userInfo.pay;
        userInfo.pay = 0;
        userInfo.maxLoan = 2 * userInfo.balance;
    }   
    updateHTML();
});
//Work button functionality
workButton.addEventListener('click', function() {
   userInfo.pay += 100;
   updateHTML();
});
//repay button functionality
repayLoanButton.addEventListener('click', function() {
    userInfo.debt -= userInfo.pay;
    userInfo.pay = 0;
    
    if (userInfo.debt <= 0) {
        let difference = Math.abs(userInfo.debt);
        userInfo.balance += difference;
        userInfo.debt = 0;
        userInfo.hasLoan = false;
    }
    updateHTML();
 });

async function loadPCs() {
    let obj;
    try {
        const response = await fetch('https://hickory-quilled-actress.glitch.me/computers');
        obj = await response.json();
    } catch (error) {
        alert("couldn't load data - " + error);
    }
    return obj
}

async function render_dropdown(obj) {
    let dropdown_menu = document.getElementById("laptops");
    let option;
    for (const PC of obj) {
        option = document.createElement("option");
        option.text = PC.title;
        option.value = PC.id;
        option.id = "pc-" + PC.id;
        dropdown_menu.add(option);
    }
}

(async () => {
    const data = await loadPCs();
    await render_dropdown(data);

    const selectedValue = document.querySelector("#laptops");
    const feature_text = document.getElementById("feature-text");

    img_path = "https://hickory-quilled-actress.glitch.me/assets/images/"
    img = document.getElementById("img");

    let price_val;

    document.addEventListener('change', () => {
        let curr_object = data[selectedValue.value - 1]
        price_val = curr_object["price"]
        feature_text.innerText = curr_object["specs"];
        feature_text.style.fontSize = "x-small";
        img.src = img_path + curr_object["id"] + findImgFormat(curr_object["id"])
        price.innerHTML = price_val

        const computer_name = document.getElementById("computer_name")
        computer_name.innerHTML = curr_object["title"]

        const description = document.getElementById("computer_description")
        console.log(curr_object["description"])
        description.style.fontSize = "small"
        description.innerHTML = curr_object["description"]
    });

    buyButton.addEventListener('click', function() {
        if (userInfo.balance >= price_val) {
            userInfo.balance -= price_val
            updateHTML()
            alert("You are now the owner of the new computer");
        } else {
            alert("You cannot afford that computer");
        }
    });
    
})();

function findImgFormat(value){
    switch(value){
        case 1:
            return ".png";
        case 2:
            return ".png";
        case 5:
            return ".png"
        default:
            return ".jpg"
    }
}

function updateHTML(){
    balance.innerHTML= userInfo.balance;
    pay.innerHTML= userInfo.pay;
    debt.innerHTML = userInfo.debt;
}
function checkDebtPayed(){
    if (userInfo.debt <= 0) {
        let difference = Math.abs(userInfo.debt);
        userInfo.balance += difference;
        userInfo.debt = 0;
        userInfo.hasLoan = false;
        repayLoanButton.style.display="none";
    }
}