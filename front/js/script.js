// 1 recuperer les article
// 2 construire html
// 3 injecter html dans le dom
// 3.1 pointer sur element items
// 3.2 INJECTER DANS LE DOM
const url = "http://localhost:3000/api/products";

<<<<<<< HEAD
const url = "http://localhost:3000/api/products";
=======
>>>>>>> 94680b979af255866e151724cafbd723d58b6311
let requestProducts = fetch(url)
  .then(res => res.json())
    .then(data => {
        let display = ''
        for(let article of data){
            display +=`
            <a href="./product.html?id=${article._id}">
            <article>
              <img src="${article.imageUrl}" alt="${article.altTxt}">
              <h3 class="productName">${article.name}</h3>
              <p class="productDescription">${article.description}</p>
            </article>
          </a>
            `
        }
        document.querySelector("#items").innerHTML = display
    })
  .catch(err => {
      console.log("Error fetch request :")
      console.log(err)
  })
<<<<<<< HEAD
console.log(requestProducts) 
=======
console.log(requestProducts)       
>>>>>>> 94680b979af255866e151724cafbd723d58b6311
