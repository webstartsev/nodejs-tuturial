document.querySelectorAll('.price').forEach(node => {
  node.textContent = new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency'
  }).format(node.textContent);
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
        .then(card => console.log('card: ', card));
    }
  });
}
