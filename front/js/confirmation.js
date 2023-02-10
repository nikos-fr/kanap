// Récupération de l'id de la commande grace au serveur pour l'afficher sur la page

const newLocal = new URL(window.location.href);
const orderId = newLocal.searchParams.get(`orderId`);

// Structure HTML de la page confirmation
const confirm = (document.querySelector("#orderId").textContent = orderId);
