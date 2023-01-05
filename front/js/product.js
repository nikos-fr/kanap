// Recuperation de l'id du kanap selectionner par le client
const url = window.location.href
const newUrl = new URL(url);
const productId = newUrl.searchParams.get("id")

let a = fetch("http://localhost:3000/api/products/"+ productId)
  .then(res => res.json())
    .then(product => {
        let image = document.createElement('img')
        image.src = product.imageUrl;
        document.getElementsByClassName("item__img")[0].appendChild(image)
        ;
    })


