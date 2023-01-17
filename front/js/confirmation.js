window.onload = () => {
  getData();
};

/**
 * Récupération du numéro de commande pour l'afficher
 */
const getData = () => {
  const productsId = new URLSearchParams(window.location.search).get('orderId');
  if (productsId === null || productsId === "") {
    return alert("Une erreur c'est produite au moment de la commande");
  }
  document.getElementById('orderId').textContent = productsId;
}