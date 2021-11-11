"use strict";

let productcontainer = document.getElementById('mainList');

let state = {
  'querySet': null,
  'page':1,
  'rows':4
}

function productToHtml(product){
	return `	
    <div class="col mb-4">
    	<span class="d-none"> ${product._uuid}</span>
      <div class="card">
        <img src="${product._imageUrl}" class="card-img-top" alt="${product._title}">
        <div class="card-body">
          	<h5 class="product-title">${product._title}</h5>
          	<p class="product-description">${product._description}</p>
          	<p class="product-price">1 ${product._unit} x $${product._pricePerUnit}</p>
            <a onclick="preloadAddToCartModal('${product._uuid}')" class="btn btn-dark" 
            type="button" data-toggle="modal" data-target="#addCart"> Agregar al carrito </a>
        </div>
      </div>
    </div>
	`;
}

function productListToHtml(productList){
  state.querySet = productList;
  let currentData = pagination(state.querySet, state.page, state.rows);
  pageButtons(currentData.pages)
  productcontainer.innerHTML =  currentData.querySet.map(productToHtml).join('\n');
}

function addProductToCart(){
  let productUUID = document.getElementById('uuidToCart').value;
  let amount = Number(document.getElementById('itemsToCart').value);
  let cart = readShoppingCart();
  cart.addItem(productUUID, amount);
  document.getElementById("proxySize").innerText 
          = cart._productproxy.length;
  writeShoppingCart(cart)
}

function updatePag(txt){
  state.page=Number(txt);
  let currentData = pagination(state.querySet, state.page, state.rows);
  pageButtons(currentData.pages)
  productcontainer.innerHTML =  currentData.querySet.map(productToHtml).join('\n');
}

function preloadAddToCartModal(uuid){
  document.getElementById('uuidToCart').value = uuid;
  document.getElementById('itemsToCart').value = 1;}


loadProducts(productsUrl).then(products => {
	productListToHtml(products);
})


function pageButtons(page) {
  let wrapper = document.getElementById('paginationNumber')
  wrapper.innerHTML = ''
  for(let pages=1;pages<=page;pages++){
    wrapper.innerHTML += `
      <li class="page-item"><a class="page-link" onClick="updatePag(this.innerText)">${pages}</a></li>`;
  }
}


function pagination(querySet, page, rows){
  let trimStar = (page-1)*rows;
  let trimEnd  = trimStar + rows;
  let trimmedDate = querySet.slice(trimStar,trimEnd);
  let pages = Math.ceil(querySet.length / rows);

  return {
    'querySet':trimmedDate,
    'pages':pages
  }
}