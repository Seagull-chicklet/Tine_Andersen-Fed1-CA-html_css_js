const url = document.location;
console.log({ url });

const search = url.search;
const params = new URLSearchParams(search);

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

async function renderOneProduct() {
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

  const id = params.get("id");
  const oneData = await fetchOneProduct(id);
  console.log({ oneData });

  const productDisplay = document.getElementById("card-mini");

  productDisplay.innerHTML = "";

  const productImage = document.createElement("img");
  productImage.src = oneData.image;
  productImage.alt = oneData.tags;
  productImage.classList.add("product-image-cart");
  productDisplay.appendChild(productImage);

  const productTitle = document.createElement("h2");
  productTitle.textContent = oneData.title;
  productDisplay.appendChild(productTitle);

  const productDescription = document.createElement("p");
  productDescription.textContent = oneData.description;
  productDisplay.appendChild(productDescription);

  const productPrice = document.createElement("p");
  productPrice.textContent = `Price: ${oneData.price}`;
  productDisplay.appendChild(productPrice);

  const sizeLabel = document.createElement("label");
  sizeLabel.setAttribute("for", "sizeDropDown");
  sizeLabel.textContent = "Size";
  productDisplay.appendChild(sizeLabel);

  const sizeDropDown = document.createElement("select");
  sizeDropDown.name = "Size";
  sizeDropDown.classList.add("size-dropdown");

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  sizeOptions.forEach((size) => {
    const option = document.createElement("option");
    option.value = size;
    option.text = size;
    sizeDropDown.appendChild(option);
  });

  const sizeParam = params.get("size") || sizeOptions[0];
  sizeDropDown.value = sizeParam;

  productDisplay.appendChild(sizeDropDown);

  const quantityLabel = document.createElement("label");
  quantityLabel.setAttribute("for", "quantityDropDown");
  quantityLabel.textContent = "Quantity";
  productDisplay.appendChild(quantityLabel);

  const quantityDropDown = document.createElement("select");
  quantityDropDown.name = "Quantity";
  quantityDropDown.classList.add("quantity-adjust");

  const quantityOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  quantityOptions.forEach((quantity) => {
    const option = document.createElement("option");
    option.value = quantity;
    option.text = quantity;
    quantityDropDown.appendChild(option);
  });
  productDisplay.appendChild(quantityDropDown);

  const addToCartButton = document.createElement("button");
  addToCartButton.textContent = "Add to cart";
  addToCartButton.classList.add("button-add");
  addToCartButton.addEventListener("click", () => {
    const selectedSize = sizeDropDown.value;
    const selectedQuantity = quantityDropDown.value;
    handleAddToCartClick(oneData, selectedSize, selectedQuantity);
  });
  productDisplay.appendChild(addToCartButton);

  function handleAddToCartClick(productData, selectedSize, selectedQuantity) {
    let cart = getCartDataFromStorage();
    const selectedProduct = {
      id: oneData.id,
      title: oneData.title,
      size: selectedSize,
      quantity: selectedQuantity,
      price: oneData.price,
    };
    cart.push(selectedProduct);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItem(productData, selectedSize, selectedQuantity);
  }

  function getCartDataFromStorage() {
    const cartData = localStorage.getItem("cart");
    return JSON.parse(cartData) || [];
  }

  function renderCartItem(productData, selectedSize, selectedQuantity) {
    const cartItemContainer = document.getElementById("card-mini");

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

    const trashCanIcon = document.createElement("i");
    trashCanIcon.classList.add("fa-solid", "fa-trash-can");

    const trashCanContainer = document.createElement("div");
    trashCanContainer.classList.add("product-trash");
    trashCanContainer.appendChild(trashCanIcon);
    cartItem.appendChild(trashCanContainer);

    trashCanContainer.addEventListener("click", () => {
      const parentElement = trashCanContainer.parentElement;
      parentElement.remove();
      const productId = parentElement.dataset.productId;
      deleteProductOnServer(productId);
    });

    function deleteProductOnServer(productId) {
      fetch(`https://api.noroff.dev/api/v1/rainy-days/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("Product deleted on server");
          } else {
            console.error("Error deleting product on the server.");
          }
        })
        .catch((error) => {
          console.error("Error making API call:", error);
        });
    }

    cartItemContainer.appendChild(cartItem);
  }

  renderOneProduct();
}
