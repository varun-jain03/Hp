const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    



    if (req.method === "GET" && req.url === "/signup") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <html>
                <body>
                    <h1>SignUp Form</h1>
                    <form action="/signup" method="POST">
                        <input type="text" name="username" placeholder="Username">
                        <br/>
                        <input type="password" name="password" placeholder="Password">
                        <br/>
                        <button type="submit">Signup</button>
                    </form>
                </body>
            </html>
        `);
    }
    else if (req.method === "POST" && req.url == "/signup") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            const formData = new URLSearchParams(body);
            const username = formData.get("username");
            const password = formData.get("password");
            
            const userEntry = `username: ${username}, password: ${password}`;
            fs.appendFile("users.txt", userEntry, (err) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Error saving user data");
                }
                else{
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("User data saved successfully");
                }
            })
        });
    }
    else if (req.method === "GET" && req.url === "/allusers") {
        fs.readFile("./users.txt", "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/html" });
                res.end("Error reading user data");
            }
            else {
                const users = data
                .split("\n")
                .filter((line) => line)
                .map((line) => line.replace(/,password: .*/, ""))
                .join("<br />");

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(`<html><body>${users}</body></html>`);
            }
        })
    }
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Page not found");
    }



});

server.listen(8080, () => {
    console.log("Server is running on port http://localhost:8080");
})
