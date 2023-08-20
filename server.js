const dotenv = require('dotenv');
dotenv.config({path: 'config.env'});

const express = require('express');
const bodyParser = require('body-parser');
const loginCreate = require('./pupp'); // Adjust the path to match your file structure
const cors = require('cors');

const app = express();

const port = process.env.PORT || 4000


app.use(bodyParser.json());
app.use(cors({
    origin: "*"
}));

app.post("/create1hr", async (req, res) => {
    try {
        const { email } = req.body; // No need to parse the email property

        if (typeof email === "string") {
            console.log(typeof email);
        }
        
        console.log(email);

        const logedInCreate = await loginCreate(email);
        console.log(logedInCreate);

        if (logedInCreate) {
            res.status(200).send("Klart");
        } else {
            res.status(500).send("An error occurred"); // Send an error response
        }
    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).send("An error occurred");
    }
});

app.listen(port, () => {
    console.log("Running on", port);
});