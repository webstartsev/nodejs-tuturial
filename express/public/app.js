const toCurrency = price =>
  new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency'
  }).format(price);

const toDate = date =>
  new Intl.DateTimeFormat('ru-Ru', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date));

document.querySelectorAll('.price').forEach(node => {
  node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll('.date').forEach(node => {
  node.textContent = toDate(node.textContent);
});

const $card = document.querySelector('#card');

if ($card) {
  $card.addEventListener('click', evt => {
    if (evt.target.classList.contains('js-remove')) {
      const id = evt.target.dataset.id;

      fetch(`/card/remove/${id}`, {
        method: 'delete'
      })
        .then(res => res.json())
        .then(card => {
          if (card.courses.length) {
            const html = card.courses

              .map(c => {
                return `
              <tr>
                <td>${c.title}</td>
                <td>${c.count}</td>
                <td><button class="btn btn-small js-remove" data-id="${c._id}">Удалить</button></td>
              </tr>
              `;
              })
              .join('');

            $card.querySelector('tbody').innerHTML = html;
            $card.querySelector('.price').textContent = toCurrency(card.price);
          } else {
            $card.innerHTML = `<p>Корзина пуста</p>`;
          }
        });
    }
  });
}

M.Tabs.init(document.querySelectorAll('.tabs'));
