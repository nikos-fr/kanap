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
addToCart.addEventListener('click', saveOrder)


// 1- Créer une fonction pour stocker la key et value pour chaques produit et de push en localstorage
// 2- Executer la fonction quand la personne click sur le CTA
// 3- Vérifier qu'une option est bien séléctionné et une quantitée avant le click / Sinon envoyer une alerte
// 4- Créer une fonction globale avec queryselector pour prendre les valeurs et vérifier que toutes les conditions sont bien remplies avant du push en local storage

const quantity = document.querySelector(#quantity).value
const color = document.querySelector(#colors).value
const price = document.querySelector(#price).value

function saveOrder(color, quantity){
  // const quantity = document.querySelector(#quantity).value
  // const color = document.querySelector(#colors).value
  // const price = document.querySelector(#price).value
  const key = '${productId}_${color}'
  const value = {
      color: color,
      quantity: quantity,
      price: price,
      imageUrl: XX,
      altTxt: XX,
      name: XX
  }
  localStorage.setItem(key, JSON.stringify(value))
}