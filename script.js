/*
 * GladSkin — практическая работа № 2.
 * Локальный поиск, проверка форм, карточка выбранного товара,
 * корзина браузера и асинхронный запрос к Open Beauty Facts.
 */
(() => {
  'use strict';

  const CART_KEY = 'gladskin-cart-v2';
  const DELIVERY_PRICE = 300;
  const FREE_DELIVERY_FROM = 3000;
  const formatPrice = (value) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
  const normalize = (value) => String(value ?? '').toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').trim();

  // Сведения о товарах GladSkin. Эти данные используются в поиске, карточке и корзине.
  const PRODUCTS = [{"id":"the-ordinary-hyaluronic","name":"The Ordinary Hyaluronic Acid 2% + B5","brand":"The Ordinary","category":"Сыворотка","purpose":"Увлажнение","skin":["Сухая","Нормальная","Комбинированная","Жирная","Чувствительная"],"description":"Увлажняющая сыворотка с гиалуроновой кислотой и витамином B5, 30 мл.","details":"Сыворотка помогает поддерживать увлажнённость кожи и дополняет ежедневный уход. Наносится после очищения и перед кремом.","volume":"30 мл","key":"Гиалуроновая кислота и витамин B5","stage":"После очищения, перед кремом","price":2190,"image":"images/the-ordinary.jpg","alt":"Флакон сыворотки The Ordinary Hyaluronic Acid 2% + B5, 30 мл","imageWidth":1110,"imageHeight":747},{"id":"cerave-moisturising-cream","name":"CeraVe Moisturising Cream","brand":"CeraVe","category":"Крем для лица","purpose":"Увлажнение","skin":["Сухая","Нормальная","Чувствительная"],"description":"Увлажняющий крем для поддержания защитного барьера кожи, 50 мл.","details":"Крем подходит для ежедневного ухода и помогает уменьшить ощущение сухости. Используется после сыворотки или самостоятельно.","volume":"50 мл","key":"Увлажняющие компоненты и керамиды","stage":"Завершающий этап ухода","price":890,"image":"images/cerave-cream.jpg","alt":"Баночка увлажняющего крема CeraVe Moisturising Cream, 50 мл","imageWidth":1110,"imageHeight":747},{"id":"cerave-hydrating-cleanser","name":"CeraVe Hydrating Cleanser","brand":"CeraVe","category":"Очищение","purpose":"Очищение","skin":["Сухая","Нормальная","Чувствительная"],"description":"Мягкое очищающее средство для ежедневного ухода, 150 мл.","details":"Средство предназначено для мягкого очищения кожи. Подходит для использования утром и вечером в рамках обычного ухода.","volume":"150 мл","key":"Очищающая основа и керамиды","stage":"Первый этап ухода","price":990,"image":"images/cerave-cleanser.jpg","alt":"Флакон CeraVe Hydrating Cleanser, 150 мл","imageWidth":1110,"imageHeight":747},{"id":"bioderma-sensibio-h2o","name":"Bioderma Sensibio H2O","brand":"Bioderma","category":"Мицеллярная вода","purpose":"Очищение","skin":["Нормальная","Сухая","Чувствительная"],"description":"Мицеллярная вода для очищения чувствительной кожи, 250 мл.","details":"Мицеллярная вода помогает удалить загрязнения и остатки макияжа. После применения следуйте инструкции производителя.","volume":"250 мл","key":"Мицеллярная очищающая формула","stage":"Очищение","price":1809,"image":"images/bioderma-sensibio.jpg","alt":"Флакон Bioderma Sensibio H2O, 250 мл","imageWidth":1110,"imageHeight":747},{"id":"cosrx-snail-essence","name":"COSRX Advanced Snail 96 Mucin Power Essence","brand":"COSRX","category":"Эссенция","purpose":"Увлажнение","skin":["Сухая","Нормальная","Комбинированная"],"description":"Увлажняющая эссенция для ежедневного ухода, 100 мл.","details":"Эссенция дополняет уход после очищения. Её можно использовать перед нанесением крема.","volume":"100 мл","key":"Муцин улитки","stage":"После очищения, перед кремом","price":1890,"image":"images/cosrx-snail.jpg","alt":"Флакон эссенции COSRX Advanced Snail 96 Mucin Power Essence, 100 мл","imageWidth":1110,"imageHeight":747},{"id":"laroche-anthelios-spf50","name":"La Roche-Posay Anthelios SPF 50+","brand":"La Roche-Posay","category":"Защита SPF","purpose":"Защита от солнца","skin":["Сухая","Нормальная","Комбинированная","Жирная","Чувствительная"],"description":"Солнцезащитное средство для ежедневного ухода, 50 мл.","details":"Средство предназначено для защиты кожи от солнечного излучения. Наносите и обновляйте его в соответствии с инструкцией на упаковке.","volume":"50 мл","key":"Солнцезащитные фильтры","stage":"Утренний уход, последний этап","price":1959,"image":"images/laroche-anthelios.jpg","alt":"Тюбик La Roche-Posay Anthelios SPF 50+, 50 мл","imageWidth":1110,"imageHeight":747},{"id":"skinceuticals-ce-ferulic","name":"SkinCeuticals C E Ferulic","brand":"SkinCeuticals","category":"Сыворотка","purpose":"Антиоксидантный уход","skin":["Нормальная","Сухая","Комбинированная"],"description":"Антиоксидантная сыворотка с витаминами C и E для ежедневного ухода, 30 мл.","details":"Сыворотка относится к средствам антиоксидантного ухода. Перед применением рекомендуется ознакомиться с инструкцией производителя.","volume":"30 мл","key":"Витамины C и E, феруловая кислота","stage":"Утренний уход после очищения","price":1650,"image":"images/garnier-micellar.jpg","alt":"Флакон сыворотки SkinCeuticals C E Ferulic, 30 мл","imageWidth":1110,"imageHeight":747},{"id":"inkey-niacinamide-serum","name":"The Inkey List Niacinamide Serum","brand":"The Inkey List","category":"Сыворотка","purpose":"Уход за жирным блеском","skin":["Жирная","Комбинированная"],"description":"Сыворотка с ниацинамидом для ухода за кожей с жирным блеском, 30 мл.","details":"Сыворотка предназначена для ухода за кожей, склонной к жирному блеску. Используйте в соответствии с рекомендациями производителя.","volume":"30 мл","key":"Ниацинамид","stage":"После очищения, перед кремом","price":1490,"image":"images/the-ordinary.jpg","alt":"Флакон The Inkey List Niacinamide Serum, 30 мл","imageWidth":1110,"imageHeight":747},{"id":"beauty-joseon-dynasty-cream","name":"Beauty of Joseon Dynasty Cream","brand":"Beauty of Joseon","category":"Крем для лица","purpose":"Питание и увлажнение","skin":["Сухая","Нормальная"],"description":"Питательный крем для ежедневного увлажнения кожи лица, 50 мл.","details":"Крем завершает ежедневный уход и помогает сохранить ощущение мягкости и комфорта кожи.","volume":"50 мл","key":"Увлажняющие и смягчающие компоненты","stage":"Завершающий этап ухода","price":1890,"image":"images/vitamin-c.jpg","alt":"Баночка Beauty of Joseon Dynasty Cream, 50 мл","imageWidth":1110,"imageHeight":747},{"id":"innisfree-volcanic-mask","name":"Innisfree Super Volcanic Pore Clay Mask","brand":"Innisfree","category":"Маска","purpose":"Очищение пор","skin":["Жирная","Комбинированная"],"description":"Очищающая глиняная маска для жирной и комбинированной кожи, 100 мл.","details":"Глиняная маска используется как дополнительный этап ухода. Частоту применения следует выбирать по инструкции производителя.","volume":"100 мл","key":"Вулканическая глина","stage":"Дополнительный этап ухода","price":1425,"image":"images/innisfree-volcanic-mask.jpg","alt":"Баночка Innisfree Super Volcanic Pore Clay Mask, 100 мл","imageWidth":1110,"imageHeight":747},{"id":"laneige-lip-sleeping-mask","name":"Laneige Lip Sleeping Mask","brand":"Laneige","category":"Маска для губ","purpose":"Уход за губами","skin":["Для губ"],"description":"Ночная маска для ухода за губами, 20 г.","details":"Маска предназначена для дополнительного ухода за кожей губ. Применяется по инструкции производителя.","volume":"20 г","key":"Смягчающие компоненты","stage":"Вечерний уход","price":2090,"image":"images/sheet-mask.jpg","alt":"Баночка Laneige Lip Sleeping Mask, 20 г","imageWidth":1110,"imageHeight":747},{"id":"nuxe-huile-prodigieuse","name":"NUXE Huile Prodigieuse","brand":"NUXE","category":"Уход за телом","purpose":"Питание и смягчение","skin":["Сухая","Нормальная"],"description":"Многофункциональное сухое масло для кожи лица, тела и волос, 50 мл.","details":"Сухое масло предназначено для ухода за кожей и волосами. Способ применения зависит от зоны нанесения и указан на упаковке.","volume":"50 мл","key":"Комплекс растительных масел","stage":"По необходимости","price":2390,"image":"images/nuxe-huile-prodigieuse.jpg","alt":"Флакон NUXE Huile Prodigieuse, 50 мл","imageWidth":1110,"imageHeight":747}];

  function safeReadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      if (!Array.isArray(saved)) return [];
      return saved.filter((item) => PRODUCTS.some((product) => product.id === item.id))
        .map((item) => ({ id: item.id, quantity: Math.max(1, Math.min(10, Number.parseInt(item.quantity, 10) || 1)) }));
    } catch (error) {
      console.warn('Не удалось прочитать корзину:', error);
      return [];
    }
  }

  function writeCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error('Не удалось сохранить корзину:', error);
      return false;
    }
  }

  function addToCart(productId, quantity = 1) {
    const product = PRODUCTS.find((item) => item.id === productId);
    if (!product) return false;
    const cart = safeReadCart();
    const amount = Math.max(1, Math.min(10, Number.parseInt(quantity, 10) || 1));
    const existing = cart.find((item) => item.id === productId);
    if (existing) existing.quantity = Math.min(10, existing.quantity + amount);
    else cart.push({ id: productId, quantity: amount });
    return writeCart(cart);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
  }

  function productCard(product) {
    const skinLabels = product.skin.filter((item) => item !== 'Для губ').slice(0, 2);
    const suitability = skinLabels.length ? skinLabels : ['Для ухода за губами'];
    return `
      <article class="product-card">
        <a class="product-image" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="Подробнее: ${escapeHtml(product.name)}">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.alt)}" width="${product.imageWidth || 1110}" height="${product.imageHeight || 747}" loading="lazy" decoding="async">
        </a>
        <div class="product-info">
          <div class="product-card-meta">
            <span class="product-type">${escapeHtml(product.category)}</span>
            <span class="product-volume">${escapeHtml(product.volume)}</span>
          </div>
          <p class="product-brand">${escapeHtml(product.brand)}</p>
          <h2><a href="product.html?id=${encodeURIComponent(product.id)}">${escapeHtml(product.name)}</a></h2>
          <p class="product-description">${escapeHtml(product.description)}</p>
          <div class="product-skin-tags">${suitability.map((label) => `<span>${escapeHtml(label)}</span>`).join('')}</div>
          <div class="product-card-bottom">
            <p class="price">${formatPrice(product.price)}</p>
            <div class="card-actions">
              <a class="text-link" href="product.html?id=${encodeURIComponent(product.id)}">Подробнее</a>
              <button class="button button-small" type="button" data-add-card="${escapeHtml(product.id)}">В корзину</button>
            </div>
          </div>
        </div>
      </article>`;
  }

  // 1. Каталог: поиск с кнопки, а фильтр и сортировка обновляются сразу.
  const searchForm = document.querySelector('#catalog-filter-form');
  if (searchForm) {
    const searchInput = document.querySelector('#search');
    const categoryInput = document.querySelector('#category');
    const sortInput = document.querySelector('#sort');
    const grid = document.querySelector('#product-grid');
    const status = document.querySelector('#catalog-status');
    const emptyState = document.querySelector('#empty-state');

    function findProducts() {
      const term = normalize(searchInput.value);
      const category = normalize(categoryInput.value);
      const matches = PRODUCTS.filter((product) => {
        const allText = normalize([
          product.name, product.brand, product.category, product.purpose,
          product.description, product.details, product.volume, ...product.skin
        ].join(' '));
        const matchesTerm = !term || allText.includes(term);
        const matchesCategory = !category || normalize(product.category) === category;
        return matchesTerm && matchesCategory;
      });

      const sortMode = sortInput.value;
      if (sortMode === 'cheap') matches.sort((a, b) => a.price - b.price);
      else if (sortMode === 'expensive') matches.sort((a, b) => b.price - a.price);
      else if (sortMode === 'az') matches.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
      return matches;
    }

    function renderLocalResults() {
      const matches = findProducts();
      grid.innerHTML = matches.map(productCard).join('');
      grid.hidden = matches.length === 0;
      emptyState.hidden = matches.length !== 0;
      searchInput.setAttribute('aria-invalid', 'false');

      const hasCriteria = Boolean(searchInput.value.trim() || categoryInput.value);
      const hasCustomSort = sortInput.value !== 'popular';
      if (!matches.length) {
        status.textContent = 'По заданным условиям товары не найдены. Измените поисковый запрос или сбросьте фильтры.';
      } else if (hasCriteria) {
        status.textContent = `Найдено товаров: ${matches.length}. Результаты обновляются при изменении условий подбора.`;
      } else if (hasCustomSort) {
        status.textContent = `Показано товаров: ${matches.length}. Порядок отображения изменён.`;
      } else {
        status.textContent = `В каталоге ${matches.length} товаров. Можно искать по названию, выбрать категорию и изменить порядок отображения.`;
      }
    }

    // Кнопка «Найти» и клавиша Enter запускают тот же поиск.
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      renderLocalResults();
    });

    // Поиск обновляется по мере ввода, без перезагрузки страницы.
    searchInput.addEventListener('input', renderLocalResults);

    // Выбор категории и сортировки сразу обновляет карточки.
    categoryInput.addEventListener('change', renderLocalResults);
    sortInput.addEventListener('change', renderLocalResults);

    searchForm.addEventListener('reset', () => {
      window.setTimeout(() => {
          searchInput.setAttribute('aria-invalid', 'false');
        renderLocalResults();
        searchInput.focus();
      }, 0);
    });

    grid.addEventListener('click', (event) => {
      const button = event.target.closest('[data-add-card]');
      if (!button) return;
      const product = PRODUCTS.find((item) => item.id === button.dataset.addCard);
      if (!product) return;
      if (addToCart(product.id, 1)) {
        button.textContent = 'Добавлено';
        button.classList.add('button-added');
        status.textContent = `${product.name} добавлен в корзину. Можно продолжить выбор или открыть корзину в меню.`;
      } else {
        status.textContent = 'Не удалось сохранить товар в корзине браузера. Проверьте настройки хранения данных.';
      }
    });

    // При первом открытии каталога показываются все товары.
    renderLocalResults();
  }

  // 2. Карточка конкретного товара: название, фото, характеристики и добавление в корзину.
  const productPage = document.querySelector('[data-product-page]');
  if (productPage) {
    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get('id') || 'the-ordinary-hyaluronic';
    const product = PRODUCTS.find((item) => item.id === requestedId) || PRODUCTS[0];
    const setText = (id, value) => { const element = document.getElementById(id); if (element) element.textContent = value; };
    const image = document.querySelector('#product-image');
    document.title = `${product.name} — GladSkin`;
    setText('product-breadcrumb', product.name);
    setText('product-category', product.category);
    setText('product-name', product.name);
    setText('product-description', product.description);
    setText('product-price', formatPrice(product.price));
    setText('product-details', product.details);
    setText('product-volume', product.volume);
    setText('product-spec-category', product.category);
    setText('product-ingredients', product.key);
    setText('product-purpose', product.purpose);
    setText('product-stage', product.stage);
    if (image) { image.src = product.image; image.alt = product.alt; }

    const quantityInput = document.querySelector('#product-quantity');
    const addButton = document.querySelector('#add-product-to-cart');
    const addStatus = document.querySelector('#product-cart-status');
    addButton?.addEventListener('click', () => {
      const quantity = Math.max(1, Math.min(10, Number.parseInt(quantityInput.value, 10) || 1));
      quantityInput.value = String(quantity);
      if (addToCart(product.id, quantity)) {
        addStatus.dataset.state = 'success';
        addStatus.textContent = `«${product.name}» добавлен в корзину (${quantity} шт.).`;
      } else {
        addStatus.dataset.state = 'error';
        addStatus.textContent = 'Не удалось добавить товар. Проверьте, разрешено ли хранение данных в браузере.';
      }
    });
  }

  // 3. Единая проверка полей форм. Никакие сведения на сервер не отправляются.
  function getFieldError(field) {
    const value = field.type === 'checkbox' ? field.checked : field.value.trim();
    if (field.required && (field.type === 'checkbox' ? !value : !value)) return 'Это поле обязательно для заполнения.';
    if (field.type === 'checkbox') return '';
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'Укажите адрес в формате name@example.com.';
    if (field.type === 'tel' && value) {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) return 'Номер должен содержать от 10 до 15 цифр.';
    }
    if (field.name === 'name' && value.length < 2) return 'Введите имя не короче двух символов.';
    if (field.name === 'message' && value.length < 10) return 'Сообщение должно содержать не менее 10 символов.';
    if (field.name === 'message' && value.length > 1000) return 'Сократите сообщение до 1000 символов.';
    return '';
  }

  function showFieldError(form, field, message) {
    const error = form.querySelector(`[data-error-for="${field.id}"]`);
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message;
  }

  document.querySelectorAll('[data-validated-form]').forEach((form) => {
    const status = form.querySelector('.form-status');
    const fields = Array.from(form.querySelectorAll('input, textarea, select'));
    fields.forEach((field) => {
      const update = () => {
        if (field.getAttribute('aria-invalid') === 'true') showFieldError(form, field, getFieldError(field));
      };
      field.addEventListener('input', update);
      field.addEventListener('change', update);
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let firstInvalid = null;
      let hasErrors = false;
      fields.forEach((field) => {
        const error = getFieldError(field);
        showFieldError(form, field, error);
        if (error) { hasErrors = true; if (!firstInvalid) firstInvalid = field; }
      });
      if (form.dataset.validatedForm === 'checkout' && safeReadCart().length === 0) {
        hasErrors = true;
        if (status) { status.dataset.state = 'error'; status.textContent = 'Сначала добавьте товар в корзину.'; }
        return;
      }
      if (hasErrors) {
        if (status) { status.dataset.state = 'error'; status.textContent = 'Проверьте поля, отмеченные сообщениями об ошибке.'; }
        firstInvalid?.focus();
        return;
      }
      if (status) {
        status.dataset.state = 'success';
        status.textContent = form.dataset.validatedForm === 'contact'
          ? 'Поля заполнены правильно. В учебной версии обращение не отправляется на сервер.'
          : 'Данные проверены. В учебной версии заказ не сохраняется и не оплачивается.';
      }
    });
  });

  // 4. Корзина хранится в localStorage: товары не исчезают при переходах между страницами.
  const cartLayout = document.querySelector('#cart-layout');
  if (cartLayout) {
    const cartEmpty = document.querySelector('#cart-empty');
    const itemsContainer = document.querySelector('#cart-items');
    const countOutput = document.querySelector('#cart-count');
    const subtotalOutput = document.querySelector('#cart-subtotal');
    const deliveryOutput = document.querySelector('#cart-delivery');
    const totalOutput = document.querySelector('#cart-total');
    const updateStatus = document.querySelector('#cart-update-status');
    const deliveryHint = document.querySelector('#delivery-hint');

    function renderCart() {
      const cart = safeReadCart();
      cartEmpty.hidden = cart.length !== 0;
      cartLayout.hidden = cart.length === 0;
      if (!cart.length) {
        itemsContainer.replaceChildren();
        countOutput.textContent = 'Товары (0)';
        subtotalOutput.textContent = formatPrice(0);
        deliveryOutput.textContent = formatPrice(0);
        totalOutput.textContent = formatPrice(0);
        deliveryHint.textContent = 'Добавьте товар, чтобы увидеть стоимость доставки.';
        return;
      }

      itemsContainer.innerHTML = cart.map((entry) => {
        const product = PRODUCTS.find((item) => item.id === entry.id);
        if (!product) return '';
        return `
          <article class="cart-item" data-cart-row="${escapeHtml(product.id)}">
            <a class="cart-thumb" href="product.html?id=${encodeURIComponent(product.id)}"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.alt)}" width="300" height="320"></a>
            <div class="cart-item-info">
              <h2><a href="product.html?id=${encodeURIComponent(product.id)}">${escapeHtml(product.name)}</a></h2>
              <p>${escapeHtml(product.category)}, ${escapeHtml(product.volume)}</p>
              <p class="price">${formatPrice(product.price)}</p>
              <div class="cart-row-controls">
                <label for="qty-${escapeHtml(product.id)}">Количество</label>
                <input id="qty-${escapeHtml(product.id)}" data-cart-quantity="${escapeHtml(product.id)}" type="number" min="1" max="10" step="1" value="${entry.quantity}" inputmode="numeric">
                <button class="remove-item" type="button" data-remove-item="${escapeHtml(product.id)}">Удалить</button>
              </div>
            </div>
          </article>`;
      }).join('');

      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = cart.reduce((sum, item) => {
        const product = PRODUCTS.find((entry) => entry.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);
      const delivery = subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_PRICE;
      countOutput.textContent = `Товары (${itemCount})`;
      subtotalOutput.textContent = formatPrice(subtotal);
      deliveryOutput.textContent = delivery ? formatPrice(delivery) : 'Бесплатно';
      totalOutput.textContent = formatPrice(subtotal + delivery);
      deliveryHint.textContent = delivery
        ? `До бесплатной доставки осталось ${formatPrice(FREE_DELIVERY_FROM - subtotal)}.`
        : 'Бесплатная доставка при сумме товаров от 3 000 ₽.';
    }

    itemsContainer.addEventListener('change', (event) => {
      const input = event.target.closest('[data-cart-quantity]');
      if (!input) return;
      const cart = safeReadCart();
      const entry = cart.find((item) => item.id === input.dataset.cartQuantity);
      if (!entry) return;
      entry.quantity = Math.max(1, Math.min(10, Number.parseInt(input.value, 10) || 1));
      writeCart(cart);
      renderCart();
      updateStatus.textContent = 'Количество и сумма заказа обновлены.';
    });

    itemsContainer.addEventListener('click', (event) => {
      const removeButton = event.target.closest('[data-remove-item]');
      if (!removeButton) return;
      const remaining = safeReadCart().filter((item) => item.id !== removeButton.dataset.removeItem);
      writeCart(remaining);
      renderCart();
      updateStatus.textContent = 'Товар удалён из корзины.';
    });

    document.querySelector('#clear-cart')?.addEventListener('click', () => {
      writeCart([]);
      renderCart();
      updateStatus.textContent = 'Корзина очищена.';
    });

    window.addEventListener('storage', (event) => {
      if (event.key === CART_KEY) renderCart();
    });
    renderCart();
  }

  // 5. Внешний API: асинхронный GET-запрос к Open Beauty Facts с индикацией и обработкой ошибок.
  const apiForm = document.querySelector('#beauty-api-form');
  if (apiForm) {
    const queryInput = document.querySelector('#beauty-query');
    const button = document.querySelector('#beauty-search-button');
    const status = document.querySelector('#api-status');
    const results = document.querySelector('#api-results');
    const queryError = document.querySelector('#beauty-query-error');

    function renderExternalProducts(products) {
      results.replaceChildren();
      const usable = (Array.isArray(products) ? products : []).filter((product) => product && product.product_name);
      if (!usable.length) {
        status.dataset.state = 'success';
        status.textContent = 'Во внешней базе не найдено заполненных записей по этому запросу. Попробуйте другое название.';
        return;
      }
      usable.slice(0, 8).forEach((product) => {
        const card = document.createElement('article');
        card.className = 'external-product-card';
        const imageUrl = product.image_front_url || product.image_url || '';
        if (imageUrl) {
          const image = document.createElement('img');
          image.loading = 'lazy';
          image.alt = `Фотография продукта ${product.product_name}`;
          image.src = imageUrl;
          image.addEventListener('error', () => image.remove(), { once: true });
          card.append(image);
        }
        const title = document.createElement('h3');
        title.textContent = product.product_name;
        card.append(title);
        if (product.brands) { const p = document.createElement('p'); p.textContent = `Бренд: ${product.brands}`; card.append(p); }
        if (product.quantity) { const p = document.createElement('p'); p.textContent = `Объём/масса: ${product.quantity}`; card.append(p); }
        if (product.ingredients_text) { const p = document.createElement('p'); const ingredients = product.ingredients_text; p.textContent = `Состав: ${ingredients.slice(0, 150)}${ingredients.length > 150 ? '…' : ''}`; card.append(p); }
        if (product.code) {
          const link = document.createElement('a');
          link.href = `https://world.openbeautyfacts.org/product/${encodeURIComponent(product.code)}`;
          link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Открыть запись в базе ↗'; card.append(link);
        }
        results.append(card);
      });
      status.dataset.state = 'success';
      status.textContent = `Получено записей: ${Math.min(usable.length, 8)}. Данные загружены из Open Beauty Facts.`;
    }

    apiForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const query = queryInput.value.trim();
      if (!query) {
        queryError.textContent = 'Введите название продукта для внешнего поиска.';
        queryInput.setAttribute('aria-invalid', 'true');
        status.dataset.state = 'error';
        status.textContent = 'Запрос не отправлен: сначала заполните поле.';
        queryInput.focus();
        return;
      }
      queryError.textContent = '';
      queryInput.setAttribute('aria-invalid', 'false');
      const params = new URLSearchParams({
        search_terms: query,
        search_simple: '1',
        action: 'process',
        json: '1',
        page_size: '8',
        fields: 'code,product_name,brands,quantity,image_front_url,image_url,ingredients_text'
      });
      const url = `https://world.openbeautyfacts.org/cgi/search.pl?${params.toString()}`;
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 15000);
      button.disabled = true;
      button.textContent = 'Загрузка…';
      results.replaceChildren();
      status.dataset.state = 'loading';
      status.textContent = 'Отправляю GET-запрос к Open Beauty Facts…';
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        });
        if (!response.ok) throw new Error(`Сервер вернул статус ${response.status}.`);
        const data = await response.json();
        if (!data || !Array.isArray(data.products)) throw new Error('В ответе сервиса нет ожидаемого списка товаров.');
        renderExternalProducts(data.products);
      } catch (error) {
        results.replaceChildren();
        status.dataset.state = 'error';
        if (error.name === 'AbortError') {
          status.textContent = 'Время ожидания ответа истекло. Проверьте соединение и попробуйте ещё раз.';
        } else {
          status.textContent = 'Не удалось получить данные из внешней базы. Проверьте подключение к Интернету и повторите запрос. Локальный подбор GladSkin продолжает работать.';
        }
        console.error('Ошибка запроса Open Beauty Facts:', error);
      } finally {
        window.clearTimeout(timeoutId);
        button.disabled = false;
        button.textContent = 'Найти во внешней базе';
      }
    });
    queryInput.addEventListener('input', () => {
      queryError.textContent = '';
      queryInput.setAttribute('aria-invalid', 'false');
    });
  }
})();
