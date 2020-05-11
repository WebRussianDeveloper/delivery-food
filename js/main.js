/*jshint esversion: 8 */

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('Food'); // получение логина из хранилища(65 строка)

let localString = login || '';

 // запись корзины в локал стор
 
const cart = [];

const loadCart = function() {
  if(localStorage.getItem(login)){
    JSON.parse(localStorage.getItem(login)).forEach(function(item){
      cart.push(item); // все,что получили, отправляем в cart
    });
  }
};


const saveCart = function() {
 localStorage.setItem(login, JSON.stringify(cart));
};

const getData = async function (url) {

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибка ${response.status}!`);
  }
  return await response.json();

};

const valid = function (str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
};


const toggleModal = function () {
  modal.classList.toggle("is-open");
};


function toggleModalAuth() {
  loginInput.style.borderColor = '';
  modalAuth.classList.toggle('is-open');

}

function returnMain() {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}


function authorized() {

  function logOut() {
    login = null;
    cart.length = 0;
    localStorage.removeItem('Food'); // удаление при выходе логина из хранилища
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    returnMain();

  }

  console.log('Авторизован');
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
  loadCart();
}

function nonAuthorized() {

  console.log('Не Авторизован');

  function logIn(event) {
    event.preventDefault();

    if ((valid(loginInput.value))) {
      loginInput.style.borderColor = '';
      login = loginInput.value;
      localStorage.setItem('Food', login); // запись логина в хранилище(логин сохраняется при обновлении страницы)
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth); // Вызов окна регистрации при клике
      closeAuth.removeEventListener('click', toggleModalAuth); // закрытие окна
      logInForm.removeEventListener('submit', logIn); // отправка  даннremove  
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = 'red';
      loginInput.value = '';
    }
  }


  buttonAuth.addEventListener('click', toggleModalAuth); // Вызов окна регистрации при клике
  closeAuth.addEventListener('click', toggleModalAuth); // закрытие окна
  logInForm.addEventListener('submit', logIn); // отправка  данных

}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    nonAuthorized();
  }
}

function createCardRestaurant(restaurant) { // создание карточек ресторана

  const {
    image,
    kitchen,
    name,
    price, //берем данные о ресторанах
    products,
    stars,
    time_of_delivery: timeOfDelivery
  } = restaurant;

  const card = `
  <a class="card card-restaurant" data-products="${products}" data-info="${[name,price,stars,kitchen]}">
						<img src="${image}" alt="${name}" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">${name}</h3>
								<span class="card-tag tag">${timeOfDelivery} мин</span>
							</div>
							<div class="card-info">
								<div class="rating">
									${stars}
								</div>
								<div class="price">От ${price} р</div>
								<div class="category">${kitchen}</div>
							</div>
						</div>
					</a>
  `;

  cardsRestaurants.insertAdjacentHTML('afterbegin', card);

}

function createCardGood(goods) {

  const {
    description,
    id,
    image,
    name,
    price
  } = goods;

  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
						<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">${description}</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart" id="${id}">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price card-price-bold">${price} ₽</strong>
							</div>
						</div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);

}

// открывает меню ресторана
function openGoods(event) {
  const target = event.target;
  if (login) {

    const restaurant = target.closest('.card-restaurant');
    if (restaurant) {

      const info = restaurant.dataset.info.split(',');

      const [name, price, stars, kitchen] = info;

      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `От ${price} р`;
      category.textContent = kitchen;

      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    }
  } else {
    toggleModalAuth();
  }
}
// корзина
function addToCart(event) {

  const target = event.target;

  const buttonAddToCart = target.closest('.button-add-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(function (item) {
      return item.id === id;

    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      });

    }
  }
  saveCart();
}

function renderCart() {
  modalBody.textContent = '';

  cart.forEach(function ({ id, title, cost, count }) {
    const itemCart = `
     <div class="food-row">
					<span class="food-name">${title}</span>
					<strong class="food-price">${cost}</strong>
					<div class="food-counter">
						<button class="counter-button counter-minus" data-id=${id}>-</button>
						<span class="counter">${count}</span>
						<button class="counter-button counter-plus" data-id=${id}>+</button>
					</div>
				</div>
     `;

     modalBody.insertAdjacentHTML('afterbegin', itemCart);

  });

  const totalPrice = cart.reduce(function(result, item){ 
    return result + (parseFloat(item.cost) * item.count); 
   
  }, 0);

  modalPrice.textContent = totalPrice + " р";
}

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(function(item){
      return item.id === target.dataset.id;
  });
  if (target.classList.contains('counter-minus')) {
    food.count--;
    if (food.count === 0) {
      cart.splice(cart.indexOf(food), 1);
    }
  }
  if (target.classList.contains('counter-plus')) {food.count++;}

  renderCart();
  }
  saveCart();
}

// создание карточек ресторанов

function init() {
  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant);
  });

  cartButton.addEventListener("click", function () {
    renderCart();
    toggleModal();

  });

  buttonClearCart.addEventListener('click', function() {
  cart.length = 0;
  renderCart();
  });

  modalBody.addEventListener('click', changeCount);

  cardsMenu.addEventListener('click', addToCart);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', returnMain);

  inputSearch.addEventListener('keydown', function (event) { // если enter(13 клавиша,то идет поиск)
    if (event.keyCode === 13) {
      const target = event.target;

      const value = target.value.toLowerCase().trim();

      target.value = '';
      if (!value || value.length < 3) {
        target.style.backgroundColor = 'tomato';
        setTimeout(function () {
          target.style.backgroundColor = '';
        }, 2000);
        return;
      }

      const goods = [];

      getData('./db/partners.json').then(function (data) {

        const products = data.map(function (item) {
          return item.products;
        });

        products.forEach(function (product) { // поиск продукта,сделать через сервак. тк это костыль
          getData(`./db/${product}`).then(function (data) {
              goods.push(...data);

              const searchGoods = goods.filter(function (item) {
                return item.name.toLowerCase().includes(value);

              });


              cardsMenu.textContent = '';
              containerPromo.classList.add('hide');
              restaurants.classList.add('hide');
              menu.classList.remove('hide');

              restaurantTitle.textContent = 'Результат поиска';
              rating.textContent = '';
              minPrice.textContent = '';
              category.textContent = '';

              return searchGoods;
            })
            .then(function (data) {
              data.forEach(createCardGood);
            });

        });

      });
    }
  });
  checkAuth();

  new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 3000
    }
  });

}

init();