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
      myDB.query(exist, function (err, result, fields) {
        if (err) {
          reject({
            message: "Error occured while searching for user",
            stat: false,
          });
        }

        if (result.length > 0) {
          reject({
            message:
              "Email is already registered, please try again with a differnt email",
            stat: false,
          });
        } else {
          myDB.query(query, function (err, result, fields) {
            if (err) {
              reject(err);
            } else {
              resolve({
                message: "Registration successful!",
                stat: true,
              });
            }
          });
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
      const query = `SELECT * FROM users WHERE email = "${user.email}";`;
      return new Promise((resolve, reject) => {
        myDB.query(query, async function (err, results, fields) {
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
    }
  } catch (err) {
    throw err;
  }
}
