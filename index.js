import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCiwuCWIQyZlc0NcgU7dtsS-vZJqZ7nncA",
    authDomain: "storeweb-f854a.firebaseapp.com",
    databaseURL: "https://storeweb-f854a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "storeweb-f854a",
    storageBucket: "storeweb-f854a.appspot.com",
    messagingSenderId: "1040114774345",
    appId: "1:1040114774345:web:1084174ce90225a7e86a98",
    measurementId: "G-WJK5VM2RTJ"
  };

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const productInDB = ref(database, "products")

const productListEl = document.getElementById("product-list")

onValue(productInDB, function(snapshot){
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());

        refreshProductListEl();

        itemsArray.forEach(item => {
            appendItemToProductList(item);
        });
    } else {
        productListEl.innerHTML = "No items here... yet";
    }
});

function refreshProductListEl() {
    productListEl.innerHTML = "";
}

function appendItemToProductList(item) {
    let itemID = item[0];
    let itemValue = item[1];
    let newEl = document.createElement("tr");

    const imageCell = document.createElement("td");
    const imgEl = document.createElement("img");
    imgEl.src = itemValue.imageUrl;
    imgEl.style.width = "100px"; // Adjust as necessary
    imageCell.appendChild(imgEl);

    let nameCell = document.createElement("td");
    nameCell.textContent = itemValue.name; // Assuming itemValue is an object with a 'name' property

    let priceCell = document.createElement("td");
    priceCell.textContent = itemValue.price; // Assuming itemValue has a 'price' property

    let quantityCell = document.createElement("td");
    quantityCell.textContent = itemValue.quantity; // Assuming itemValue has a 'quantity' property

    // Append cells to the row
    newEl.appendChild(imageCell);
    newEl.appendChild(nameCell);
    newEl.appendChild(priceCell);
    newEl.appendChild(quantityCell);

    // Append the new row to the product list element
    productListEl.appendChild(newEl);
}