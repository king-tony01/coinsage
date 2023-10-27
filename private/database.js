import { createConnection } from "mysql";
import * as bcrypt from "bcrypt";
const myDB = createConnection({
  user: "root",
  host: "localhost",
  database: "coinsage",
  password: "password",
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
  let exist = `SELECT * FROM users WHERE email = "${email}"`;
  let query = `INSERT INTO users(id, username, fullname, email, phone, user_password, country, invested, active_invest, completed, withdrawn, balance) VALUES("${id}", "${username}", "${fullname}",  "${email}", "${phone}", "${hashedPassword}", "${country}", 0, 0, 0, 0, 0)`;
  return new Promise(async (reject, resolve) => {
    try {
      myDB.query(query, function (err, result, fields) {
        if (err) {
          reject({
            message: "Error occured while searching for user",
            stat: false,
          });
        }
        resolve({
          message: "Registration successful!",
          stat: true,
        });
      });
    } catch (err) {
      reject(err);
    }
  });
}

/*async function checkUser(email) {
  let exist = `SELECT * FROM users WHERE email = "${email}"`;
  return new Promise((resolve, reject) => {
    myDB.query(exist, function (err, result, fields) {
      if (result.length > 0) {
        reject({
          stat: true,
        });
        return;
      } else {
        resolve({
          stat: false,
        });
      }
    });
  });
}*/

export function fetchUser(id) {
  try {
    if (!id) return;
    const query = `SELECT * FROM users WHERE id = "${id}";`;
    return new Promise((resolve, reject) => {
      myDB.query(query, async function (err, results, fields) {
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
  } catch (err) {
    throw err;
  }
}
