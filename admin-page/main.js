const tabs = document.querySelectorAll(".tab");
const page = document.querySelector("main");
init();
tabs.forEach((tab) => {
  tab.addEventListener("click", async () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const tabSelected = tab.getAttribute("data-tab");
    switch (tabSelected) {
      case "dashboard":
        page.innerHTML = ` <div class="loader">
        <i class="fas fa-spinner"></i>
        <p>Fetching data...</p>
      </div>`;
        const data = await getJSON(`/admin/all`);
        if (data) {
          const { users, revenue, activeInvest, pendingPay } = data;
          page.innerHTML = `<section class="dashboard">
        <div class="card">
          <h2>${users.length}</h2>
          <p>Users</p>
        </div>
        <div class="card">
          <h2>$ ${revenue.length}</h2>
          <p>Total Revenue</p>
        </div>
        <div class="card">
          <h2>$ ${activeInvest.length}</h2>
          <p>Active Investments</p>
        </div>
        <div class="card">
          <h2>${pendingPay.length}</h2>
          <p>Pending Payments</p>
        </div>
        <div class="card">
          <h2>$ 3,000</h2>
          <p>Active Investments</p>
        </div>
        <div class="card">
          <h2>$ 3,000</h2>
          <p>Active Investments</p>
        </div>
      </section>`;
        }
        break;
      case "users":
        page.innerHTML = ` <div class="loader">
        <i class="fas fa-spinner"></i>
        <p>Fetching data...</p>
      </div>`;
        const users = await getJSON("/admin/users");
        if (users) {
          page.innerHTML = `<section class="users">
        <ul>
        ${users
          .map((user) => {
            return `<li>
            <div>
              <i class="fas fa-user"></i>
              <div>
                <b class="username">${user.username}</b>
                <small class="email">${user.email}</small>
              </div>
            </div>
            <i class="fas fa-ellipsis-vertical"></i>
          </li>`;
          })
          .join(" ")}
        </ul>
      </section>`;
        }
        break;
      case "payments":
        page.innerHTML = ` <div class="loader">
        <i class="fas fa-spinner"></i>
        <p>Fetching data...</p>
      </div>`;
        const payments = await getJSON("/admin/deposits");
        if (payments) {
          let total = 0;
          payments.map((payment) => {
            total += payment.amount;
            return total;
          });
          page.innerHTML = `<section class="payments">
        <div class="hero">
          <div class="card">
            <h2>$ ${total.toLocaleString("US")}</h2>
            <p>Total Revenue</p>
          </div>
          <div class="card">
            <h2>$ 3,000</h2>
            <p>Active Investments</p>
          </div>
        </div>
        <ul>
        ${payments.map((payment) => {
          return `<li>
            <div class="wrap">
              <i class="fas fa-dollar"></i> <b>${payment.amount}</b>
              <div>
                <small>${payment.payer}</small
                ><span class="time">${payment.date_created}</span>
              </div>
            </div>
            <i class="fas fa-check approve"></i>
          </li>`;
        })}
        </ul>
      </section>`;
        }
        break;
      case "wallets":
        page.innerHTML = ` <div class="loader">
        <i class="fas fa-spinner"></i>
        <p>Fetching data...</p>
      </div>`;
        await wallet();
        break;
    }
  });
});

async function getJSON(query) {
  try {
    const response = await fetch(`${location.origin}${query}`);
    const data = await response.json();
    if (data) {
      return data;
    } else {
      alert(`There is an error while fetching data`);
    }
  } catch (err) {
    alert(err);
  }
}

