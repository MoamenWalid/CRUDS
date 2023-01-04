
// Documents
const inputsMustWrite = document.querySelectorAll('[data-must]');
const createButton = document.querySelector('.create');
const totalPrice = document.querySelector('.total span');
const table = document.querySelector('table tbody');
const searchInput = document.querySelector('.search');
const searchButtons = document.querySelectorAll('.search-el button');
const clearAll = document.querySelector('.clear-all span');

// Variables
let type = 'search-title';

// Arrays
let informationPros = [];

if (JSON.parse(window.localStorage.getItem('products'))) {
  if (!JSON.parse(window.localStorage.getItem('products')).length) {
    clearAll.parentElement.style.display = 'none';
  }

  informationPros = JSON.parse(window.localStorage.getItem('products'));
  returnInfoFromStorage(informationPros);
  pressDel(informationPros);
  updateProduct(informationPros);
}

else {
  clearAll.parentElement.style.display = 'none';
}

// Function to add create button
inputsMustWrite.forEach((input) => {
  input.addEventListener('input', () => {
    createTotalButton();
  })
})


// Function to add create button and total
function createTotalButton() {
  const numOfInput = [];
  inputsMustWrite.forEach((input) => {
    if (input.value == '') {
      numOfInput.push(false);
    }
  })
  
  if (numOfInput.length == 0) {
    createButton.style.display = 'block';
    totalPrice.parentElement.classList.remove('red');
    totalPrice.innerHTML = 
    (+document.querySelector('.price').value +
    +document.querySelector('.taxes').value +
    +document.querySelector('.ads').value - 
    +document.querySelector('.discount').value)
    .toLocaleString('en', {maximumFractionDigits: 2});
  }
  
  else {
    createButton.style.display = 'none';
    totalPrice.parentElement.classList.add('red');
    totalPrice.innerHTML = '';
  }
}

// Function to add click on createButton
createButton.addEventListener('click', () => {
  if (!createButton.classList.contains('save')) {
    addProductToTable(informationPros);
  }
  pressDel(informationPros);
  updateProduct(informationPros);
})

// Function to add click on createButton when press Enter
window.addEventListener('keypress', (event) => {
  if (event == "Enter") {
    createButton.click();
  }
})

// Function to add product to table
function addProductToTable(array) {
  const countEl = +document.querySelector('.count').value;
  let counter = 0;

  do {
    let informationProduct = {
      id: array.length + 1, 
      title: document.querySelector('.title').value,
      price: (+document.querySelector('.price').value).toLocaleString('en', {maximumFractionDigits: 2}),
      taxes: (+document.querySelector('.taxes').value).toLocaleString('en', {maximumFractionDigits: 2}),
      ads: (+document.querySelector('.ads').value).toLocaleString('en', {maximumFractionDigits: 2}),
      discount: (+document.querySelector('.discount').value).toLocaleString('en', {maximumFractionDigits: 2}),
      total: document.querySelector('.total span').innerHTML,
      category: document.querySelector('.category').value
    }

    informationPros.push(informationProduct);
    addInfToStorage(informationPros); 
    clearAll.innerHTML = array.length;
    clearAll.parentElement.style.display = 'block';

    table.innerHTML += `
    <tr>
      <td>${informationProduct.id}</td>
      <td class="search-title">${informationProduct.title}</td>
      <td>${informationProduct.price}</td>
      <td>${informationProduct.taxes}</td>
      <td>${informationProduct.ads}</td>
      <td>${informationProduct.discount}</td>
      <td>${informationProduct.total}</td>
      <td class="search-category">${informationProduct.category}</td>
      <td><button class="update">Update</button></td>
      <td><button class="delete" id='${informationProduct.id}'>Delete</button></td>
    </tr>
    `
    counter++;
  } while (counter < countEl);
}

// Function to add information to local storage
function addInfToStorage(array) {
  window.localStorage.setItem('products', JSON.stringify(array));
}

// Function to return information from local storage
function returnInfoFromStorage(array) {
  clearAll.innerHTML = array.length;
  table.innerHTML = ''; 
    array.forEach((pro) => {
      table.innerHTML += `
      <tr>
        <td>${pro.id}</td>
        <td class="search-title">${pro.title}</td>
        <td>${pro.price}</td>
        <td>${pro.taxes}</td>
        <td>${pro.ads}</td>
        <td>${pro.discount}</td>
        <td>${pro.total}</td>
        <td class="search-category">${pro.category}</td>
        <td><button class="update">Update</button></td>
        <td><button class="delete" id='${pro.id}'>Delete</button></td>
      </tr>
      `
    })
}

// Function to focus on searchInput
searchButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const dataType = button.dataset.type;
    type = dataType;
    searchInput.focus();
  })
})

// Function to search 
searchInput.addEventListener('keyup', () => {
  checkOnSearch(searchInput.value);
})

// Function to check on search
function checkOnSearch(value) {
  const searchOnPros = document.querySelectorAll(`.${type}`);
  
  searchOnPros.forEach((title) => {
    if (title.innerText.toUpperCase().includes(value.toUpperCase())) {
      title.parentElement.style.display = 'table-row';
    }

    else {
      title.parentElement.style.display = 'none';
    }
  })
}

// Function to clear all products 
clearAll.parentElement.addEventListener('click', () => {
  clearAll.parentElement.style.display = 'none';
  table.innerHTML = '';
  informationPros = [];
  addInfToStorage(informationPros);
})

// Function to press on delete
function pressDel(array) {
  const deleteButtons = document.querySelectorAll('.delete');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      array.forEach((item, index) => {
        if (item.id == button.id) {
          button.parentElement.parentElement.remove();
          array.splice(index, 1);
          array.forEach((item, counter) => {
            item.id = counter + 1;
          })
          addInfToStorage(array);
          returnInfoFromStorage(array);
          (clearAll.innerHTML == '0')? clearAll.parentElement.style.display = 'none': false;
        }
      })
    })
  })
}

// Function to update product
function updateProduct(array) {
  let num = 0;
  const updates = document.querySelectorAll('.update');
  const countEl = document.querySelector('.count');
  updates.forEach((update, index) => {
    update.addEventListener('click', () => {
      num = index;
      countEl.style.display = 'none';
      inputsMustWrite.forEach((input) => {
        Object.keys(array[index]).forEach((item, counter) => {
          if (input.className == item) {
            input.value = Object.values(array[index])[counter].split(',').join('');
          }
        })
      })
      createTotalButton();
      createButton.classList.add('save');
      createButton.innerText = 'Update';
      createButton.addEventListener('click', (event) => {
          if (createButton.classList.contains('save')) {
            inputsMustWrite.forEach((input) => {
              if (array.length > 0) {
                Object.keys(array[num]).forEach((item) => {
                  if (input.className == item) {
                  array[num][item] = input.value;
                  }
  
                  else if (item == 'total') {
                    array[num][item] = totalPrice.innerHTML;
                  }
                })
              }
            })
            addInfToStorage(array);
            returnInfoFromStorage(array);
    
            event.target.classList.remove('save');
            event.target.innerText = "Create";
            event.target.style.display = 'none';
            countEl.style.display = 'block';
            inputsMustWrite.forEach((input) => {
              input.value = '';
            })
            createTotalButton();
          }
      })
    })
  })
}