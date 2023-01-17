window.onload = () => {
  productId();
};

/**
 * J'indique à l'utilisateur que le panier est vide
 * Sinon création d'un tableau vide et récupèrer les données envoyées du back en les vérifiants
 * pour les pousser dans ce tableau avec la fontcion "displayData".
 * @async
 */
const productId = async () => {
  let dataTot = [];
  if (!localStorage.getItem('storage') || localStorage.getItem('storage').length === 0) {
    document.getElementById('cartAndFormContainer').firstElementChild.textContent = "Votre panier est vide";
  } else {
    const readBasket = JSON.parse(localStorage.getItem('storage'));
    for (let element of readBasket) {
      const urlData = `http://localhost:3000/api/products/${element.id}`;
      try {
        const response = await fetch(urlData);
        if (!response.ok) {
          throw new Error(
            //litteraux de gabarit
            `Erreur de requête, veuiller vérifier l'état du serveur ${response.status}`
          );
        }
        let product = await response.json();
        product.colorProd = element.colorProd;
        product.quantProd = element.quantProd;
        dataTot.push(product);
        displayProduct(product, dataTot);
      } catch (error) {
        alert(error);
      }
    }
    updateTot(dataTot);
  }
  addEvent();
};

/**
 * Cette fonction permet d'afficher les produits dans le panier contenant le prix la quantité et la couleur.
 * Ajouter un écouteur d'évènement au clique pour la modification de la quantité et de la suppression du produit.
 * @param {Object} product
 * @param {Array} dataTot
 * @param {Object} event <-- Évennement
 */
const displayProduct = (product, dataTot) => {
  const cartItems = document.getElementById('cart__items');
  const article = document.createElement('article');
  article.className = 'cart__item';
  article.setAttribute('data-id', product._id);
  article.setAttribute('data-color', product.colorProd);
  const divImg = document.createElement('div');
  divImg.className = 'cart__item__img';
  const image = document.createElement('img');
  image.setAttribute('src', product.imageUrl);
  image.setAttribute('alt', product.altTxt);
  const divBlockDesc = document.createElement('div');
  divBlockDesc.className = 'cart__item__content';
  const divDesc = document.createElement('div');
  divDesc.className = 'cart__item__content__description';
  const title = document.createElement('h2');
  title.textContent = product.name;
  const paraColor = document.createElement('p');
  paraColor.textContent = product.colorProd;
  const paraPrice = document.createElement('p');
  paraPrice.textContent = product.price + "€";
  const divBlockQty = document.createElement('div');
  divBlockQty.className = 'cart__item__content__settings';
  const divQty = document.createElement('div');
  divQty.className = 'cart__item__content__settings__quantity';
  const paraQty = document.createElement('p');
  paraQty.textContent = "Quantité: ";
  const inputQty = document.createElement('input');
  inputQty.className = 'itemQuantity';
  inputQty.setAttribute('type', 'number');
  inputQty.setAttribute('name', 'itemQuantity');
  inputQty.setAttribute('min', '0');
  inputQty.setAttribute('max', '100');
  inputQty.setAttribute('value', product.quantProd);
  inputQty.addEventListener('change', (event) => {
    changeQuant(event, dataTot);
  });
  const divDelete = document.createElement('div');
  divDelete.className = 'cart__item__content__settings__delete';
  const paraDelete = document.createElement('p');
  paraDelete.className = 'deleteItem';
  paraDelete.textContent = "Supprimer";
  paraDelete.addEventListener('click', (event) => {
    deleteProd(event, dataTot);
  });
  divDelete.append(paraDelete);
  divQty.append(paraQty, inputQty);
  divBlockQty.append(divQty, divDelete);
  divDesc.append(title, paraColor, paraPrice);
  divBlockDesc.append(divDesc, divBlockQty);
  divImg.append(image);
  article.append(divImg, divBlockDesc);
  cartItems.append(article);
}

/**
 * Récupération du "localStorage".
 * Recherche du produit, puis le supprimer en utilisant une boucle.
 * @param {Object} event <-- Évennement
 * @param {Array} dataTot
 */
