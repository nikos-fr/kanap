// récupération de l'url avec window.location.href qui permet de récupérer l'url de la page courante

const newLocal = new URL(window.location.href);

//création d'une variable id pour récupérer les articles

const productId = newLocal.searchParams.get(`id`);

// récupération des différents articles
try {
  fetch("http://localhost:3000/api/products/" + productId)
    .then((rep) => rep.json())
    .then((article) => {
      // récupération des informations des produits

      document.querySelector(
        ".item__img"
      ).innerHTML = `<img src="${article.imageUrl}" alt="${article.altTxt}">`;
      document.querySelector("#title").innerHTML = article.name;
      document.querySelector("#price").innerHTML = article.price;
      document.querySelector("#description").innerHTML = article.description;

      document.querySelector("option").value = "default";
      document.title = article.name;
      // récupération des couleurs des produits avec une boucle afin d'afficher toute les couleurs
      for (let couleur of article.colors) {
        // création d'une constante color et récupération de la balise html <option> dans laquelle on injecte la couleur
        const color = `<option value="${couleur}">${couleur}</option>`;

        // insertion des différentes couleurs
        document
          .querySelector("#colors")
          .insertAdjacentHTML("beforeend", color);
      }
    });
} catch (err) {
  console.log(err);
}

//  Selection bouton
const addToCart = document.querySelector("#addToCart");

// écouter le click du bouton addToCart
addToCart.addEventListener("click", () => {
  // sélectionner les valeur des quantités et couleurs
  const quantity = document.querySelector("#quantity").value;
  const color = colors.value;
  const id = productId._id;

  // condition des valeurs au click à la selection du client
  if (color !== "default" && quantity >= 1 && quantity <= 100) {
    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    // récupérer les propriétés de l'article en objet
    let product = {
      id: productId,
      color: color,
      quantity: parseInt(quantity),
    };
    // rajouter un article mm id mm couleur dans le localstorage sur une meme ligne
    let cartFound = basket.find(
      (p) => p.id == product.id && p.color == product.color
    );
    if (cartFound != undefined) {
      cartFound.quantity += parseInt(quantity);
      if (cartFound.quantity > 100) {
        alert ("Vous ne pouvez pas avoir plus de 100 canapé")
        cartFound.quantity = 100
      }
    }
    // récupère le panier dans le localstorage
    else basket.push(product);
    // permet de rajouter les valeurs sélectionnées dans le localst
    localStorage.setItem("basket", JSON.stringify(basket));
  } else {
    alert("Veuillez sélectionnez une couleur et une quantité valide");
  }
});
