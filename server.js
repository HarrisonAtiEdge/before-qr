const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

// Load car data
const cars = JSON.parse(fs.readFileSync("cars.json", "utf-8"));

// Route to render the rating form
app.get("/car/:model_no", (req, res) => {
    const carModel = req.params.model_no;
    const car = cars.find(c => c.model_no === carModel);

    if (!car) {
        return res.status(404).send("Car not found");
    }

    // Dynamically generate HTML form
    res.send(`
        <html>
            <head>
                <title>Rate Car ${carModel}</title>
            </head>
            <body>
                <h2>Rate Car Model: ${carModel}</h2>
                
                <form action="/car/${carModel}" method="POST">
                    <h3>Rating for Car Message:</h3>
                    <input type="radio" name="message" value="Avg" required> 1 Avg
                    <input type="radio" name="message" value="Good"> 2 Good
                    <input type="radio" name="message" value="Excellent"> 3 Excellent

                    <h3>Rating for Car Uniqueness:</h3>
                    <input type="radio" name="uniqueness" value="Avg" required> 1 Avg
                    <input type="radio" name="uniqueness" value="Good"> 2 Good
                    <input type="radio" name="uniqueness" value="Excellent"> 3 Excellent

                    <h3>Rating for Car Art Quality:</h3>
                    <input type="radio" name="art_quality" value="Avg" required> 1 Avg
                    <input type="radio" name="art_quality" value="Good"> 2 Good
                    <input type="radio" name="art_quality" value="Excellent"> 3 Excellent
                    
                    <br><br><button type="submit">Submit</button>
                </form>
            </body>
        </html>
    `);
});

// Route to handle form submission and update JSON
app.post("/car/:model_no", (req, res) => {
    const carModel = req.params.model_no;
    const carIndex = cars.findIndex(c => c.model_no === carModel);

    if (carIndex === -1) {
        return res.status(404).send("Car not found");
    }

    // Update ratings in JSON
    cars[carIndex].ratings = {
        message: req.body.message,
        uniqueness: req.body.uniqueness,
        art_quality: req.body.art_quality
    };

    // Save updated JSON
    fs.writeFileSync("cars.json", JSON.stringify(cars, null, 2));

    res.send(`<h2>Thank you for rating Car Model: ${carModel}!</h2>`);
});

// Start server
app.listen(3002, () => {
    console.log("Server running on http://localhost:3002");
});
