const templateLI = document.querySelector("template");
const chocolatesUL = document.querySelector(".chocolates");
const drinksUL = document.querySelector(".drinks");
const coffeesUL = document.querySelector(".coffees");

const populateProducts = (products) =>
    products.map((product) => {
        const template = templateLI.content.cloneNode(true);

        template.querySelector("a").href = `product.html?id=${product.id}`;
        template.querySelector(
            "img"
        ).src = `images/${product.image_path_desktop}`;
        template.querySelector("h3").textContent = product.name;
        template.querySelector("span").textContent = product.price;

        template
            .querySelector("button")
            .addEventListener("click", () => addProductToCart(product));

        return template;
    });

const productExists = (product) => {
    const cartProducts = getCartProducts();

    return cartProducts.some((p) => p.id == product.id);
};

const updateQuantity = (cartProducts, product) => {
    for (let idx = 0; idx < cartProducts.length; idx++)
        if (cartProducts[idx].id === product.id) cartProducts[idx].quantity++;
    return cartProducts;
};

const getCartProducts = () => {
    return JSON.parse(localStorage.getItem("cartProducts")) ?? [];
};

const addProductToCart = (product) => {
    const cartProducts = getCartProducts();

    if (productExists(product)) {
        updateQuantity(cartProducts, product);
    } else {
        product.quantity = 1;
        cartProducts.push(product);
    }

    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    updateCartNumber();
};

const updateCartNumber = () => {
    const cartTextElement = document.querySelector("#cartText");

    const cartProducts = getCartProducts();

    if (cartProducts.length < 10)
        cartTextElement.textContent = `0${cartProducts.length}`;
    else cartTextElement.textContent = cartProducts.length;
};

const renderChocolates = (chocolates) => {
    const chocolatesElements = populateProducts(chocolates);
    chocolatesUL.append(...chocolatesElements);
};

const renderDrinks = (drinks) => {
    const drinksElements = populateProducts(drinks);
    drinksUL.append(...drinksElements);
};

const renderCoffees = (coffees) => {
    const coffeesElements = populateProducts(coffees);
    coffeesUL.append(...coffeesElements);
};

fetch("/api/products/category/chocolates")
    .then((resp) => resp.json())
    .then((chocolates) => renderChocolates(chocolates));

fetch("/api/products/category/drinks")
    .then((resp) => resp.json())
    .then((drinks) => renderDrinks(drinks));

fetch("/api/products/category/coffees")
    .then((resp) => resp.json())
    .then((coffees) => renderCoffees(coffees));

updateCartNumber();
