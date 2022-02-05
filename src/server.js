// ES6-moduler (EcmaScript 2015)
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dir = path.dirname(__filename) + "/../";

app.use(express.static(path.join(__dir, "public")));
app.use(express.static(path.join(__dir, "/")));
app.use(bodyParser.json());

app.get("/api/products", (req, res) => {
    try {
        const rawProducts = fs.readFileSync("data/products.json", "utf8");
        const jsonProducts = JSON.parse(rawProducts);
        res.end(JSON.stringify(jsonProducts));
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: `Error ${err}!`,
        });
    }
});

app.get("/api/products/id/:product_id", (req, res) => {
    try {
        const rawProducts = fs.readFileSync("data/products.json", "utf8");
        const jsonProducts = JSON.parse(rawProducts);

        const productById = jsonProducts.filter(
            (product) => product.id == req.params.product_id
        );

        res.end(JSON.stringify(productById));
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: `Error ${err}!`,
        });
    }
});

app.get("/api/products/category/:category", (req, res) => {
    try {
        const rawProducts = fs.readFileSync("data/products.json", "utf8");
        const jsonProducts = JSON.parse(rawProducts);

        const productsByCategory = jsonProducts.filter(
            (product) => product.category.toLowerCase() == req.params.category
        );

        res.end(JSON.stringify(productsByCategory));
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: `Error ${err}!`,
        });
    }
});

app.post("/api/products", (req, res) => {
    const product = req.body;

    product.id = nextProductId++;

    products.push(product);

    res.status(204).end(); // 204 No Content  2xx (200, 201, 202, 203, 204)
});

// HTTP POST /api/reviews
app.post("/api/reviews/:productId", (req, res) => {
    const productId = req.params.productId;

    const reviews = getReviews();

    const newReview = req.body;

    newReview.productId = productId;

    reviews.push(newReview);

    // write a human readable JSON file
    fs.writeFileSync("data/reviews.json", JSON.stringify(reviews, null, 2));

    res.status(204).end();
});

app.post("/api/orders", (req, res) => {
    const order = req.body;

    console.log(order);

    //order.id;
    const rawOrders = fs.readFileSync("data/orders.json", "utf8");
    const jsonOrders = JSON.parse(rawOrders);

    jsonOrders.push(order);

    fs.writeFileSync("data/orders.json", JSON.stringify(jsonOrders), "utf8");

    res.status(204).end();
});

// HTTP GET /api/reviews/
app.get("/api/reviews/:productId", (req, res) => {
    try {
        const parsedReviews = getReviews();

        const reviewsForProduct = parsedReviews.filter(
            (review) => review.productId == req.params.productId
        );

        res.end(JSON.stringify(reviewsForProduct));
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: `Error ${err}!`,
        });
    }
});

function getReviews() {
    const rawReviews = fs.readFileSync("data/reviews.json", "utf8");
    const jsonReviews = JSON.parse(rawReviews);

    return jsonReviews;
}

app.get("/product.html", (req, res) => {
    res.sendFile(path.join(__dir + "/product.html"));
});

app.get("/checkout.html", (req, res) => {
    res.sendFile(path.join(__dir + "/checkout.html"));
});

app.get("/our_products.html", (req, res) => {
    res.sendFile(path.join(__dir + "/our_products.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dir + "/index.html"));
});

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dir + "/index.html"));
});

// HTTP GET http://localhost:5000
app.listen(8000, () => {
    console.log("Server started on port 8000!");
});
