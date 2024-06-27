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


onValue(productInDB, function(snapshot) {
    if (snapshot.exists()) {
        refreshProductSections();
        const categories = snapshot.val();
        for (const category in categories) {
            const products = categories[category];
            createCategoryTable(category, products);
        }
    } else {
        productSections.innerHTML = "<p>No items here... yet</p>";
    }
});

function refreshProductSections() {
    document.getElementById('product-sections').innerHTML = "";
}

function createCategoryTable(category, products) {
    const productSections = document.getElementById('product-sections');

    const table = document.createElement('table');
    table.classList.add('category-table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['Ảnh', 'Tên', 'Giá', 'Số lượng'];
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (const productId in products) {
        const product = products[productId];
        const newRow = document.createElement('tr');

        const imageCell = document.createElement('td');
        const imgEl = document.createElement('img');
        imgEl.src = product.imageUrl;
        imgEl.style.width = '100px'; // Adjust as necessary
        imageCell.appendChild(imgEl);
        newRow.appendChild(imageCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = product.name;
        newRow.appendChild(nameCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = product.price;
        newRow.appendChild(priceCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = product.quantity;
        newRow.appendChild(quantityCell);

        tbody.appendChild(newRow);
    }
    table.appendChild(tbody);

    const categoryTitle = document.createElement('h3');
    categoryTitle.textContent = category;

    productSections.appendChild(categoryTitle);
    productSections.appendChild(table);
}
