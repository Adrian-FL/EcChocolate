const templateLI = document.querySelector("template");
const itemsUL = document.querySelector("#your-items ul");
const totalAmountToPay = document.querySelector("article#pay span");
const productQuantityInput = document.querySelector("#your-items ul input");
const sendOrderButton = document.querySelector("footer button");

const firstNameInput = document.querySelector("#firstname");
const lastNameInput = document.querySelector("#lastname");
const mobilePhoneInput = document.querySelector("#mobile-phone-number");
const emailInput = document.querySelector("#email");
const addressInput = document.querySelector("#address");
const creditCardInput = document.querySelector("#credit-card-number");

let totalAmount = 0;

const populateCartProducts = (cartProducts) =>
    cartProducts.map((product) => {
        const template = templateLI.content.cloneNode(true);

        template.querySelector(
            "img"
        ).src = `images/${product.image_path_desktop}`;
        template.querySelector(
            "#product-name"
        ).textContent = `Name: ${product.name}`;
        template.querySelector("#product-quantity input").value =
            product.quantity;
        template.querySelector(
            "#product-price"
        ).textContent = `Price: ${product.price}`;
        template.querySelector("input").addEventListener("change", function () {
            updateProductQuantity(this, product.id);
        });

        totalAmount += product.price * product.quantity;

        return template;
    });

const renderCartProducts = (cartProducts) => {
    const productsElements = populateCartProducts(cartProducts);
    itemsUL.append(...productsElements);
    totalAmountToPay.textContent = totalAmount;
};

const getCartProducts = () => {
    return JSON.parse(localStorage.getItem("cartProducts")) ?? [];
};

const readFromLocalStorage = () => {
    const cartProducts = getCartProducts();
    renderCartProducts(cartProducts);
};

const updateProductQuantity = (input, productId) => {
    const cartProducts = getCartProducts();
    for (let i = 0; i < cartProducts.length; i++)
        if (cartProducts[i].id == productId)
            cartProducts[i].quantity = parseInt(input.value);
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    updateTotalAmount();
};

const updateTotalAmount = () => {
    const cartProducts = getCartProducts();
    totalAmount = 0;

    for (let i = 0; i < cartProducts.length; i++)
        totalAmount += cartProducts[i].quantity * cartProducts[i].price;
    totalAmountToPay.textContent = totalAmount;
};

const verifyFormInputs = () => {
    return (
        firstNameInput.value &&
        lastNameInput.value &&
        mobilePhoneInput.value &&
        emailInput.value &&
        addressInput.value &&
        creditCardInput.value
    );
};

const getOrderJSON = () => {
    return {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        mobilePhoneNumber: mobilePhoneInput.value,
        email: emailInput.value,
        address: addressInput.value,
        creditCardNumber: creditCardInput.value,
        products: getCartProducts(),
    };
};

const sendOrder = () => {
    if (verifyFormInputs()) {
        const order = getOrderJSON();
        fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
        }).then((resp) => {
            if (resp.status == "204") {
                localStorage.removeItem("cartProducts");
                alert("Order sent successfully!");
                location.href = "our_products.html";
            }
        });
    } else alert("One or more form fields are empty!");
};

sendOrderButton.addEventListener("click", () => sendOrder());

readFromLocalStorage();