const deleteProd = (event, dataTot) => {
  // Je cible l'évennement dans la variable "element"
  const element = event.target;
  // Ce qui me permet de ciblé l'évennement à l'élément "article" le plus proche avec "closest"
  const art = element.closest('article');
  const thisId = art.getAttribute('data-id');
  const thisColor = art.getAttribute('data-color');
  const readBasket = JSON.parse(localStorage.getItem('storage'));

  readBasket.forEach((element, index) => {
    // Si l'id et la couleur de "element" correspond à ceux de "art" en utilisant la boucle "forEach"
    if (element.id === thisId && element.colorProd === thisColor) {
      // Je supprime l'élement en utilisant son index
      dataTot.splice(index, 1);
      readBasket.splice(index, 1);
      alert("Le produit est supprimé");
    }
  });
  // Je vérifie si le tableau est vide, si c'est le cas, je supprime la clé "storage" dans le localStorage
  // et j'insère un texte pour le signaler à l'utilisateur
  if (readBasket.length === 0) {
    localStorage.clear();
    document.getElementById('cartAndFormContainer').firstElementChild.textContent = "Votre panier est vide";
    // Sinon je met à jour la valeur si la clé existe déjà
  } else {
    localStorage.setItem('storage', JSON.stringify(readBasket));
  }
  //  Je retire l'élément et met à jour la totalité avec l'appel de la fontcion "updateTot"
  art.remove();
  updateTot(dataTot);
}

/**
 * Mise à jour de l'utilisateur du nombre, de la quantité et du prix du ou des produit(s).
 * @param {Array} dataTot
 */
const updateTot = (dataTot) => {
  let totalPrice = 0;
  let totalQuantity = 0;
  // Boucle "for of" pour calculer le prix avec la quantité des produits
  for (let element of dataTot) {
    totalPrice += parseInt(element.price) * parseInt(element.quantProd);
    totalQuantity += parseInt(element.quantProd);
  }
  document.getElementById('totalQuantity').textContent = totalQuantity;
  document.getElementById('totalPrice').textContent = totalPrice;
}

/**
 * Récupération du "localStorage".
 * Recherche du produit et de ces attributs pour modifier sa quantité.
 * Si le produit est trouvé, transformer une chaine de caractère en nombre pour modifier sa quantité.
 * @param {Object} event
 * @param {Array} dataTot
 */
const changeQuant = (event, dataTot) => {
  // "defaultValue" est une propriété de l'objet JavaScript qui représente la valeur par défaut
  // que je mets à jour à chaque fois si la valeur est conforme (entre 1 et 100)
  const oldValue = event.target.defaultValue;
  const newValue = event.target.value;
  // Je test la nouvelle valeur qui vient d'être modifiée
  if (newValue > 100 || newValue <= 0) {
    event.target.value = oldValue;
    // Une alerte est créée si la valeur de la quantité dépasse "100" ou est inférieur ou égale à "0"
    alert("La quantité saisie n'est pas pris en compte");
    return;
  } else {
    event.target.defaultValue = event.target.value;
  }
  const quantValue = document.querySelector('.itemQuantity').value;
  const art = event.target.closest('article');
  const thisId = art.getAttribute('data-id');
  const thisColor = art.getAttribute('data-color');
  const readBasket = JSON.parse(localStorage.getItem('storage'));
  let index = readBasket.findIndex(elem => elem.id === thisId && elem.colorProd === thisColor);
  if (index != -1) {
    dataTot[index].quantProd = parseInt(event.target.value);
    readBasket[index].quantProd = parseInt(event.target.value);
  }
  // Je mets à jour le panier dans le localStorage et je mets à jour
  // les totaux en appelant la fonction "updateTot"
  localStorage.setItem('storage', JSON.stringify(readBasket));
  updateTot(dataTot);
}

/**
 * Ajouter un écouteur d'évènement au clique pour commander.
 * @listens <#order>
 */
const addEvent = () => {
  // J'appel les fonction incluant les regex aux champs
  document.getElementById('order').addEventListener('click', sendOrder);
  document.getElementById('firstName').addEventListener('change', (event) => {
    regexNameCity(event.target.value, 'firstName');
  });
  document.getElementById('lastName').addEventListener('change', (event) => {
    regexNameCity(event.target.value, 'lastName');
  });
  document.getElementById('address').addEventListener('change', (event) => {
    regexAddress(event.target.value, 'address');
  });
  document.getElementById('city').addEventListener('change', (event) => {
    regexNameCity(event.target.value, 'city');
  });
  document.getElementById('email').addEventListener('change', (event) => {
    regexMail(event.target.value, 'email');
  });
}

/**
 * Envoie la commande du contact au back.
 * @param {Object} event <-- Évennement
 */
