window.onload = () => {
  getData();
};

/**
 * Requête du back pour récupérer l'id du produit.
 * @async
 */
const getData = async () => {
  // Récupère id du produit dans l'url
  const productId = new URLSearchParams(window.location.search).get('id');
  const urlDataId = `http://localhost:3000/api/products/${productId}`;
  try {
    const response = await fetch(urlDataId);
    if (!response.ok) {
      throw new Error(
        //litteraux de gabarit
        `Erreur de requête, veuiller vérifier l'état du serveur ${response.status}`
      );
    }
    const product = await response.json();
    productData(product);
  } catch (error) {
    alert(error);
  }
};

/**
 * Cette fonction créée les élements HTML pour les injecter dans le DOM (Document Object Model).
 * @param {Object} element
 */
const productData = (element) => {
  const itemImg = document.getElementsByClassName('item__img');
  const productImg = document.createElement('img');
  productImg.setAttribute('src', element.imageUrl);
  productImg.setAttribute('alt', element.altTxt);
  itemImg[0].append(productImg);
  document.getElementById('title').textContent = element.name;
  document.getElementById('price').textContent = element.price;
  document.getElementById('description').textContent = element.description;
  // Création des options du selecteur avec les couleurs disponibles
  element.colors.forEach((color) => {
    let opt = new Option(color, color);
    document.getElementById('colors').append(opt);
  });
  bindEvent(element._id);
};

/** Ajouter un écouteur d'évènement au clique à l'élément pour l'ajout au panier en faisant appel à la fonction "addBasket".
 * @listens <#addToCart>
 * @param {Object} idProduct
 */
const bindEvent = (idProduct) => {
  // Attacher un écouteur d'évènement avec un clique sur le bouton ayant l'id "addToCart"
  document.getElementById('addToCart').addEventListener('click', () => {
    addBasket(idProduct);
  });
};

/**
 * Cette fonction récupère la valeur et vérifie qu'elle n'est pas vide étant comprise entre 1 et 100.
 * Annuler la suppression du clique.
 * @listens <#addToCart>
 * @returns {value or false}
 */
const checkQuantity = () => {
  const quantValue = document.getElementById('quantity').value;
  if (quantValue <= 0 || quantValue > 100 || quantValue == '') {
    alert("Spécifier la quantité désirée valide");
    document.getElementById('addToCart').disabled = false;
    return false;
  }
  return quantValue;
}

/**
 * Cette fonction récupère la valeur de l'option sélectionnée et vérifie qu'elle n'est pas vide.
 * Annuler la suppression du clique.
 * @listens <#addToCart>
 * @returns {value or false}
 */
const checkColors = () => {
  const choiseColor = document.getElementById('colors').value;
  if (choiseColor == "") {
    alert("Spécifier la couleur désirée");
    document.getElementById('addToCart').disabled = false;
    return false;
  }
  return choiseColor;
};

/**
 * Une fois que le clique sur l'id "addToCart" est effectué, le bouton est désactivé ce qui évite un multiple ajout.
 * Recherche les éléments qui ont l'id et la couleur recherchée.
 * Si le "localStorage" et vide l'objet y est ajouté.
 * Si l'élément est trouvé dans le "localStorage", une quantité lui est ajouté.
 * @listens <#addToCart>
 * @param {String} idProd
 * @return {false}
 */
const addBasket = (idProd) => {
  document.getElementById('addToCart').disabled = true;
  // Deux variables avec le résultat de leur fonction
  const quant = checkQuantity();
  const color = checkColors();
  if (quant && color) {
    const prod = {
      id: idProd,
      quantProd: quant,
      colorProd: color
    };
    let basket;
    // S'il n'y a pas d'objet "storage" dans le localStorage, je pousse l'objet "prod" dans le tableau vide créé
    if (!localStorage.getItem('storage')) {
      basket = [];
      basket.push(prod);
    } else {
      basket = JSON.parse(localStorage.getItem('storage'));
      // Je recherche un élément dans basket qui a le même identifiant et la même couleur
      const result = basket.find(elem => elem.id === idProd && elem.colorProd === color);
      // Si j'ai un résultat je modifie la quantité
      if (result) {
        const newQty = parseInt(result.quantProd) + parseInt(quant);
        result.quantProd = newQty;
        // Je vérifie que la quantité pour la couleur choisie ne dépasse pas "100"
        if (result.quantProd > 100) {
          alert("Vous avez atteint la quantité maximale pour cette couleur");
          document.getElementById('addToCart').disabled = false;
          return;
        }
        // Sinon je pousse mon objet dans mon tableau
      } else {
        basket.push(prod);
      }
    }

    /**
     * Ajout dans le "localStorage". L'objet est changé en chaine de caractère.
     * Annuler la suppression du clique.
     */
    localStorage.setItem('storage', JSON.stringify(basket));
    alert("Le produit est ajouté au panier");
    document.getElementById('addToCart').disabled = false;
  }
  // Je retourne "false" pour cloturer la fonction
  return false;
};