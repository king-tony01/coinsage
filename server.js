import http from "http";
import url from "url";
import path from "path";
import fs from "fs";
import { serveType } from "./contentType.js";
import {
  addWallet,
  createUser,
  creditUser,
  deleteUser,
  deleteWallet,
  deposit,
  deposits,
  fetchUser,
  getAll,
  users,
  wallets,
} from "./private/database.js";
import { deliverMail } from "./private/mailer.js";

const PORT = process.env.PORT || 5100;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(async (req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  console.log(pathname);
  if (pathname.includes(".")) {
    serveType(pathname, res);
  } else {
    switch (pathname) {
      case "/":
        const homePath = path.join(__dirname, "index.html");
        fs.readFile(homePath, "utf-8", (err, data) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        });
        break;
      case "/signup":
        const signupPath = path.join(__dirname, "signup.html");
        fs.readFile(signupPath, "utf-8", (err, data) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        });
        break;
      case "/ref":
        const referralPath = path.join(__dirname, "signup.html");
        fs.readFile(referralPath, "utf-8", (err, data) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        });
        break;
      case "/login":
        const loginPath = path.join(__dirname, "login.html");
        fs.readFile(loginPath, "utf-8", (err, data) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        });
        break;
      case "/newuser":
        let body;
        req.on("data", (chunk) => {
          body = chunk;
        });
        req.on("end", async () => {
          try {
            const user = JSON.parse(body);
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify(await createUser(user)));
          } catch (err) {
            const user = JSON.parse(body);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(err));
            deliverMail(user);
          }
        });
      case "/credit":
        let data;
        req.on("data", (chunk) => {
          data = chunk;
        });
        req.on("end", async () => {
          try {
            const transData = JSON.parse(data);
            console.log(transData);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(await creditUser(transData)));
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify(err));
          }
        });
        break;
      case "/remove-user":
        let userDetail;
        req.on("data", (chunk) => {
          userDetail = chunk;
        });
        req.on("end", async () => {
          try {
            const parsedId = JSON.parse(userDetail);
            console.log(parsedId);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(await deleteUser(parsedId)));
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify(err));
          }
        });
        break;
      case "/auth":
        let dataBody;
        req.on("data", (chunk) => {
          dataBody = chunk;
        });
        req.on("end", async () => {
          try {
            const user = JSON.parse(dataBody);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(await fetchUser(user, null)));
          } catch (err) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(err));
          }
        });
        break;
      case "/in":
        const mainPath = path.join(__dirname, "main.html");
        fs.readFile(mainPath, "utf-8", (err, data) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        });
        break;
      case "/user":
        try {
          const id = query.id;
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(await fetchUser(null, id)));
        } catch (err) {
          res.writeHead(402, { "Content-Type": "application/json" });
          res.end(JSON.stringify(err));
        }
        break;
      case "/deposit-form":
        const depositPath = path.join(__dirname, "deposit.html");
        fs.readFile(depositPath, "utf-8", (err, data) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        });
        break;
      case "/addresses":
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(await wallets()));
        break;
      case "/wallet/remove":
        try {
          let idBody;
          req.on("data", (chunk) => {
            idBody = chunk;
          });
          req.on("end", async () => {
            const id = JSON.parse(idBody);
            console.log(id);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(await deleteWallet(id)));
          });
        } catch (err) {
          console.log(err);
        }
        break;
      case "/pay":
        try {
          let payBody;
          req.on("data", (chunk) => {
            payBody = chunk;
          });
          req.on("end", async () => {
            const payment = JSON.parse(payBody);
            console.log(payment);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(await deposit(payment)));
          });
        } catch (err) {
          console.log(err);
        }
        break;
      case "/admin":
        const adminPath = path.join(__dirname, "admin-page", "admin.html");
        fs.readFile(adminPath, "utf-8", (err, data) => {
          if (err) {
            console.log(
              new Error(`Error occured while trying to read file: ${err}`)
            );
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        });
        break;

      case "/admin/all":
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(await getAll()));
        break;
      case "/admin/users":
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(await users()));
        break;
      case "/admin/deposits":
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(await deposits()));
        break;
      case "/admin/wallets":
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(await wallets()));
        break;
      case "/admin/new-wallet":
        let walletBody;
        req.on("data", (chunk) => {
          walletBody = chunk;
        });
        req.on("end", async () => {
          const mainData = JSON.parse(walletBody);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(await addWallet(mainData)));
        });
        break;
      case "/admin/update-wallet":
        let wallet;
        req.on("data", (chunk) => {
          wallet = chunk;
        });
        req.on("end", () => {
          let walletData = JSON.parse(wallet);
          console.log(walletData);
        });
        break;
      default:
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "The requested resource cannot be found, sorry buddy",
          })
        );
        break;
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
