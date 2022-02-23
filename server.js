const http = require("http");
const url = require("url");
const fs = require("fs");

const PORT = 8080;

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});

function sendFile(filePath, contentType, res) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": contentType });
      res.end();
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.write(data);
    return res.end();
  });
}

function requestHandler(req, res) {
  let query = url.parse(req.url, true);
  let fileName = query.pathname;

  console.log(fileName);
  switch (fileName) {
    case "/index.html":
      sendFile("./website/index.html", "text/html", res);
      break;
    case "/app.js":
      sendFile("./website/app.js", "text/javascript", res);
      break;
    case "/favicon.ico":
      res.end();
      break;
    case "/country-by-capital-city.json":
      sendFile(
        "./country-objects/country-by-capital-city.json",
        "application/json",
        res
      );
      break;
    case "/country-by-continent.json":
      sendFile(
        "./country-objects/country-by-continent.json",
        "application/json",
        res
      );
      break;
    case "/country-by-costline.json":
      sendFile(
        "./country-objects/country-by-costline.json",
        "application/json",
        res
      );
      break;
    case "/country-by-currency-name.json":
      sendFile(
        "./country-objects/country-by-currency-name.json",
        "application/json",
        res
      );
      break;
    case "/country-by-domain-tld.json":
      sendFile(
        "./country-objects/country-by-domain-tld.json",
        "application/json",
        res
      );
      break;
    case "/country-by-flag.json":
      sendFile(
        "./country-objects/country-by-flag.json",
        "application/json",
        res
      );
      break;
    default:
      // Respond to all invalid requests with a 404 Not found
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("404 Not Found");
      break;
  }
}