const sendOrder = async (event) => {
  // J'empêche le comportement par défaut du formulaire qui est de recharger
  // une page après sa soumission
  event.preventDefault();
  const contact = getData();
  if (!contact) {
    alert("Veuillez remplir correctement le formulaire");
    return false;
  } else if (localStorage.getItem('storage').quantProd > 100 || localStorage.getItem('storage').quantProd < 1) {
    alert("Veuillez définir une quantité valide");
  }
  const products = getCart();
  if (products.length === 0) {
    alert("Panier vide");
    return false;
  }
  const pageOrder = {
    contact,
    products
  };
  const options = {
    // Requête "POST" pour l'envoi et attend la réponse dans le type de média spécifié
    // (langage d'échange json -> JavaScript Object Notation) en en-tête
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    // La requête du corp est transformé en chaîne de carctères
    body: JSON.stringify(pageOrder),
  }
  try {
    const urlOrder = await fetch('http://localhost:3000/api/products/order', options);
    if (!urlOrder.ok) {
      throw new Error(`Aucune réponse ${urlOrder.status}`);
    }
    const confirm = await urlOrder.json();
    window.location.href = `./confirmation.html?orderId=${confirm.orderId}`;
    localStorage.clear();
  } catch (error) {
    alert(`L'envoie n'a pas été effectué : ${error}`);
  }
}

/**
 *
 * @return {false} <-- Si le panier est vide
 * @return {true} <-- Un produit est ajouté à la confirmation de la commande
 */
const getCart = () => {
  let prod = [];
  const cart = JSON.parse(localStorage.getItem('storage'));
  // Si le localStorage est vide une alerte l'informe
  if (cart === null) {
    alert("Veuillez ajouter au moins un article dans le panier");
    return false;
  }
  // Je pousse un élément
  cart.forEach(element => {
    prod.push(element.id);
  })
  return prod;
}

/**
 * Récupérer la valeur des champs du formulaire.
 * @return {false} <-- Si les valeurs du champs sont incorrect
 * @return {true} <-- Si les valeurs du champs correspondent au regex demandé création du contact
*/
const getData = () => {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const email = document.getElementById('email').value;
  // Si l'appel est contraire aux fonctions incluant les regex une alerte l'informe
  // et je retourne "false" pour cloturer la fonction "getData"
  if (
    !regexNameCity(firstName, 'firstName') ||
    !regexNameCity(lastName, 'lastName') ||
    !regexAddress(address, 'address') ||
    !regexNameCity(city, 'city') ||
    !regexMail(email, 'email')
  ) {
    alert("Tout les champs ne sont pas renseignés correctement");
    return false;
  }
  // Ou je créé l'objet contact et le retourne
  let contact = {
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email
  };
  return contact
}

/**
 * Contrôle la validité des champs.
 * @param {String} val <-- Valeur du champs
 * @param {String} name <-- Nom du champs
 * @returns
 */
const regexNameCity = (val, name) => {
  const regexName = new RegExp(
    /^[^1-9²&~#"{}'()|\`^+=*,.?;:!§ù%¨$£¤µ<>°@_-]+$/gi
  )
  const resName = regexName.test(val);

  if (!resName) {
    const textFalse = document.getElementById(`${name}ErrorMsg`);
    textFalse.textContent = "Saisie Invalide";
    textFalse.style.fontSize = 'small';
    textFalse.style.color = 'red';
    return false;
  } else {
    document.getElementById(`${name}ErrorMsg`).textContent = "";
    return true;
  }
}

const regexAddress = (val, name) => {
  const regexAddress = new RegExp(
    /^[1-9a-z][^²&~#"{}()|\`^+=*,.?;:!§ù%¨$£¤µ<>°@_-]+$/gi
  )
  const resAddress = regexAddress.test(val);

  if (!resAddress) {
    const textFalse = document.getElementById(`${name}ErrorMsg`);
    textFalse.textContent = "Saisie invalide";
    textFalse.style.fontSize = 'small';
    textFalse.style.color = 'red';
    return false;
  } else {
    document.getElementById(`${name}ErrorMsg`).textContent = "";
    return true;
  }
}

const regexMail = (val, name) => {
  const regexMail = new RegExp(
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
  )
  const resMail = regexMail.test(val);

  if (!resMail) {
    const textFalse = document.getElementById(`${name}ErrorMsg`);
    textFalse.textContent = "Saisie invalide";
    textFalse.style.fontSize = 'small';
    textFalse.style.color = 'red';
    return false;
  } else {
    document.getElementById(`${name}ErrorMsg`).textContent = "";
    return true;
  }
}