const jacketsUrl = "https://api.noroff.dev/api/v1/rainy-days/";

async function getJackets() {
  try {
    const res = await fetch(jacketsUrl);
    const jackets = await res.json();
    console.log("Fetched jackets;", jackets);
    return jackets;
  } catch (error) {
    console.error("Error finding great stuff:", error);
    throw error;
  }
}

function renderJacket(jacket) {
  const section = document.querySelector(".motorcycle-wrapping");

  if (!section) {
    console.error("Section not found");
    return;
  }
  const jacketImage = document.createElement("img");
  jacketImage.src = jacket.image;
  jacketImage.alt = jacket.tags;

  jacketImage.classList.add("product-image");

  const jacketDiv = document.createElement("div");
  const jacketTitle = document.createElement("h2");
  jacketTitle.innerText = jacket.title;
  const jacketDescribe = document.createElement("p");
  jacketDescribe.innerText = jacket.description;
  const jacketButton = document.createElement("button");
  jacketButton.innerText = jacket.price;

  jacketDiv.appendChild(jacketImage);
  jacketDiv.appendChild(jacketTitle);
  jacketDiv.appendChild(jacketDescribe);
  jacketDiv.appendChild(jacketButton);

  jacketDiv.classList.add("product-image");
  jacketDiv.classList.add("product-card");
  jacketButton.classList.add("button-add");
  addToCartButton.addEventListener("click", () => {
    window.location.href = `cart.html?id=${oneData.id}`;
  });
  section.appendChild(jacketDiv);
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
renderJackets();
