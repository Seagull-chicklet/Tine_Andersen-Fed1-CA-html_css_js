const url = document.location;
console.log({ url });

const search = url.search;

const params = new URLSearchParams(search);

const sizeButtons = document.querySelectorAll(".size-buttons");
let selectedButton = null;
let selectedSize = null;

function handleDynamicButtonClick(buttonElement) {
  console.log("dynamic button clicked:", buttonElement.textContent);
  selectedSize = buttonElement.textContent;
  selectedButton = buttonElement;
}

function handleStaticButtonClick(staticButton) {
  console.log("Static button clicked:", staticButton.textContent);
}
const loader = document.getElementById("loader");
const loaderMessage = document.getElementById("loader-message");

async function renderJackets() {
  try {
    if (loader) {
      loader.style.display = "block";
    }
    if (loaderMessage) {
      loaderMessage.style.display = "block";
    }

    const jackets = await getJackets();
    console.log("All jackets:", jackets);

    const mensJackets = jackets.filter((jacket) =>
      jacket.tags.includes("mens")
    );
    console.log("Filtered mens jackets:", mensJackets);

    mensJackets.forEach((jacket) => renderJacket(jacket));
  } catch (error) {
    console.error("Error getting great stuff:", error);
  } finally {
    if (loader) {
      loader.style.display = "none";
    }
    if (loaderMessage) {
      loaderMessage.style.display = "none";
    }
  }
}

async function fetchOneProduct(id) {
  if (!id) throw new Error("OOps, id is undefined");
  const url = `https://api.noroff.dev/api/v1/rainy-days/${id}`;
  try {
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();

      return data;
    } else {
      throw new Error("We got issues, unexpected response");
    }
  } catch (error) {
    console.log(error);
  }
}

function renderCartItem(productData, selectedSize, selectedQuantity) {
  const cartItemContainer = document.getElementById("cards");

  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItem.dataset.productId = productData.id;

  const productImage = document.createElement("img");
  productImage.src = productData.image;
  productImage.alt = productData.tags;
  productImage.classList.add("cart-item-image");
  cartItem.appendChild(productImage);

  const productDetails = document.createElement("div");
  productDetails.classList.add("cart-item-details");

  const productName = document.createElement("h3");
  productName.textContent = productData.title;

  const productSize = document.createElement("p");
  productSize.textContent = `Size: ${selectedSize}`;

  const productQuantity = document.createElement("p");
  productQuantity.textContent = `Quantity: ${selectedQuantity}`;

  const productPrice = document.createElement("p");
  productPrice.textContent = `Price: ${productData.price}`;

  productDetails.appendChild(productName);
  productDetails.appendChild(productSize);
  productDetails.appendChild(productQuantity);
  productDetails.appendChild(productPrice);

  cartItem.appendChild(productDetails);

  cartItemContainer.appendChild(cartItem);
}

async function renderOneProduct() {
  const id = params.get("id");
  const oneData = await fetchOneProduct(id);
  console.log({ oneData });

  const productDisplay = document.getElementById("cards");

  productDisplay.innerHTML = "";

  const productImage = document.createElement("img");
  productImage.src = oneData.image;
  productImage.alt = oneData.tags;
  productImage.classList.add("product-image");
  productDisplay.appendChild(productImage);

  const productTitle = document.createElement("h2");
  productTitle.textContent = oneData.title;

  const productDescription = document.createElement("p");
  productDescription.textContent = oneData.description;

  const productPrice = document.createElement("p");
  productPrice.textContent = `Price: ${oneData.price}`;

  const jacketButton = document.createElement("button");
  jacketButton.innerText = "Add to cart";

  productDisplay.appendChild(productTitle);
  productDisplay.appendChild(productDescription);
  productDisplay.appendChild(productPrice);
  document.querySelectorAll(".size-buttons").forEach((staticButton) => {
    staticButton.addEventListener("click", () => {
      handleStaticButtonClick(staticButton);
    });
  });

  sizeButtons.forEach((sizeButton) => {
    const buttonElement = document.createElement("button");
    buttonElement.textContent = sizeButton.textContent;
    buttonElement.classList.add("dynamic-size-buttons");

    buttonElement.addEventListener("click", () => {
      handleDynamicButtonClick(buttonElement);

      sizeButtons.forEach((otherButton) => {
        if (buttonElement && otherButton !== buttonElement) {
          console.log("Removing 'active' class from button:", otherButton);
          otherButton.classList.remove("active");
        }
      });

      buttonElement.classList.toggle("active");
      selectedButton = buttonElement;
    });

    productDisplay.appendChild(buttonElement);
  });

  const addToCartButton = document.createElement("button");
  addToCartButton.textContent = "Add to cart";
  addToCartButton.classList.add("button-add");
  addToCartButton.addEventListener("click", () => {
    if (selectedSize) {
      const selectedProduct = {
        id: oneData.id,
        title: oneData.title,
        size: selectedSize,
        quantity: 1,
        price: oneData.price,
      };
      addToCart(selectedProduct, selectedSize);
    } else {
      console.log("Please select a size before adding to cart");
    }
  });

  productDisplay.appendChild(addToCartButton);

  function getCartDataFromStorage() {
    const cartData = localStorage.getItem("cart");
    return JSON.parse(cartData) || [];
  }

  function addToCart(product, selectedSize) {
    let cart = getCartDataFromStorage();
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    console.log(product);

    // renderCartItem(product, selectedSize, product.quantity, product.price);
  }
}

renderOneProduct();
