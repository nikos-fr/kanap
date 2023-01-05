// cart
let b = fetch("http://localhost:3000/api/products")
  .then(res => res.json())
  .then(cart => {
    let display = ''
    for(let article of cart){
        display +=`
        <article class="cart__item" data-id="${_id}" data-color="${color}">             
        <div class="cart__item__img">
          <img src="${article.imageUrl}" alt="${article.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${article.name}</h2>
            <p>${article.colors}</p>
            <p>${article.price}</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>
        `
    }
    document.querySelector("#cart__items").innerHTML = display
})
.catch(err => {
  console.log("dans le catch")
  console.log(err)
})