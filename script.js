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
const editFileInput = document.getElementById("editfile");

//Add
const inputFileEl = document.getElementById('input-file');
const inputProNameEl = document.getElementById("input-pro-name");
const inputProPriceEl = document.getElementById("input-pro-price");
const inputCategoryEl = document.getElementById('input-pro-category');
const inputProQuantityEl = document.getElementById("input-pro-quantity");
const addButtonEl = document.getElementById("add-button");

function loadCategories() {
    const categoriesRef = dbRef(database, 'products');
    onValue(categoriesRef, snapshot => {
        if (snapshot.exists()) {
            const categories = snapshot.val();
            inputCategoryEl.innerHTML = '<option value="">Loại</option>';
            for (const category in categories) {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category.replace(/-/g, ' ');
                inputCategoryEl.appendChild(option);
            }
        } else {
            inputCategoryEl.innerHTML = '<option value="">Không có loại sản phẩm</option>';
        }
    });
}

addButtonEl.addEventListener("click", function(){
    const categoryValue = inputCategoryEl.value;
    const nameValue = inputProNameEl.value.trim();
    const priceValue = inputProPriceEl.value.trim();
    const quantityValue = inputProQuantityEl.value.trim();
    const file = inputFileEl.files[0];
    if (!file || !categoryValue || !nameValue || !priceValue || !quantityValue) {
        console.error("No file selected.");
        return;
    }
    const storageRef = strRef(storage, 'images/' + file.name);

    uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!', snapshot);
        return getDownloadURL(snapshot.ref);
    }).then((downloadURL) => {
        console.log('File available at', downloadURL);
        const productInDB = dbRef(database, `products/${categoryValue}`);
        const product = {
            name: nameValue,
            price: priceValue,
            quantity: quantityValue,
            imageUrl: downloadURL
        };
        push(productInDB, product);
        clearInputFields();
    }).catch((error) => {
        console.error('Upload failed', error);
    });
})

function clearInputFields() {
    inputFileEl.value = "";
    inputCategoryEl.value = "";
    inputProNameEl.value = "";
    inputProPriceEl.value = "";
    inputProQuantityEl.value = "";
}

onValue(productInDB, function(snapshot){
    if (snapshot.exists()) {
        refreshProductListEl();
        const categories = snapshot.val();
        for (const category in categories) {
            const products = categories[category];
            for (const productId in products) {
                const product = products[productId];
                appendItemToProductList(category, productId, product);
            }
        }
    } else {
        productListEl.innerHTML = "<tr><td colspan='5'>No items here... yet</td></tr>";
    }
});

function refreshProductListEl() {
    productListEl.innerHTML = "";
}

function appendItemToProductList(category, productId, product) {
    let newEl = document.createElement("tr");

    const imageCell = document.createElement("td");
    const imgEl = document.createElement("img");
    imgEl.src = product.imageUrl;
    imgEl.style.width = "100px"; // Adjust as necessary
    imageCell.appendChild(imgEl);

    let nameCell = document.createElement("td");
    nameCell.textContent = product.name; // Assuming itemValue is an object with a 'name' property

    let priceCell = document.createElement("td");
    priceCell.textContent = product.price; // Assuming itemValue has a 'price' property

    let quantityCell = document.createElement("td");
    quantityCell.textContent = product.quantity; // Assuming itemValue has a 'quantity' property

    let deleteCell = document.createElement("td");
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-times-circle");
    deleteCell.appendChild(deleteIcon);
    deleteIcon.style.color = "#AC485A";
    deleteIcon.addEventListener("click", function() {
        let exactLocationOfProductInDB = dbRef(database, `products/${category}/${productId}`);
        remove(exactLocationOfProductInDB);
    });

    let editCell = document.createElement("td");
    let editIcon = document.createElement("i");
    editIcon.classList.add("fas", "fa-edit"); // Assuming you use Font Awesome for edit icon
    editIcon.style.cursor = "pointer"; // Make the icon clickable
    editCell.appendChild(editIcon);
    editIcon.addEventListener("click", function() {
        // Populate form with current item details
        editNameInput.value = product.name;
        editPriceInput.value = product.price;
        editQuantityInput.value = product.quantity;
        modal.style.display = "block";

        // Show modal
        modal.style.display = "block";
    });
    //Handle form submission
    
    
    closeBtn.addEventListener("click", function() {
    modal.style.display = "none";
    });

    // Close modal when click outside modal content
    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
    editForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const newName = editNameInput.value;
            const newPrice = editPriceInput.value;
            const newQuantity = editQuantityInput.value;
            const newFile = editFileInput.files[0];

            const updateProduct = (downloadURL = null) => {
            const productRef = dbRef(database, `products/${category}/${productId}`);
            const updatedProduct = {
                name: newName,
                price: newPrice,
                quantity: newQuantity,
            };
            if (downloadURL) {
                updatedProduct.imageUrl = downloadURL;
            }
            update(productRef, updatedProduct).then(() => {
                console.log("Product updated successfully");
                modal.style.display = "none";
            }).catch((error) => {
                console.error("Error updating product:", error);
            });
        };

        if (newFile) {
            const storageReference = strRef(storage, 'images/' + newFile.name);
            uploadBytes(storageReference, newFile).then(snapshot => {
                return getDownloadURL(snapshot.ref);
            }).then(downloadURL => {
                updateProduct(downloadURL);
            }).catch(error => {
                console.error("Error uploading new image:", error);
            });
        } else {
            updateProduct();
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
document.addEventListener('DOMContentLoaded', loadCategories);