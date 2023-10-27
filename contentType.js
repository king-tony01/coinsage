import path from "path";
import fs from "fs";
import url from "url";

export function serveType(link, res) {
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const extension = path.extname(link);
  let contentType;
  switch (extension) {
    case ".css":
      contentType = "text/css";
      const filePath = path.join(__dirname, link);
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          console.log(err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Internal server error!" }));
        } else {
          res.writeHead(200, { "Content-Type": contentType });
          res.end(data);
        }
      });
      break;
    case ".js":
      contentType = "application/javascript";
      const jsPath = path.join(__dirname, link);
      fs.readFile(jsPath, "utf-8", (err, data) => {
        if (err) {
          console.log(err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Internal server error!" }));
        } else {
          res.writeHead(200, { "Content-Type": contentType });
          res.end(data);
        }
      });
      break;
    case ".jpg":
      contentType = "image/jpg";
      const filePath2 = path.join(__dirname, link);
      fs.readFile(filePath2, "", (err, data) => {
        if (err) {
          console.log(err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Internal server error!" }));
        } else {
          res.writeHead(200, { "Content-Type": contentType });
          res.end(data);
        }
      });
      break;
    case ".jpeg":
      contentType = "image/jpg";
      const filePath3 = path.join(__dirname, link);
      fs.readFile(filePath3, "", (err, data) => {
        if (err) {
          console.log(err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Internal server error!" }));
        } else {
          res.writeHead(200, { "Content-Type": contentType });
          res.end(data);
        }
      });
      break;
    case ".png":
      contentType = "image/png";
      const filePath4 = path.join(__dirname, link);
      fs.readFile(filePath4, "", (err, data) => {
        if (err) {
          console.log(err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Internal server error!" }));
        } else {
          res.writeHead(200, { "Content-Type": contentType });
          res.end(data);
        }
      });
      break;
  }
}