async function sendJSON(data, endpoint) {
  try {
    const response = await fetch(`${location.origin}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(data);
    const resData = await response.json();
    return resData;
  } catch (err) {
    alert(err);
  }
}

async function sendAddress(coin) {
  const data = {
    id: Math.random().toString(32).substring(4, 9),
    walletName: coin,
    address: document.getElementById("address").value,
    dateCreated: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`,
  };

  try {
    const response = await sendJSON(data, "/admin/new-wallet");
    console.log(response);
    alert(response.message);
    await wallet();
  } catch (err) {
    alert(err);
  }
}

function openForm() {
  const openBtn = document.getElementById("add-new");
  const form = document.querySelector(".wallet-input");
  const coins = form.querySelectorAll(".coin-card");
  coins.forEach((coin) => {
    coin.addEventListener("click", () => {
      coins.forEach((c) => c.classList.remove("active"));
      coin.classList.add("active");
    });
  });
  form.classList.remove("active");
  openBtn.classList.add("active");
}

async function closeForm() {
  const openBtn = document.getElementById("add-new");
  const form = document.querySelector(".wallet-input");
  await sendAddress(form.querySelector(".active").getAttribute("data-coin"));
  form.classList.add("active");
  openBtn.classList.remove("active");
}

async function activateWallet(id) {
  const wallet = {
    id: id,
  };
  const data = await sendJSON(wallet, "/admin/update-wallet");
  console.log(data);
}

async function wallet() {
  const wallets = await getJSON("/admin/wallets");
  if (wallets.length > 0) {
    page.innerHTML = ` <section class="wallets">
        <div class="wllaet-head">
          <div class="wallet-input active">
            <div class="coin-type">
              <div class="coin-card" data-coin="Bitcoin">
                <img src="/asseets/images/bitcoin.png" alt="" />
                <b>BTC</b>
              </div>
              <div class="coin-card" data-coin="Ethereum">
                <img src="/asseets/images/ethereum.png" alt="" />
                <b>ETH</b>
              </div>
              <div class="coin-card" data-coin="BNB">
                <img src="/asseets/images/bnb.png" alt="" />
                <b>BNB</b>
              </div>
            </div>
            <label for="wallet-address">Address:</label>
            <input type="text" placeholder="Please enter the wallet address" id="address"/>
            <button id="add" onclick="closeForm()">Add</button>
          </div>
          <button id="add-new" class="add-btn" onclick="openForm()">
            <i class="fas fa-wallet"></i> Add New
          </button>
        </div>
        <ul>
        ${wallets.map((wallet) => {
          return `<li>
            <div class="wrap">
              <i class="fas fa-wallet"></i>
              <div>
                <b>${wallet.wallet_name}</b
                ><small>${wallet.address}</small
                ><span class="active">Active</span>
              </div>
            </div>
            <div class="action">
              <i class="fas fa-close"></i><i class="fas fa-check" onclick="activateWallet(${wallet.id})"></i
              ><i class="fas fa-trash"></i>
            </div>
          </li>`;
        })}
        </ul>
      </section>`;
  } else {
    page.innerHTML = ` <section class="wallets">
        <div class="wllaet-head">
          <div class="wallet-input active">
            <div class="coin-type">
              <div class="coin-card active" data-coin="Bitcoin">
                <img src="/asseets/images/bitcoin.png" alt="" />
                <b>BTC</b>
              </div>
              <div class="coin-card" data-coin="Ethereum">
                <img src="/asseets/images/ethereum.png" alt="" />
                <b>ETH</b>
              </div>
              <div class="coin-card" data-coin="BNB">
                <img src="/asseets/images/bnb.png" alt="" />
                <b>BNB</b>
              </div>
            </div>
            <label for="wallet-address">Address:</label>
            <input type="text" placeholder="Please enter the wallet address" id="address"/>
            <button id="add" onclick="closeForm()">Add</button>
          </div>
          <button id="add-new" class="add-btn" onclick="openForm()">
            <i class="fas fa-wallet"></i> Add New
          </button>
        </div>
       <h2>No wallet available at the moment, please create a new wallet</h2>
      </section>`;
  }
}

async function init() {
  try {
    const data = await getJSON(`/admin/all`);
    if (data) {
      const { users, revenue, activeInvest, pendingPay } = data;
      let total = 0;
      revenue.map((rev) => {
        total += rev.amount;
        return total;
      });
      page.innerHTML = `<section class="dashboard">
        <div class="card">
          <h2>${users.length}</h2>
          <p>Users</p>
        </div>
        <div class="card">
          <h2>$ ${total.toLocaleString("US")}</h2>
          <p>Total Revenue</p>
        </div>
        <div class="card">
          <h2>$ ${activeInvest.length}</h2>
          <p>Active Investments</p>
        </div>
        <div class="card">
          <h2>${pendingPay.length}</h2>
          <p>Pending Payments</p>
        </div>
        <div class="card">
          <h2>$ 3,000</h2>
          <p>Active Investments</p>
        </div>
        <div class="card">
          <h2>$ 3,000</h2>
          <p>Active Investments</p>
        </div>
      </section>`;
    }
  } catch (err) {
    alert(err);
  }
}
