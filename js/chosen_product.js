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

  const sizeButtons = ["S", "M", "L", "XL", "XXL"];

  sizeButtons.forEach((size) => {
    const sizeButton = document.createElement("button");
    sizeButton.textContent = size;
    sizeButton.classList.add("size-buttons");
    productDisplay.appendChild(sizeButton);
  });
  const addToCartButton = document.createElement("button");
  addToCartButton.textContent = "Add to cart";
  addToCartButton.classList.add("button-add");
  addToCartButton.addEventListener("click", () => {
    window.location.href = `cart.html?id=${oneData.id}`;
  });
  productDisplay.appendChild(addToCartButton);
}

renderOneProduct();
