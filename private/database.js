import { createConnection } from "mysql2";
import * as bcrypt from "bcrypt";
import fs from "fs";
const myDB = createConnection({
  user: "avnadmin",
  host: "springwell-springwell.a.aivencloud.com",
  database: "coinsage",
  password: "AVNS_0wvmRQPhe5z62VjacCW",
  port: 19655,
  ssl: {
    ca: fs.readFileSync("./ca.pem"), // Specify the path to your CA certificate
  },
});

myDB.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("Connection successful");
});

export async function createUser(details) {
  const { id, username, fullname, email, phone, password, country } = details;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  let exist = `SELECT * FROM users WHERE email = ?`;
  let query = `INSERT INTO users(id, username, fullname, email, phone, user_password, country) VALUES(?, ?, ?, ?, ?, ?, ?)`;
  return new Promise(async (reject, resolve) => {
    try {
      myDB.query(exist, [email], function (err, result, fields) {
        if (err) {
          reject({
            message: "Error occured while searching for user",
            stat: false,
          });
        }
        console.log(result);
        if (result.length > 0) {
          reject({
            message:
              "Email is already registered, please try again with a differnt email",
            stat: false,
          });
        } else {
          myDB.query(
            query,
            [id, username, fullname, email, phone, hashedPassword, country],
            function (err, result, fields) {
              if (err) {
                reject(err);
              } else {
                resolve({
                  message: "Registration successful!",
                  stat: true,
                });
              }
            }
          );
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

export function fetchUser(user, id) {
  try {
    if (!user && !id) return;
    if (user && id == null) {
      const query = `SELECT * FROM users WHERE email = ?`;
      return new Promise((resolve, reject) => {
        myDB.query(query, [user.email], async function (err, results, fields) {
          if (err) {
            reject(err);
          }
          if (results.length > 0) {
            const correctPassword = await bcrypt.compare(
              user.password,
              results[0].user_password
            );
            if (correctPassword) {
              resolve({
                data: results[0],
                stat: true,
              });
            } else {
              reject({
                message:
                  "Incorrect password, please calm down and remember your password before retrying again. Thank you.",
                stat: false,
              });
            }
          } else {
            reject({
              message: "No user found in our records",
              stat: false,
            });
          }
        });
      });
    } else if (id && user == null) {
      const query = `SELECT * FROM users WHERE id = ?`;
      return new Promise((resolve, reject) => {
        myDB.query(query, [id], async function (err, results, fields) {
          if (err) {
            reject(err);
          }
          if (results.length == 0) {
            reject({
              message: "No user found in our records",
              stat: false,
            });
          } else {
            resolve({
              data: results[0],
              stat: true,
            });
          }
        });
      });
    }
  } catch (err) {
    throw err;
  }
}

export function getAddresses() {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM wallets WHERE stat= TRUE";
    myDB.query(query, function (err, results, fields) {
      if (err) {
        throw err;
      } else {
        resolve(results);
      }
    });
  });
}
export function deposit(payment) {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO deposits(id, amount, plan, pay_option, date_created, payer, confirmed) VALUES(?,?, ?, ?, ? , ?, ? )`;
    myDB.query(
      query,
      [
        payment.id,
        payment.amount,
        payment.plan,
        payment.coin,
        NOW(),
        payment.payer,
        0,
      ],
      function (err, results, fields) {
        if (err) {
          throw err;
        } else {
          resolve({
            message: "Payment is placed successfully",
            stat: true,
          });
        }
      }
    );
  });
}

export async function getAll() {
  const queries = [
    `SELECT * FROM users`,
    `SELECT * FROM deposits`,
    `SELECT * FROM activeInvestments`,
    `SELECT * FROM deposits WHERE stat = FALSE`,
  ];
  const queryPromises = queries.map((query) => {
    return new Promise((resolve, reject) => {
      myDB.query(query, function (err, results, fields) {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(results);
        }
      });
    });
  });
  try {
    const result = await Promise.all(queryPromises);
    const data = {
      users: result[0],
      revenue: result[1],
      activeInvest: result[2],
      pendingPay: result[3],
    };
    console.log(data);
    return data;
  } catch (err) {
    throw err;
  }
}

export async function users() {
  return new Promise((resolve, reject) => {
    let usersQuery = `SELECT * FROM users`;
    myDB.query(usersQuery, function (err, results, fields) {
      if (err) {
        throw err;
      } else {
        resolve(results);
      }
    });
  });
}
export async function deposits() {
  return new Promise((resolve, reject) => {
    let depositsQuery = `SELECT * FROM deposits`;
    myDB.query(depositsQuery, function (err, results, fields) {
      if (err) throw err;
      resolve(results);
    });
  });
}
export async function wallets() {
  return new Promise((resolve, reject) => {
    let walletsQuery = `SELECT * FROM wallets`;
    myDB.query(walletsQuery, function (err, results, fields) {
      if (err) {
        throw err;
      } else {
        resolve(results);
        console.log(results);
      }
    });
  });
}

export async function addWallet(data) {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO wallets(id, wallet_name, address, date_created) VALUES(?, ?, ?)`;
    myDB.query(
      query,
      [data.id, data.walletName, data.address, data.dateCreated],
      function (err, results, fields) {
        if (err) {
          reject({
            stat: false,
            message: err,
          });
        } else {
          resolve({
            stat: true,
            message: "Address added successfully",
          });
        }
      }
    );
  });
}
