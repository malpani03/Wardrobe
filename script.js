const productSection = document.getElementById("productCards");
const cartTable = document.querySelector(".show-cart");
const totalCart = document.querySelector(".total-cart");

//Creating an empty array to store the items added to cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

//checks whether the cart is empty
const displayEmptyCartMessage = () => {
  if (cart.length === 0) {
    cartTable.innerHTML = "<h3>The Cart Is Empty!</h3>";
    totalCart.textContent = "";
  }
};

//function to save the item to the cart localstorage
const saveCartToLocalStorage = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const displayProducts = (query) => {
  const productCards = document.getElementById("productCards");

  //clear previous results
  productCards.innerHTML = "";

  //Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  //Display matched products
  filteredProducts.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("col");

    card.innerHTML = `
            <div class="card">
                <img src="${product.image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    ${
                      product.price
                      ? `<div class="d-flex justify-content-between align-items-center mb-2">
                      <h3>₹${product.price}/-</h3><button class="btn btn-warning mb-2 me-3 add-to-cart" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
                  </div>`
                  
              : '<p class="card-text">Price: Not available</p>'
                    }
                    
                </div>
            </div>
        `;

    productCards.appendChild(card);
  });
};

//Event Listener to Handle the Input field
const searchField = document.getElementById("search_field");
searchField.addEventListener("input", () => {
  const searchQuery = searchField.value.trim();
  displayProducts(searchQuery);
});

//initial display all products
displayProducts("");

// Function to add item to cart
const addToCart = (name, price) => {
  const existingItemIndex = cart.findIndex((item) => item.name === name);
  if (existingItemIndex!==-1) {
    cart[existingItemIndex].quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  saveCartToLocalStorage();
  displayCart();
};

//Function to handle the Quantity Change
function handleQuantityChange(event) {
  const itemName =
    event.target.parentElement.parentElement.children[0].textContent;
  const newQuantity = parseInt(event.target.value);

  const itemIndex = cart.findIndex((item) => item.name === itemName);
  if (itemIndex !== -1) {
    cart[itemIndex].quantity = newQuantity;
    saveCartToLocalStorage();
    displayCart();
  }
}

//Event Listner for quantity change
cartTable.addEventListener("change", (event) => {
  if (event.target.classList.contains("item-quantity")) {
    handleQuantityChange(event);
  }
});

// Function to render cart
function displayCart() {
  cartTable.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Price</th>
      <th>Quantity</th>
      <th>Total</th>
      
    </tr>
  `;
  let totalPrice = 0;
  cart.forEach((item) => {
    const tr = document.createElement("tr");
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>₹${item.price}</td>
      <td><input type="number" class="item-quantity" value="${item.quantity}" min="1" max="10"></td>
      <td>₹${itemTotal}</td>
      <td><button class=" btn btn remove" data-name="${item.name}"><i class="fa-solid fa-trash"></i></button></td>
    `;
    cartTable.appendChild(tr);
  });
  totalCart.textContent= `Total price:₹ ${totalPrice}`;
  saveCartToLocalStorage();
  displayEmptyCartMessage();
}

const initializeCartData = () => {
  if (cart.length > 0) {
    displayCart(); // Display cart if there are items in it
  } else {
    displayEmptyCartMessage(); // Display empty cart message if cart is empty
  }
};
initializeCartData();

// Event listener for add to cart buttons
productSection.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart")) {
    const productName = event.target.dataset.name;
    const productPrice = parseInt(event.target.dataset.price);
    addToCart(productName, productPrice);
  }
});

// Event listener for removing item from cart
cartTable.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove")) {
    const itemName = event.target.dataset.name;
    const itemIndex = cart.findIndex((item) => item.name === itemName);
    cart.splice(itemIndex, 1);
    displayCart();
  }
  displayEmptyCartMessage();
});
