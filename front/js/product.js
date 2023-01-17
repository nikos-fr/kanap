init()
async function init() {
  const product = await createProduct()
  displayProduct(product)
}

async function createProduct() {
  const url = window.location.href;
  const newUrl = new URL(url);
  const productId = newUrl.searchParams.get("id")
  try {
    const response = await fetch("http://localhost:3000/api/products/" + productId)
    const body = response.json()
    return body
  } catch (error) {
    alert("Probleme serveur")
  }
}

function displayProduct(product) {
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
  } 
}
// clic du bouton ajouter au panier 
const addToCart = document.querySelector(".item__content__addButton");
addToCart.addEventListener('click', saveOrder)


// 1- Créer une fonction pour stocker la key et value pour chaques produit et de push en localstorage
// 2- Executer la fonction quand la personne click sur le CTA
// 3- Vérifier qu'une option est bien séléctionné et une quantitée avant le click / Sinon envoyer une alerte
// 4- Créer une fonction globale avec queryselector pour prendre les valeurs et vérifier que toutes les conditions sont bien remplies avant du push en local storage

const quantity = document.querySelector("#quantity").value
const color = document.querySelector("#colors").value
const price = document.querySelector("#price").value

function saveOrder(color, quantity){
  const key = '${productId}_${color}'
  const value = {
      color: color,
      quantity: quantity,
      price: price,
  }
  localStorage.setItem(key, JSON.stringify(value))
}







