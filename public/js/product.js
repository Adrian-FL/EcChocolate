const container = document.querySelector(".product-images");
const relatedProductsElement = document.querySelector(".related-products");
const reviewSection = document.querySelector(".reviews-section");
const reviewForm = document.querySelector(".add-review");
const relatedTemplate = document.querySelector(".related-product-template");
const reviewTemplate = document.querySelector(".review-template");

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// Creates the image carousel
function createImageCarousel(product) {
    const mainImage = document.createElement("img");
    
    mainImage.src = `images/${product.images[0]}`;
    mainImage.alt = product.name;
    mainImage.className = "main-image"
    
    const previewContainer = document.createElement("div");
    previewContainer.className = "preview-container"
    
    const previewElements = product.images.map((image) => {
        const previewImageElement = document.createElement("img");
        
        previewImageElement.src = `images/${image}`;
        previewImageElement.alt = "Preview";
        
        previewImageElement.addEventListener("click", () => swapMainImage(image));
        
        return previewImageElement;
    });
    
    container.append(mainImage);
    
    previewContainer.append(...previewElements);
    
    container.append(previewContainer);
}

// Used by the image previews in the carousel to swap the main image
function swapMainImage(image) {
    const mainImage = container.querySelector(".main-image");
    mainImage.src = `images/${image}`;
}

function populateRelatedProducts(relatedProducts){
    let relatedNumber = relatedProducts.length < 4 ? relatedProducts.length : 3;
    const relatedProductFragments = [];
    
    for (let i = 0; i < relatedNumber; i++) {
        const relatedProductFragment = relatedTemplate.content.cloneNode(true);

        const a = relatedProductFragment.querySelector("a");
        a.href = `product.html?id=${relatedProducts[i].id}`;
        
        const img = relatedProductFragment.querySelector("img");
        img.src = `images/${relatedProducts[i].images[0]}`;
        img.alt = relatedProducts[i].name;

        const h4 = relatedProductFragment.querySelector(".related-product-name");
        h4.textContent = relatedProducts[i].name;

        const span = relatedProductFragment.querySelector(".related-product-price");
        span.textContent = `${relatedProducts[i].price} SEK`;
        
        relatedProductFragments.push(relatedProductFragment);
    }

    relatedProductsElement.append(...relatedProductFragments);
}
function populateProductPage(product) {

    createImageCarousel(product);
    
    const orderForm = document.querySelector(".order-form");
    
    document.querySelector(".product-title > h2").textContent = product.name;
    orderForm.querySelector(".product-name").textContent = product.name;
    
    document.querySelector(".product-info").textContent = product.description;
    
    orderForm.querySelector(".product-price").textContent = `${product.price} SEK`;

    const orderAmountInput = orderForm.querySelector("#quantity");

    orderForm.addEventListener("submit", (event) => {

        event.preventDefault();
        
        addProductToCart(product, orderAmountInput.value)
    });

    // console.log(`Fetch Products in Category: ${product.category}`);
    fetch(`/api/products/category/${product.category.toLowerCase()}`)
        .then((resp) => resp.json())
        .then((categoryProducts) => populateRelatedProducts(categoryProducts));

    fetch(`/api/reviews/${product.id}`)
        .then((resp) => resp.json())
        .then((reviews) => addReviewsToPage(reviews));
}



// console.log(`selected id is ${productId}`);

fetch(`/api/products/id/${productId}`)
    .then(resp => resp.json())
    .then(product => populateProductPage(product[0]));


const addProductToCart = (product, amount) => {
    const cartProducts = JSON.parse(localStorage.getItem("cartProducts")) ?? [];

    if (cartProducts.some((cartProduct) => cartProduct.id == product.id)) {
        updateQuantity(cartProducts, product, amount);
    } else {
        product.quantity = amount;
        cartProducts.push(product);
    }

    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
};

const updateQuantity = (cartProducts, product, amount) => {
    cartProducts.forEach(cartProduct => {
        if(cartProduct.id == product.id)
        {
            cartProduct.quantity += amount;
        }
    });
    return cartProducts;
};

function addReviewsToPage(reviews){
    
    const reviewFragments = reviews.map((review) => {
        
        const reviewFragment = reviewTemplate.content.cloneNode(true);
        
        const title = reviewFragment.querySelector(".review-head > h4");
        const score = reviewFragment.querySelector(".review-head > span");
        const body =  reviewFragment.querySelector("span.review-text");

        title.textContent = review.title;
        score.textContent = `${review.score}/5`;
        body.textContent = review.text;

        return reviewFragment;
    });


    reviewSection.append(...reviewFragments);
}

reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const review = {
        title: reviewForm.reviewTitle.value,
        text: reviewForm.reviewText.value,
        score: reviewForm.score.value
    }

    console.log(review);

    addReviewsToPage([review]);

    fetch(`/api/reviews/${productId}`, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(review)
    })
});