const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("server is up");
});

app.post("/", (req, res) => {
    var fName = req.body.fName;
    var lName = req.body.lName;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }

    var jsonData = JSON.stringify(data);

    const url = "https://us13.api.mailchimp.com/3.0/lists/177f913a83";
    const options = {
        method: "POST",
        auth: "uttaran:53cecc0b6938c930e2a19d04e6a96ca4-us13",
    }

    const request = https.request(url, options, (response) => {
        if(response.statusCode === 200){
            // res.send("Successfully subscribed! =)");
            res.sendFile(__dirname + "/success.html");
        }
        else{
            // res.send("There was an error with signing up. Please try again! =(");
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

    // res.send(fName);
    // console.log(fName, lName, email);

});

app.post("/failure", (res, req)=>{
    req.redirect("/");
})

// mailchip key: 53cecc0b6938c930e2a19d04e6a96ca4-us13
// audience id: 177f913a83