/** @format */

"use strict";

// Existing scroll functionality
let prevScrollPos = window.pageYOffset;
console.log(prevScrollPos);
window.onscroll = function () {
  let currentScrollPos = window.pageYOffset;

  if (prevScrollPos > currentScrollPos) {
    document.getElementById("nav").style.top = "0";
  } else {
    document.getElementById("nav").style.top = "-500px";
  }
  prevScrollPos = currentScrollPos;
};

// Function to fetch menu data from your serverless function
async function fetchMenuData() {
  showLoader();
  const functionPath = "/.netlify/functions/getAirtableData";
  try {
    console.log(`Fetching menu data from: ${functionPath}`);
    const response = await fetch(functionPath);
    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Data received:", data);
    hideLoader();
    displayMenuByCategory(data);
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error.message
    );
  }
}

// Function to sanitize category names for use as IDs
function sanitizeCategoryName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

// Rest of your menu display logic here
function displayMenuByCategory(categories) {
  const menuContainer = document.getElementById("menu-container");
  const categoryNav = document.getElementById("category-nav");

  menuContainer.innerHTML = "";
  categoryNav.innerHTML = "";

  for (const [category, items] of Object.entries(categories)) {
    const sanitizedCategoryName = sanitizeCategoryName(category);

    // Add category to navigation
    const navItem = document.createElement("li");
    navItem.className = "nav-item";
    navItem.innerHTML = `<a class="nav-link" href="#${sanitizedCategoryName}">${category}</a>`;
    categoryNav.appendChild(navItem);

    // Add category and items to menu
    const categoryElement = document.createElement("div");
    categoryElement.id = sanitizedCategoryName;
    categoryElement.innerHTML = `
      <h2 class="d-flex justify-content-center mb-4 flex-column-reverse align-items-center font-title">
        ${category}
        <span class="badge mb-4" style="background-color: #a54049; width: 30%">Menu</span>
      </h2>
      <ol class="list-group"></ol>
    `;
    menuContainer.appendChild(categoryElement);

    const itemList = categoryElement.querySelector("ol");
    items.forEach((item) => addMenuItemToPage(item, itemList));

    // Add Greek stencil divider after each category
    const divider = document.createElement("h1");
    divider.className = "greek-stencil mt-2 p-1";
    divider.innerHTML = ".<br /><br />.";
    menuContainer.appendChild(divider);
  }
}

function addMenuItemToPage(item, listElement) {
  const listItem = document.createElement("li");
  listItem.className =
    "list-group-item d-flex justify-content-between align-items-start bg-white";
  listItem.innerHTML = `
    <div class="ms-2 me-auto">
      <div class="fw-bold">${item.fields.Name}</div>
      <p class="ls m-0">${item.fields.Description || ""}</p>
    </div>
    <span class="badge rounded-pill bgc-2 txt-1">${
      item.fields.Price || ""
    }</span>
  `;
  listElement.appendChild(listItem);
}

function showLoader() {
  const menuContainer = document.getElementById("menu-container");
  menuContainer.innerHTML = `
    <div class="d-flex justify-content-center align-items-center" style="height: 300px;">
      <div class="spinner-border text-danger" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <p class="text-center font-title fs-4 mt-3">Loading Menu...</p>
  `;
}

function hideLoader() {
  const menuContainer = document.getElementById("menu-container");
  menuContainer.innerHTML = "";
}

function displayError(message) {
  const menuContainer = document.getElementById("menu-container");
  menuContainer.innerHTML = `
    <div class="alert alert-danger" role="alert">
      <h4 class="alert-heading">Error Loading Menu</h4>
      <p>${message}</p>
      <hr>
      <p class="mb-0">Please try again later or contact support if the problem persists.</p>
    </div>
  `;
}
// Call fetchMenuData when the DOM is loaded
document.addEventListener("DOMContentLoaded", fetchMenuData);