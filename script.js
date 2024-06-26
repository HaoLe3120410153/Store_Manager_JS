import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref as dbRef, push, onValue, remove, update} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage, ref as strRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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
const storage = getStorage(app);
const productInDB = dbRef(database, 'products');

const productListEl = document.getElementById("product-list")

// Modal element
const modal = document.getElementById('editModal');

// Close button in modal
const closeBtn = document.getElementsByClassName('close')[0];

// Form and inputs in modal
const editForm = document.getElementById('editForm');
const editNameInput = document.getElementById('editName');
const editPriceInput = document.getElementById('editPrice');
const editQuantityInput = document.getElementById('editQuantity');

//Add
const inputProNameEl = document.getElementById("input-pro-name")
const inputProPriceEl = document.getElementById("input-pro-price")
const inputProQuantityEl = document.getElementById("input-pro-quantity")
const addButtonEl = document.getElementById("add-button")
let currentEditItemID = null;

addButtonEl.addEventListener("click", function(){
    let inputNameValue = inputProNameEl.value
    let inputPriceValue = inputProPriceEl.value
    let inputQuantityValue = inputProQuantityEl.value
    const file = document.getElementById('input-file').files[0];
    if (!file) {
        console.error("No file selected.");
        return;
    }
    const storageRef = strRef(storage, 'images/' + file.name);

    uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!', snapshot);
        // Get the download URL
        getDownloadURL(snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            push(productInDB, {
                name: inputNameValue,
                price: inputPriceValue,
                quantity: inputQuantityValue,// Default quantity
                imageUrl: downloadURL
            });
        });
    }).catch((error) => {
        console.error('Upload failed', error);
    });

    refeshInputFieldEl()
})

function refeshInputFieldEl() {
    inputFieldEl.value = ""
}

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

    let deleteCell = document.createElement("td");
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-times-circle");
    deleteCell.appendChild(deleteIcon);
    deleteIcon.style.color = "#AC485A";

    let editCell = document.createElement("td");
    let editIcon = document.createElement("i");
    editIcon.classList.add("fas", "fa-edit"); // Assuming you use Font Awesome for edit icon
    editIcon.style.cursor = "pointer"; // Make the icon clickable
    editCell.appendChild(editIcon);

        // Add event listener to remove the item from the database on click
    deleteIcon.addEventListener("click", function() {
        let exactLocationOfProductInDB = ref(database, `product/${itemID}`);
        remove(exactLocationOfProductInDB);
    });

    editIcon.addEventListener("click", function() {
        // Populate form with current item details
        editNameInput.value = itemValue.name;
        editPriceInput.value = itemValue.price;
        editQuantityInput.value = itemValue.quantity;

        // Show modal
        modal.style.display = "block";
    });
    // Handle form submission
    editForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const newName = editNameInput.value;
        const newPrice = editPriceInput.value;
        const newQuantity = editQuantityInput.value;
    
        const productRef = dbRef(database, `products/${currentEditItemID}`);
        update(productRef, {
            name: newName,
            price: newPrice,
            quantity: newQuantity
        }).then(() => {
            console.log("Product updated successfully");
            modal.style.display = "none";
        }).catch((error) => {
            console.error("Error updating product:", error);
        });
    });
    
    closeBtn.addEventListener("click", function() {
    modal.style.display = "none";
    });

    // Close modal when click outside modal content
    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });


    // Append cells to the row
        newEl.appendChild(imageCell);
        newEl.appendChild(nameCell);
        newEl.appendChild(priceCell);
        newEl.appendChild(quantityCell);
        newEl.appendChild(deleteCell);
        newEl.appendChild(editCell);
    // Append the new row to the product list element
    productListEl.appendChild(newEl);
}

function updateProduct(productID, newData) {
    let productRef = ref(database, `product/${productID}`);
    update(productRef, newData)
        .then(() => {
            console.log("Product updated successfully");
        })
        .catch((error) => {
            console.error("Error updating product:", error);
        });
}
