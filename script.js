"use strict";

// Existing scroll functionality
let prevScrollPos = window.pageYOffset;
console.log(prevScrollPos);
window.onscroll = function () {
  let currentScrollPos = window.pageYOffset;

  if (prevScrollPos > currentScrollPos) {
    document.getElementById("nav").style.top = "0";
    console.log("Prev: " + prevScrollPos);
    console.log("Curr: " + currentScrollPos);
  } else {
    document.getElementById("nav").style.top = "-500px";
    console.log("Prev: " + prevScrollPos);
    console.log("Curr: " + currentScrollPos);
  }
  prevScrollPos = currentScrollPos;
};
// Function to fetch menu data from your serverless function
async function fetchMenuData() {
  try {
    const response = await fetch('/.netlify/functions/getAirtableData');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    displayMenuByCategory(data);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error.message);
  }
}

// Rest of your menu display logic here
function displayMenuByCategory(categories) {
  const menuContainer = document.getElementById('menu-container');
  const categoryNav = document.getElementById('category-nav');
  
  menuContainer.innerHTML = '';
  categoryNav.innerHTML = '';

  for (const [category, items] of Object.entries(categories)) {
    // Add category to navigation
    const navItem = document.createElement('li');
    navItem.className = 'nav-item';
    navItem.innerHTML = `<a class="nav-link" href="#${category.toLowerCase()}">${category}</a>`;
    categoryNav.appendChild(navItem);

    // Add category and items to menu
    const categoryElement = document.createElement('div');
    categoryElement.id = category.toLowerCase();
    categoryElement.innerHTML = `
      <h2 class="d-flex justify-content-center mb-4 flex-column-reverse align-items-center font-title">
        ${category}
        <span class="badge mb-4" style="background-color: #a54049; width: 30%">Menu</span>
      </h2>
      <ol class="list-group"></ol>
    `;
    menuContainer.appendChild(categoryElement);

    const itemList = categoryElement.querySelector('ol');
    items.forEach(item => addMenuItemToPage(item, itemList));
  }
}

function addMenuItemToPage(item, listElement) {
  const listItem = document.createElement('li');
  listItem.className = 'list-group-item d-flex justify-content-between align-items-start bg-white';
  listItem.innerHTML = `
    <div class="ms-2 me-auto">
      <div class="fw-bold">${item.fields.Name}</div>
      <p class="ls m-0">${item.fields.Description || ''}</p>
    </div>
    <span class="badge rounded-pill bgc-2 txt-1">${item.fields.Price || ''}</span>
  `;
  listElement.appendChild(listItem);
}

// Call fetchMenuData when the DOM is loaded
document.addEventListener('DOMContentLoaded', fetchMenuData);