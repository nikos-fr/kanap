const cartItems = document.getElementById("cart__items")

// recuperation du local storage
function getBasketInfo() {
    const basket = JSON.parse(localStorage.getItem("basket"))
    for (let product of basket){
        fetch("http://127.0.0.1:3000/api/products/" + product.id)
        .then((rep) => rep.json())
        .then((article) =>{
            article.quantity = product.quantity
            article.colors = product.color
            displayArticle(article)
        })
        .catch ((err) =>{
            console.log(err); })   
    }
}
function displayArticle(article) {
    const articleCard = document.createElement("article")
    articleCard.setAttribute("class", "cart__item")
    articleCard.setAttribute("data-id", article.id)
    articleCard.setAttribute("data-color",article.colors)
    articleCard.innerHTML = `
    <div class="cart__item__img">
      <img src="${article.imageUrl}" alt="Photographie d'un canapé">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${article.name}</h2>
        <p>${article.colors}</p>
        <p>${article.price}€</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>${article.quantity}</p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
    ` 
    cartItems.appendChild(articleCard)
}
getBasketInfo()


// il me reste a calculé le nombre total des article ainsi que sont prix total 
// modification du DOM et du local storage au changement des input et a la suppression d'un produit 
// gerer le formulaire 