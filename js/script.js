// Marca que o JS está ativo (as animações de rolagem só valem com JS)
document.documentElement.classList.add('js');

/* ===== Tema claro/escuro ===== */
const raiz = document.documentElement;
const botaoTema = document.getElementById('tema');

function temaSalvo() {
  try { return localStorage.getItem('tema'); } catch (e) { return null; }
}
function aplicarTema(tema) {
  raiz.setAttribute('data-theme', tema);
  try { localStorage.setItem('tema', tema); } catch (e) { /* ignora */ }
}

aplicarTema(temaSalvo() || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

botaoTema.addEventListener('click', () => {
  aplicarTema(raiz.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ===== Menu mobile ===== */
const menu = document.getElementById('menu');
const hamburguer = document.getElementById('hamburguer');

hamburguer.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  hamburguer.setAttribute('aria-expanded', aberto);
});
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('aberto');
    hamburguer.setAttribute('aria-expanded', 'false');
  });
});

/* ===== Aparecer ao rolar ===== */
const revelaveis = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });
  revelaveis.forEach(el => observador.observe(el));
} else {
  revelaveis.forEach(el => el.classList.add('visivel'));
}

/* ===== Link ativo no menu ===== */
const secoes = document.querySelectorAll('main section[id]');
const linksMenu = document.querySelectorAll('.menu a');
if ('IntersectionObserver' in window) {
  const ativo = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        linksMenu.forEach(a => a.classList.toggle('ativo', a.getAttribute('href') === '#' + entrada.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secoes.forEach(s => ativo.observe(s));
}

/* ===== Formulário de contato ===== */
const form = document.getElementById('form-contato');
const status = document.getElementById('form-status');
const EMAIL_DESTINO = 'elias221147@gmail.com';

function mostrarErro(campo, texto) {
  form.querySelector('[data-erro="' + campo + '"]').textContent = texto;
  form.elements[campo].classList.toggle('invalido', Boolean(texto));
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const nome = form.elements.nome.value.trim();
  const email = form.elements.email.value.trim();
  const mensagem = form.elements.mensagem.value.trim();
  let valido = true;

  mostrarErro('nome', nome ? '' : 'Digite seu nome.');
  mostrarErro('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Digite um e-mail válido, como nome@exemplo.com.');
  mostrarErro('mensagem', mensagem.length >= 10 ? '' : 'Escreva uma mensagem com pelo menos 10 caracteres.');

  if (!nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || mensagem.length < 10) valido = false;
  if (!valido) { status.textContent = ''; return; }

  // GitHub Pages não tem back-end: abre o app de e-mail com a mensagem pronta.
  const assunto = encodeURIComponent('Contato pelo portfólio: ' + nome);
  const corpo = encodeURIComponent(mensagem + '\n\n' + nome + '\n' + email);
  window.location.href = 'mailto:' + EMAIL_DESTINO + '?subject=' + assunto + '&body=' + corpo;

  status.textContent = 'Mensagem pronta. Confirme o envio no seu aplicativo de e-mail.';
  form.reset();
});

/* ===== Janela de ampliação (imagens e PDFs) ===== */
const modal = document.getElementById('modal');
const modalCorpo = document.getElementById('modal-corpo');
const modalTitulo = document.getElementById('modal-titulo');
const modalRodape = document.getElementById('modal-rodape');
const modalLink = document.getElementById('modal-link');

function abrirModal(href, titulo) {
  modalCorpo.innerHTML = '';
  modalTitulo.textContent = titulo || '';
  if (/\.pdf($|[?#])/i.test(href)) {
    const quadro = document.createElement('iframe');
    quadro.src = href;
    quadro.title = titulo || 'Documento PDF';
    modalCorpo.appendChild(quadro);
    modalLink.href = href;
    modalRodape.hidden = false;
  } else {
    const img = document.createElement('img');
    img.src = href;
    img.alt = titulo || '';
    modalCorpo.appendChild(img);
    modalRodape.hidden = true;
  }
  modal.showModal();
}

document.addEventListener('click', (evento) => {
  const alvo = evento.target.closest('[data-lightbox]');
  if (!alvo || typeof modal.showModal !== 'function') return; // sem suporte: abre o link normalmente
  if (evento.ctrlKey || evento.metaKey || evento.shiftKey) return;
  evento.preventDefault();
  abrirModal(alvo.getAttribute('href'), alvo.dataset.titulo);
});

document.getElementById('modal-fechar').addEventListener('click', () => modal.close());
modal.addEventListener('click', (evento) => { if (evento.target === modal) modal.close(); }); // clique fora fecha
modal.addEventListener('close', () => { modalCorpo.innerHTML = ''; });

// se uma imagem de projeto ainda não existir na pasta, esconde o espaço dela
document.querySelectorAll('.figura img').forEach(img => {
  img.addEventListener('error', () => { img.closest('.figura').style.display = 'none'; });
});

/* ===== Ano no rodapé ===== */
document.getElementById('ano').textContent = new Date().getFullYear();
