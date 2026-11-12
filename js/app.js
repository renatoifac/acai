/* Interface e interações do protótipo. */
(() => {
  const state = { selectedSize: null, selectedToppings: [], items: [] };
  const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: MENU.currency }).format(value);
  const sizeOptions = document.querySelector('#size-options');
  const toppingOptions = document.querySelector('#topping-options');
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  document.querySelector('#topping-limit').textContent = MENU.toppingLimit;
  document.querySelector('#topping-limit-inline').textContent = MENU.toppingLimit;
  document.querySelector('#store-address').textContent = STORE.address;
  document.querySelector('#store-hours').textContent = `Todos os dias, das ${STORE.hours.open}h às ${STORE.hours.close}h.`;
  document.querySelector('#question-link').href = `https://wa.me/${STORE.phone}?text=${encodeURIComponent('Oi! Tenho uma dúvida sobre o cardápio da Açaí da Ponte.')}`;

  function renderOptions() {
    sizeOptions.innerHTML = MENU.sizes.map(size => `
      <button class="size-card" type="button" role="radio" aria-checked="false" data-size="${size.id}">
        <span class="option-name">${escapeHtml(size.name)}</span><span class="option-detail">${escapeHtml(size.detail)}</span><span class="option-name">${money(size.price)}</span>
      </button>`).join('');
    sizeOptions.setAttribute('role', 'radiogroup');
    sizeOptions.setAttribute('aria-label', 'Tamanho do copo');
    toppingOptions.innerHTML = MENU.toppings.map(topping => `
      <button class="topping-card" type="button" aria-pressed="false" data-topping="${topping.id}">
        <span class="option-name">${escapeHtml(topping.name)}</span><span class="option-detail">${topping.price ? `+ ${money(topping.price)}` : 'Grátis'}</span>
      </button>`).join('');
  }

  function updateStoreStatus() {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    const open = STORE.hours.days.includes(now.getDay()) && hour >= STORE.hours.open && hour < STORE.hours.close;
    const status = document.querySelector('#store-status');
    status.classList.toggle('is-closed', !open);
    status.textContent = open ? `Aberto agora · até às ${STORE.hours.close}h` : `Fechado, abre às ${STORE.hours.open}h`;
  }

  function calculateItem(sizeId, toppingIds) {
    const size = MENU.sizes.find(option => option.id === sizeId);
    const toppings = toppingIds.map(id => MENU.toppings.find(option => option.id === id)).filter(Boolean);
    return { sizeId, toppingIds: [...toppingIds], total: size.price + toppings.reduce((sum, topping) => sum + topping.price, 0) };
  }

  function renderOrder() {
    const list = document.querySelector('#order-items');
    const total = state.items.reduce((sum, item) => sum + item.total, 0);
    list.innerHTML = state.items.map((item, index) => {
      const size = MENU.sizes.find(option => option.id === item.sizeId);
      const toppings = item.toppingIds.map(id => MENU.toppings.find(option => option.id === id)?.name).filter(Boolean);
      return `<article class="order-item"><div class="item-topline"><strong>${escapeHtml(size.name)} · ${money(item.total)}</strong><button class="remove-item" type="button" data-remove="${index}" aria-label="Remover ${escapeHtml(size.name)} do pedido">Remover</button></div><span class="item-detail">${toppings.length ? escapeHtml(toppings.join(', ')) : 'Sem complementos'}</span></article>`;
    }).join('');
    document.querySelector('#order-empty').hidden = state.items.length > 0;
    document.querySelector('#clear-order').hidden = state.items.length === 0;
    document.querySelector('#order-total').textContent = money(total);
    document.querySelector('#mobile-total').textContent = money(total);
    document.querySelector('#repeat-order').hidden = !localStorage.getItem('acai-ponte-last-order');
    updateSendButtons(total > 0);
  }

  function updateSendButtons(enabled) {
    const hint = document.querySelector('#send-hint');
    hint.textContent = enabled ? 'Pedido enviado? Combine a retirada com a gente.' : 'Adicione um copo para liberar o pedido.';
    ['#send-order', '#mobile-send'].forEach(selector => {
      const link = document.querySelector(selector);
      link.classList.toggle('is-disabled', !enabled);
      link.setAttribute('aria-disabled', String(!enabled));
      link.href = enabled ? buildWhatsAppUrl() : '#monte';
    });
  }

  function buildWhatsAppUrl() {
    const lines = state.items.map((item, index) => {
      const size = MENU.sizes.find(option => option.id === item.sizeId);
      const toppings = item.toppingIds.map(id => MENU.toppings.find(option => option.id === id)?.name).filter(Boolean);
      return `${index + 1}. ${size.name}${toppings.length ? ` com ${toppings.join(', ')}` : ' sem complementos'} — ${money(item.total)}`;
    });
    const total = state.items.reduce((sum, item) => sum + item.total, 0);
    const message = `Oi! Quero fazer este pedido para retirar na loja:\n${lines.join('\n')}\nTotal: ${money(total)}\nQual o tempo de preparo?`;
    return `https://wa.me/${STORE.phone}?text=${encodeURIComponent(message)}`;
  }

  sizeOptions.addEventListener('click', event => {
    const button = event.target.closest('[data-size]');
    if (!button) return;
    state.selectedSize = button.dataset.size;
    sizeOptions.querySelectorAll('[data-size]').forEach(option => option.setAttribute('aria-checked', String(option === button)));
    document.querySelector('#size-message').textContent = '';
    updateAddButton();
  });

  toppingOptions.addEventListener('click', event => {
    const button = event.target.closest('[data-topping]');
    if (!button || button.disabled) return;
    const id = button.dataset.topping;
    state.selectedToppings = state.selectedToppings.includes(id) ? state.selectedToppings.filter(item => item !== id) : [...state.selectedToppings, id];
    button.setAttribute('aria-pressed', String(state.selectedToppings.includes(id)));
    const atLimit = state.selectedToppings.length >= MENU.toppingLimit;
    toppingOptions.querySelectorAll('[data-topping]').forEach(option => { option.disabled = atLimit && !state.selectedToppings.includes(option.dataset.topping); });
    document.querySelector('#topping-message').textContent = atLimit ? `Limite de ${MENU.toppingLimit} complementos atingido. Desmarque um para trocar.` : '';
    updateAddButton();
  });

  function updateAddButton() {
    document.querySelector('#add-item').disabled = !state.selectedSize;
  }

  document.querySelector('#add-item').addEventListener('click', () => {
    if (!state.selectedSize) {
      const message = document.querySelector('#size-message');
      message.textContent = 'Escolha um tamanho para continuar.';
      message.classList.add('is-error');
      sizeOptions.querySelector('button')?.focus();
      return;
    }
    const item = calculateItem(state.selectedSize, state.selectedToppings);
    state.items.push(item);
    localStorage.setItem('acai-ponte-last-order', JSON.stringify(state.items));
    state.selectedSize = null;
    state.selectedToppings = [];
    sizeOptions.querySelectorAll('[data-size]').forEach(option => option.setAttribute('aria-checked', 'false'));
    toppingOptions.querySelectorAll('[data-topping]').forEach(option => { option.setAttribute('aria-pressed', 'false'); option.disabled = false; });
    document.querySelector('#topping-message').textContent = '';
    updateAddButton();
    renderOrder();
    document.querySelector('#order-title').focus?.();
  });

  document.querySelector('#order-items').addEventListener('click', event => {
    const button = event.target.closest('[data-remove]');
    if (!button) return;
    state.items.splice(Number(button.dataset.remove), 1);
    if (state.items.length) localStorage.setItem('acai-ponte-last-order', JSON.stringify(state.items));
    else localStorage.removeItem('acai-ponte-last-order');
    renderOrder();
  });

  const dialog = document.querySelector('#clear-dialog');
  document.querySelector('#clear-order').addEventListener('click', () => dialog.showModal());
  document.querySelector('#confirm-clear').addEventListener('click', () => {
    state.items = [];
    localStorage.removeItem('acai-ponte-last-order');
    renderOrder();
  });

  document.querySelector('#repeat-order').addEventListener('click', () => {
    try {
      const lastOrder = JSON.parse(localStorage.getItem('acai-ponte-last-order') || '[]');
      state.items = lastOrder.filter(item => MENU.sizes.some(size => size.id === item.sizeId) && Array.isArray(item.toppingIds)).map(item => calculateItem(item.sizeId, item.toppingIds.slice(0, MENU.toppingLimit)));
      renderOrder();
      document.querySelector('#order-title').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch {
      localStorage.removeItem('acai-ponte-last-order');
      document.querySelector('#repeat-order').hidden = true;
    }
  });

  ['#send-order', '#mobile-send'].forEach(selector => document.querySelector(selector).addEventListener('click', event => {
    if (event.currentTarget.getAttribute('aria-disabled') === 'true') event.preventDefault();
  }));

  renderOptions();
  updateStoreStatus();
  renderOrder();
})();
