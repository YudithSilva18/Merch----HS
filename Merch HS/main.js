//Registrar el SW
let newSW; 
if('serviceWorker' in navigator){
    window.addEventListener('load', ()=>{
        navigator.serviceWorker.register('sw.js').then(result =>{
            result.addEventListener('updatefound', ()=> {
                
                console.log('hay nueva actualizacion', newSW);
                newSW.addEventListener('statechange', () => {
                    if(newSW.state == "installed"){
                        showSnackbar ();
                    }

                })

            })
        })


        //let boton= document.getElementById("btnAcceder")
        //boton.addEventListener('click', () =>{
         //fetch('https://www.facebook.com')
       //})
    })
}
//Es para saber si el navegador soporta indexedDB
if (!window.indexedDB) {
    window.alert("Su navegador no soporta una versión estable de indexedDB. tal y como las características no serán validas");
}
//Crea la base de datos
let request = window.indexedDB.open("base-V1", 3);

//Snackbar
function showSnackbar() {
    let x = document.getElementById("snackbar");
    x.className = "show";
  
    
}

let botonActualizar = document.getElementById('launchUpdate')
botonActualizar.addEventListener('click', () => {
    console.log('Hacer el skipwaiting');
    window.location.reload(); 
    newSW.postMessage({action: 'skipWaiting'})
})

//Codigo de productos
//variables
let allContainerCart = document.querySelector('.products');
let containerBuyCart = document.querySelector('.card-items');
let priceTotal = document.querySelector('.price-total')
let amountProduct = document.querySelector('.count-product');


let buyThings = [];
let totalCard = 0;
let countProduct = 0;

//Funciones
loadEventListenrs();
function loadEventListenrs(){
    allContainerCart.addEventListener('click', addProduct);

    containerBuyCart.addEventListener('click', deleteProduct);
}

function addProduct(e){
    e.preventDefault();
    if (e.target.classList.contains('btn-add-cart')) {
        const selectProduct = e.target.parentElement; 
        readTheContent(selectProduct);
    }
}

function deleteProduct(e) {
    if (e.target.classList.contains('delete-product')) {
        const deleteId = e.target.getAttribute('data-id');

        buyThings.forEach(value => {
            if (value.id == deleteId) {
                let priceReduce = parseFloat(value.price) * parseFloat(value.amount);
                totalCard =  totalCard - priceReduce;
                totalCard = totalCard.toFixed(2);
            }
        });
        buyThings = buyThings.filter(product => product.id !== deleteId);
        
        countProduct--;
    }
    loadHtml();
}

function readTheContent(product){
    const infoProduct = {
        image: product.querySelector('div img').src,
        title: product.querySelector('.title').textContent,
        price: product.querySelector('div p span').textContent,
        id: product.querySelector('a').getAttribute('data-id'),
        amount: 1
    }

    totalCard = parseFloat(totalCard) + parseFloat(infoProduct.price);
    totalCard = totalCard.toFixed(2);

    const exist = buyThings.some(product => product.id === infoProduct.id);
    if (exist) {
        const pro = buyThings.map(product => {
            if (product.id === infoProduct.id) {
                product.amount++;
                return product;
            } else {
                return product
            }
        });
        buyThings = [...pro];
    } else {
        buyThings = [...buyThings, infoProduct]
        countProduct++;
    }
    loadHtml();
    //console.log(infoProduct);
}

function loadHtml(){
    clearHtml();
    buyThings.forEach(product => {
        const {image, title, price, amount, id} = product;
        const row = document.createElement('div');
        row.classList.add('item');
        row.innerHTML = `
            <img src="${image}" alt="">
            <div class="item-content">
                <h5>${title}</h5>
                <h5 class="cart-price">$${price}</h5>
                <h6>Amount: ${amount}</h6>
            </div>
            <span class="delete-product" data-id="${id}">X</span>
        `;

        containerBuyCart.appendChild(row);

        priceTotal.innerHTML = totalCard;

        amountProduct.innerHTML = countProduct;
    });
}
 function clearHtml(){
    containerBuyCart.innerHTML = '';
}