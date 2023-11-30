const URL = "https://api.noroff.dev/api/v1/rainy-days/";

const jacket_function = async (url) => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();

      return data;
    } else {
      throw new Error("We got issues, when reaching the server");
    }
  } catch (error) {
    console.log(error);
  }
};

// async function renderData() {
//   const data = await jacket_function(URL);
//   const container = document.querySelector("#cards");
//   container.innerHTML = "";

//   data.forEach((element) => {
//     const card = createCard(element);
//     container.append(card);
//   });

//   const greeting = document.querySelector(".greeting");

//   function changeGreeting() {
//     greeting.innerHTML = "Found it.";
//   }
//   setTimeout(changeGreeting, 3000);

//   const loading = document.querySelector(".loader");

//   setTimeout(function () {
//     loading.classList.remove("loading-indicator");
//   }, 1000);

//   function createCard(element) {
//     const { id, title, description, image } = element;
//     if (!id || !title || !description) {
//       const errorMessage = new Error(
//         `invalid data detected. the data is ${JSON.stringify(element)}`
//       );
//       console.log(errorMessage);
//       return;
//     }
//     const divElement = document.createElement("div");
//     const h2Element = document.createElement("h2");
//     const pElement = document.createElement("p");
//     const h3Element = document.createElement("h3");
//     const buttonElement = document.createElement("button");
//     const imageElement = document.createElement("img");
//     imageElement.src = image;
//     imageElement.classList.add("product-image");
//     divElement.classList.add("product-card");
//     buttonElement.classList.add("button-add");
//     buttonElement.innerText = "Look at me";
//     divElement.id = element.id;
//     divElement.addEventListener("click", () => {
//       window.location.href = `../html/chosen_product.html?id=${element.id}`;
//     });
//     h2Element.textContent = element.title;
//     pElement.textContent = element.description;
//     h3Element.textContent = element.price;
//     divElement.append(
//       imageElement,
//       h2Element,
//       pElement,
//       h3Element,
//       buttonElement
//     );
//     return divElement;
//   }
// }

// renderData()
