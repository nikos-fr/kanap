const cartItems = document.getElementById("cart__items")

function computeTotal() {
    const quantity = document.getElementById("totalQuantity")
    const price = document.getElementById("totalPrice")
}
// recuperation du local storage
function getBasketInfo() {
    // calculer le nombre article total et leur prix 
    cartItems.innerHTML = ""
    const basket = JSON.parse(localStorage.getItem("basket"))
    console.log(basket);
    for (let product of basket){
        fetch("http://127.0.0.1:3000/api/products/" + product.id)
        .then((rep) => rep.json())
        .then((article) =>{
            article.quantity = product.quantity
            article.colors = product.color
            totalQuantity += product.quantity
            totalPrice += product.quantity * article.price
            // recuperation du dom pour le button suprimer et la quantité 
            const articleCard = displayArticle(article)
            const input = articleCard.querySelector("input")
            const itemQuantity =articleCard.querySelector(".cart__item__content__settings__quantity").querySelector("p")
            const deleteButton =articleCard.querySelector(".deleteItem")
            cartItems.appendChild (articleCard)
            // supression des article dans le panier 
            deleteButton.addEventListener("click",()=>{
                localStorage.setItem("basket", JSON.stringify(basket.filter(e=> e!= product)))
                 getBasketInfo()
            })
            input.addEventListener("change",()=>{
                const newQuantity = input.value
                product.quantity = newQuantity
                
                localStorage.setItem("basket", JSON.stringify(basket))
                itemQuantity.innerText = newQuantity 
            })
        })
        .catch ((err) =>{
            console.log(err); })   
    }
}

// creation du dom
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
    return articleCard
}
getBasketInfo()


// FORMULAIRE 
const order = document.querySelector("#order");
const form = document.querySelector(".cart__order__form");
const champs = document.querySelector(".cart__order__form__question");

// ecouter l'évenement  de la soumission du formulaire
form.addEventListener("submit", (event) => {
    event.preventDefault();

    let errors = 0;

    let prenom = document.querySelector("#firstName").value;
    let nom = document.querySelector("#lastName").value;
    let adresse = document.querySelector("#address").value;
    let ville = document.querySelector("#city").value;
    let mail = document.querySelector("#email").value;

    let firstName = /^[A-Z][A-Za-z\é\è\ê\ï\ë\-]+$/;
    let lastName = /^[A-Z][A-Za-z\é\è\ê\ï\ë\-]+$/;
    let address = /^[a-zA-Z0-9àèìòùÀÈÌÒÙÁÉÍÓÚÝâêîôûÂÊÎÔÛëïçÇ\s,'-]*$/;
    let city = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    let email = /^[A-z0-9._-]+[@]{1}[a-zA-Z0-9._-]+[.]{1}[a-zA-Z]{2,10}$/;

    // test de l'expression régulière avec condition que les champs soient remplis correctement et message d'alerte
    let messError1 = document.querySelector("#firstNameErrorMsg");
    if (firstName.test(prenom)) {
        messError1.innerText = "";
    } else {
        messError1.innerText = "Veuillez renseigner un prénom valide";
        errors++;
    }

    let messError2 = document.querySelector("#lastNameErrorMsg");
    if (lastName.test(nom)) {
        messError2.innerText = "";
    } else {
        messError2.innerText = "Veuillez renseigner un nom valide";
        errors++;
    }

    let messError3 = document.querySelector("#addressErrorMsg");
    if (address.test(adresse)) {
        messError3.innerText = "";
    } else {
        messError3.innerText = "Veuillez renseigner une adresse valide";
        errors++;
    }

    let messError4 = document.querySelector("#cityErrorMsg");
    if (city.test(ville)) {
        messError4.innerText = "";
    } else {
        messError4.innerText = "Veuillez renseigner une ville valide";
        errors++;
    }

    let messError = document.querySelector("#emailErrorMsg");
    if (email.test(mail)) {
        messError.innerText = "";
    } else {
        messError.innerText = "Veuillez renseigner un email valide";
        errors++;
    }
    // Nouvelle condition qui permet d'envoyer le formulaire si celui-ci est rempli et correctement
    if (errors === 0) {
        let contact = {
            firstName: document.querySelector("#firstName").value,
            lastName: document.querySelector("#lastName").value,
            address: document.querySelector("#address").value,
            city: document.querySelector("#city").value,
            email: document.querySelector("#email").value,
        };

        let products = [];

        //je fais une boucle pour pousser les id des articles dans le tableau products
        for (let product of basket) {
            products.push(product.id);
        }

        let command = JSON.stringify({ contact, products });

        //  appel de l'API avec fetch et envoie du formulaire avec la méthode post dans la page confirmation
        async function sendOrder() {
            let response = await fetch(
                "http://127.0.0.1:3000/api/products/order",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: command,
                }
            );
            if (response.ok) {
                // réponse du serveur
                const result = await response.json();

                // Je supprime le panier du localstorage
                function moveLocalStorage(key) {
                    localStorage.removeItem(key);
                }

                moveLocalStorage("basket");

                // envoie des informations dans la page confirmation
                window.location.href = `http://127.0.0.1:5500/front/html/confirmation.html?orderId=${result.orderId}`;
            }
            console.log(response);
        }

        sendOrder();
    } else {
        alert("Veuillez remplir le formulaire");
    }
});


// faire une fonction qui calcule le prix total et la quantité total du panier 