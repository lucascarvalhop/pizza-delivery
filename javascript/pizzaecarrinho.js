import pizzaObj from './pizzaobj.js';

export default function pizzaEcarrinho() {
  /* o if abaixo testa se o usuário está na página de pedidos, todo o código abaixo só
  é executado caso a condição seja true, assim evitando erros de console em outras páginas em que
  o script não deve ser utilizado */

  if (window.location.pathname == '/pizza-delivery/pedidos.html') {
    /* o trecho abaixo adiciona um efeito de load que dura enquanto a página não está totalmente carregada
    esse efeito serve para que o usuário não veja o site todo "desconfigurado" enquanto
    os elementos estão carregando */
    function loadOff() {
      setTimeout(() => {
        document.querySelector('.modal-loading').style.display = 'none';
      }, 1000);
    }
    document.querySelector('.content-container').onload = loadOff();

    // variáveis globais que são utilizadas durante todo o código
    let key;
    const pizzas = pizzaObj();
    let modalQt = 1;
    let cart = [];
    const pizzaContainer = document.querySelector('.pizza-container');

    /* listagem e preenchimento de elementos do HTML com as pizzas, a variável pizzas
    é uma array de objetos que está no arquivo pizzaobj.js, neste arquivo estão todas as informações
    que preencherão o html, isso facilita futura manutenção pois caso queira alterar alguma informação
    na pizza ou até mudar uma pizza por completo basta alterar no arquivo interno e automaticamente será alterado
    aqui também */
    pizzas.forEach((item, index) => {
      let pizzaItem = pizzaContainer.cloneNode(true);
      pizzaItem.setAttribute('data-key', index);
      pizzaItem.querySelector('img').src = item.img;
      pizzaItem.querySelector('.preco').innerHTML =
        'R$' + item.tamanhos[5].toFixed(2).toString().replace('.', ',');
      pizzaItem.querySelector('.titulo').innerHTML = item.nome;
      pizzaItem.querySelector('.descricao').innerHTML = item.descricao;
      document.querySelector('.pizzas-container').append(pizzaItem);

      /* função responsável por abrir o modal, que abre quando há click no botão "+" ou na imagem da pizza
      esta função também preenche o modal que a princípio é vázio quando aberto e é preenchido com as 
      informações de cada pizza */
      function openModal(event) {
        event.preventDefault();
        key = event.target.closest('.pizza-container').getAttribute('data-key');
        modalQt = 1;

        document.querySelector('.modal-container .pizza img').src =
          pizzas[key].img;
        document.querySelector('.pizza-title').innerHTML = pizzas[key].nome;
        document.querySelector('.pizza-subtitle').innerHTML =
          pizzas[key].descricao;
        document.querySelector('.size.selected').classList.remove('selected');
        document.querySelectorAll('.size').forEach((size, sizeIndex) => {
          if (sizeIndex === 2) {
            document.querySelector('.preco--container .preco').innerHTML =
              'R$ ' +
              pizzas[key].tamanhos[5].toFixed(2).toString().replace('.', ',');
            size.classList.add('selected');
          }
        });
        document.querySelector('.add-cart-qt').innerHTML = modalQt;

        document.querySelector('.modal').style.opacity = '0';
        document.querySelector('.modal').style.display = 'flex';
        setTimeout(() => {
          document.querySelector('.modal').style.opacity = '1';
        }, 200);
      }
      pizzaItem.querySelector('img').addEventListener('click', openModal);
      pizzaItem.querySelector('button').addEventListener('click', openModal);
    });

    // eventos do Modal (aumentar/diminuir quantidade de pizzas, fechar modal +)

    function closeModal(event) {
      if (event) {
        event.preventDefault();
      }
      document.querySelector('.modal').style.opacity = '0';
      setTimeout(() => {
        document.querySelector('.modal').style.display = 'none';
      }, 400);
    }
    document.querySelectorAll('.desktop, .mobile').forEach((item) => {
      item.addEventListener('click', closeModal);
    });

    document.querySelector('.aumentar-botao').addEventListener('click', () => {
      modalQt++;
      document.querySelector('.add-cart-qt').innerHTML = modalQt;
    });
    document.querySelector('.diminuir-botao').addEventListener('click', () => {
      if (modalQt > 1) {
        modalQt--;
        document.querySelector('.add-cart-qt').innerHTML = modalQt;
      }
    });
    document.querySelectorAll('.size').forEach((size) => {
      size.addEventListener('click', () => {
        document.querySelector('.size.selected').classList.remove('selected');
        size.classList.add('selected');

        // o código abaixo relaciona o preço da pizza de acordo com o tamanho selecionado
        let preco = document.querySelector('.preco--container .preco');
        if (
          size.classList.contains('size3') &&
          size.classList.contains('selected')
        ) {
          preco.innerHTML =
            'R$ ' +
            pizzas[key].tamanhos[5].toFixed(2).toString().replace('.', ',');
        } else if (
          size.classList.contains('size2') &&
          size.classList.contains('selected')
        ) {
          preco.innerHTML =
            'R$ ' +
            pizzas[key].tamanhos[3].toFixed(2).toString().replace('.', ',');
        } else if (
          size.classList.contains('size1') &&
          size.classList.contains('selected')
        ) {
          preco.innerHTML =
            'R$ ' +
            pizzas[key].tamanhos[1].toFixed(2).toString().replace('.', ',');
        }
      });
    });

    /* o código abaixo adiciona a class "pisca" no icone do carrinho (que só aparece no mobile)
     quando é adicionada alguma pizza nele, é útil para indicar ao usuário
     que ele pode clicar no carrinho */
    document.querySelector('.add-cart-button').addEventListener('click', () => {
      document.querySelector('.fa-solid').classList.add('pisca');

      let size = +document
        .querySelector('.size.selected')
        .getAttribute('data-key');
      let identifier = pizzas[key].id + '@' + size;
      let modalKey = cart.findIndex((item) => {
        return item.identifier == identifier;
      });

      if (modalKey > -1) {
        cart[modalKey].qt += modalQt;
      } else {
        cart.push({
          identifier,
          id: pizzas[key].id,
          size,
          qt: modalQt,
        });
      }
      updateCart();
      closeModal();
    });

    // o código abaixo mostra o carrinho na tela quando clicado (se tiver algum item nele)
    document.querySelector('.cart-button').addEventListener('click', () => {
      if (cart.length) {
        document.querySelector('.carrinho').style.display = 'block';
      }
    });

    /* o código abaixo remove o carrinho da tela quando clicado na setinha de voltar para
    a tela de pizzas (no mobile) */
    document
      .querySelector('.carrinho .mobile')
      .addEventListener('click', () => {
        document.querySelector('.carrinho').style.display = 'none';

        // o código abaixo serve para resolver o problema de responsividade do carrinho que sumia com mudança de tamanho de tela
        if (
          document.querySelector('main').classList.contains('carrinho-ativo')
        ) {
          document.querySelector('main').classList.remove('carrinho-ativo');
        }
      });
    document.body.onresize = function () {
      if (window.innerWidth > 850) {
        if (cart.length) {
          if (
            !document.querySelector('main').classList.contains('carrinho-ativo')
          ) {
            document.querySelector('main').classList.add('carrinho-ativo');
            document.querySelector('.carrinho').style.display = 'block';
          }
        }
      }
    };

    /* o código abaixo fecha o modal quando clicado fora dele, antes dele somente fechava com
    o click no botão de cancelar ou ao adicionar a pizza selecionada ao carrinho */
    function cliqueForaDoModal(event) {
      if (event.target == this) {
        closeModal();
      }
    }
    document
      .querySelector('.modal')
      .addEventListener('click', cliqueForaDoModal);

    /* o código abaixo mostra um loading na tela e depois de 3 segundos redireciona para
    a página "pedido finalizado" quando o usuário acaba de escolher as pizzas e
    clica em finalizar pedido */
    document
      .querySelector('.finalizar-compra')
      .addEventListener('click', () => {
        document.querySelector('.modal-loading').style.display = 'flex';
        setTimeout(() => {
          window.location.href = 'pedido-finalizado.html';
        }, 3000);
      });

    /* o código abaixo atualiza o carrinho toda vez que alguma quantidade de pizza
    é acrescentada ou removida pelo usuário */
    function updateCart() {
      document.querySelector('.cart-qt').innerHTML = cart.length;
      if (cart.length) {
        if (window.matchMedia('(min-width:850px)').matches) {
          document.querySelector('main').classList.add('carrinho-ativo');
          document.querySelector('.carrinho').style.display = 'block';
        }
        if (document.querySelectorAll('.carrinho-container .infos-pizzas')) {
          document
            .querySelectorAll('.carrinho-container .infos-pizzas')
            .forEach((el) => {
              el.remove();
            });
        }
        let subTotal = 0;
        let desconto = 0;
        let total = 0;
        let taxaDeEntrega = 4;

        for (let i in cart) {
          let pizzaItem = pizzas.find((item) => {
            return item.id == cart[i].id;
          });
          let cartItem = document
            .querySelector('.model .infos-pizzas')
            .cloneNode(true);
          let pizzaSizeName;
          switch (cart[i].size) {
            case 0:
              pizzaSizeName = 'P';
              subTotal += pizzaItem.tamanhos[1] * cart[i].qt;
              break;
            case 1:
              pizzaSizeName = 'M';
              subTotal += pizzaItem.tamanhos[3] * cart[i].qt;
              break;
            case 2:
              pizzaSizeName = 'G';
              subTotal += pizzaItem.tamanhos[5] * cart[i].qt;
              break;
          }
          let pizzaName = `${pizzaItem.nome} (${pizzaSizeName})`;
          cartItem.querySelector('img').src = pizzaItem.img;
          cartItem.querySelector('.pizza-name').innerHTML = pizzaName;
          cartItem.querySelector('.cart-item-qt').innerHTML = cart[i].qt;
          cartItem
            .querySelector('.cart-adicionar')
            .addEventListener('click', () => {
              cart[i].qt++;
              updateCart();
            });
          cartItem
            .querySelector('.cart-remover')
            .addEventListener('click', () => {
              if (cart[i].qt > 1) {
                cart[i].qt--;
              } else {
                cart.splice(i, 1);
              }
              updateCart();
            });

          document
            .querySelector('.carrinho-container')
            .insertAdjacentElement('afterbegin', cartItem);
        }

        desconto = subTotal * 0.1;
        total = subTotal - desconto + taxaDeEntrega;
        document.querySelector(
          '.subtotal-preco',
        ).innerHTML = `R$ ${subTotal.toFixed(2)}`;
        document.querySelector(
          '.desconto-preco',
        ).innerHTML = `R$ ${desconto.toFixed(2)}`;
        document.querySelector('.total-preco').innerHTML = `R$ ${total.toFixed(
          2,
        )}`;
      } else {
        document.querySelector('main').classList.remove('carrinho-ativo');
        document.querySelector('.carrinho').style.display = 'none';
        document.querySelector('.fa-solid').classList.remove('pisca');
      }
    }
  }
}
