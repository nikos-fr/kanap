// Recuperation de l'id du kanap selectionner par le client
const url = window.location.href;
const newUrl = new URL(url);
const productId = newUrl.searchParams.get("id");

// appel de l'api
let requestProduct = fetch("http://localhost:3000/api/products/" + productId)
  // promesse de l'api
  .then(res => res.json())
  .then(product => {
    //creation du  dom de la page
    let image = document.createElement('img')
    image.src = product.imageUrl;
    document.getElementsByClassName("item__img")[0].appendChild(image);
    document.getElementById("title").innerText = product.name;
    document.getElementById("price").innerText = product.price;
    document.getElementById("description").innerText = product.description;
    // choix de la couleurs 
    for (const color of product.colors) {
      let colorOption = document.createElement("option")
      colorOption.innerText = color
      document.getElementById("colors").appendChild(colorOption)
      console.log(colorOption);
    }
  })
// clic du bouton ajouter au panier 
const addToCart = document.querySelector(".item__content__addButton");
addToCart.addEventListener('click', () => {
  console.log("click");
});
