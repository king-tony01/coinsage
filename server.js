import http from "http";
import url from "url";
import path from "path";
import fs from "fs";
import { serveType } from "./contentType.js";
import { createUser, fetchUser } from "./private/database.js";

const PORT = process.env.PORT || 5100;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(async (req, res) => {
  const routes = ["/", "/newuser", "/auth", "/signup", "/login"];
  const { pathname, query } = url.parse(req.url, true);
  console.log(query.id);
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
            console.log(user);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(await createUser(user)));
          } catch (err) {
            console.log(err);
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
          console.log(id);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(await fetchUser(id)));
        } catch (err) {
          console.log(err);
          const id = query.id;
          res.writeHead(402, { "Content-Type": "application/json" });
          res.end(JSON.stringify(await fetchUser(id)));
        }
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
