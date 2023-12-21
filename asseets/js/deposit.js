let addresses = [];
getAddresses();

const deposit = {
  id: Math.random().toString(32).substring(4, 9),
  amount: 0,
  coin: "bitcoin",
  plan: "silver",
  payer: "",
};

async function getAddresses() {
  const response = await fetch(`${location.origin}/addresses`);
  const data = await response.json();
  addresses = data;
  const bitcoin = addresses.find((address) => {
    return address.wallet_name == "Bitcoin";
  });
  document.getElementById("address").textContent = bitcoin.address;
}

getEmail();

async function getEmail() {
  const response = await fetch(
    `${location.origin}/user?id=${location.search.slice(4)}`
  );
  const resData = await response.json();
  const { data } = resData;
  deposit.payer = data.email;
}

const plans = document.querySelectorAll(".plan");
plans.forEach((plan) => {
  plan.addEventListener("click", () => {
    plans.forEach((p) => p.classList.remove("active"));
    plan.classList.add("active");
    deposit.plan = plan.getAttribute("data-plan");
  });
});
const coins = document.querySelectorAll(".coin");
coins.forEach((coin) => {
  coin.addEventListener("click", () => {
    coins.forEach((c) => c.classList.remove("active"));
    coin.classList.add("active");
    document.getElementById("coin-name").textContent =
      coin.getAttribute("data-coin");
    deposit.coin = coin.getAttribute("data-coin");
    const type = coin.getAttribute("data-coin");
    switch (type) {
      case "bitcoin":
        const bitcoin = addresses.find((address) => {
          return address.wallet_name == "Bitcoin";
        });
        document.getElementById("address").textContent = bitcoin.address;
        break;
      case "ethereum":
        const ethereum = addresses.find((address) => {
          return address.wallet_name == "Ethereum";
        });
        document.getElementById("address").textContent = ethereum.address;
        break;
      case "bnb":
        const usdt = addresses.find((address) => {
          return address.wallet_name == "USDT";
        });
        document.getElementById("address").textContent = usdt.address;
        break;
    }
  });
});

const copyBtn = document.getElementById("copy");
copyBtn.addEventListener("click", (e) => {
  e.preventDefault();
  navigator.clipboard
    .writeText(document.getElementById("address").textContent)
    .then(
      () => {
        alert("Text copied successfully!");
      },
      (err) => {
        alert(err);
      }
    );
});

const verifyBtn = document.getElementById("confirm");
verifyBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  deposit.amount = Number(document.getElementById("amount").value);
  console.log(deposit);
  const response = await fetch(`${location.origin}/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deposit),
  });

  const data = await response.json();
  if (data.stat) {
    location.assign(`${location.origin}/in?id=${location.search.slice(4)}`);
  }
});
