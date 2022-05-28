const loader = document.querySelector('.loader');
const quote = document.querySelector('.quote');
const source = document.querySelector('.source');

fetch('/data')
  .then((res) => res.json())
  .then((data) => {
    loader.style.display = 'none';
    quote.textContent = data.content;
    quote.classList.remove('suspense');
    source.textContent = `${data.book}, ${data.chapter}, p. ${data.page}`;
    source.classList.remove('suspense');
  });
