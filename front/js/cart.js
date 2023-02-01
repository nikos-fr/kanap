// récupération du mon panier dans le local storage
const basket = JSON.parse(localStorage.getItem("basket"));

// Condition pour le cas où le panier est vide ou supprimé
if (basket === null || basket.length == 0) {
    alert("votre panier est vide");
    window.location.href = `http://127.0.0.1:5500/front/html/index.html`;
} else {
    // Je fais une boucle pour chaque produit qui se trouvent dans le panier
    // et je récupère les info qui manque dans l'API avec fetch (prix, image) pour les insérer dans le DOM
    basket.forEach((product) => {
        fetch("http://127.0.0.1:3000/api/products/" + product.id)
            .then((rep) => rep.json())
            .then((data) => {
                // j'indique tout ce que je dois afficher sur ma page
                let structurebasket = ``;

                structurebasket += `
        <article class="cart__item" data-id="${data._id}" data-color="${product.color}">
    <div class="cart__item__img">
      <img src="${data.imageUrl}" alt="${data.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${data.name}</h2>
        <p>${product.color}</p>
        <p>${data.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>
    `;

                document
                    .querySelector("#cart__items")
                    .insertAdjacentHTML("beforeend", structurebasket);

                ////////////////////////////////////// total du prix et du nombre d'article////////////////////////////////////////
                // Dans cette fonction, je vais récupérer le prix et les quantités total de mon panier,
                // faire en sorte de pouvoir changer les quantités en mettant à jour le prix total
                // et pouvoir supprimer ou plusieurs articles et faire la mise à jour
                async function setTotalPriceQuantity() {
                    let totalPrice = 0;
                    let totalQuantity = 0;

                    //  je fais une boucle pour aller chercher les prix et les quantités dans le panier en appelant l'API avec fetch
                    //  pour faire les totaux et les afficher dans le DOM
                    for (let product of basket) {
                        let productPrice = await fetch(
                            "http://127.0.0.1:3000/api/products/" + product.id
                        )
                            .then((rep) => rep.json())
                            .then((productData) => {
                                return productData.price;
                            });

                        totalPrice += productPrice * parseInt(product.quantity);
                        totalQuantity += parseInt(product.quantity);
                    }

                    document.querySelector("#totalPrice").textContent =
                        totalPrice;
                    document.querySelector("#totalQuantity").textContent =
                        totalQuantity;
                }

                setTotalPriceQuantity();

                ///////////////////////// supprimer un article////////////////////////////

                let deleteItems = document.querySelectorAll(".deleteItem");
                //  je fait une boucle sur le bouton de chaque produit et j'écoute au click les articles que je veux supprimer
                // en recherchant le parent le plus proche afin de sélectionner les couleur et id
                for (let move of deleteItems) {
                    move.addEventListener("click", () => {
                        let closest = move.closest(".cart__item");
                        let closestColor = closest.getAttribute("data-color");
                        let closestId = closest.getAttribute("data-id");

                        // boucle avec condition des couleur et id avecla méthode splice pour retirer les éléments ciblés du tableau
                        for (let product of basket) {
                            if (
                                product.color === closestColor &&
                                product.id === closestId
                            ) {
                                basket.splice(basket.indexOf(product), 1);
                            }
                        }
                        closest.remove();

                        // je change les nouvelles valeurs  dans le localstorage
                        localStorage.setItem("basket", JSON.stringify(basket));

                        setTotalPriceQuantity();
                    });
                }

                ////////////////////////////////changement quantité dans panier///////////////////////////////////////////

                let changeItems = document.querySelectorAll(".itemQuantity");
                //  boucle sur l'input avec un eventListener change qui permet d'écouter le changement des quantités
                // en recherchant le parent le plus proche afin de sélectionner les couleur et id
                for (let input of changeItems) {
                    input.addEventListener("change", () => {
                        if (input.value >= 1 && input.value <= 100) {
                            let closest = input.closest(".cart__item");
                            let closestColor =
                                closest.getAttribute("data-color");
                            let closestId = closest.getAttribute("data-id");

                            for (let product of basket) {
                                if (
                                    product.color === closestColor &&
                                    product.id === closestId
                                ) {
                                    product.quantity = parseInt(input.value);
                                }
                            }

                            // je change les nouvelles valeurs dans le local storage
                            localStorage.setItem(
                                "basket",
                                JSON.stringify(basket)
                            );

                            setTotalPriceQuantity();
                        } else {
                            window.alert(
                                "Veuillez saisir une quantité valide entre 1 et 100"
                            );
                        }
                    });
                }
            });
    });
}
//////////////////////////////////////////FORMULAIRE////////////////////////////////////////////////////////

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
