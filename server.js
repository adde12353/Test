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

        if(typeof email !== "string")
        {
            res.status(500).send("Its need to be a string input")
        }
       


        const logedInCreate = await loginCreate(email);

        if (logedInCreate) {
          /*   res.send(200).send(JSON.stringify(logedInCreate)) */
            res.status(200).send("Done, and created");
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