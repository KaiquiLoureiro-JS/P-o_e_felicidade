document.addEventListener("DOMContentLoaded", () => {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const subtotalElement = document.getElementById("subtotal");
    const totalQuantityElement = document.getElementById("totalQuantity");
    const totalElement = document.getElementById("total");
    const clearCartButton = document.getElementById("clearCart");
    const checkoutButton = document.getElementById("checkoutButton");

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    function formatarPreco(valor) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function salvarCarrinho() {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }

    function atualizarContador() {
        const quantidadeTotal = carrinho.reduce(
            (total, produto) => total + produto.quantidade,
            0
        );

        if (cartCount) {
            cartCount.textContent = quantidadeTotal;
        }
    }

    function mostrarCarrinho() {
        cartItems.innerHTML = "";

        if (carrinho.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-icon">🛒</div>
                    <h3>Seu carrinho está vazio</h3>
                    <p>Adicione produtos para começar seu pedido.</p>
                    <a href="index.html" class="empty-button">
                        Ver produtos
                    </a>
                </div>
            `;

            subtotalElement.textContent = "R$ 0,00";
            totalElement.textContent = "R$ 0,00";
            totalQuantityElement.textContent = "0";
            checkoutButton.disabled = true;

            atualizarContador();
            return;
        }

        let subtotal = 0;
        let quantidadeTotal = 0;

        carrinho.forEach((produto, index) => {
            const totalProduto = produto.preco * produto.quantidade;

            subtotal += totalProduto;
            quantidadeTotal += produto.quantidade;

            const item = document.createElement("div");
            item.className = "cart-item";

            item.innerHTML = `
                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                    class="product-image"
                >

                <div class="product-information">
                    <span class="product-category">
                        ${produto.categoria}
                    </span>

                    <h3 class="product-name">
                        ${produto.nome}
                    </h3>

                    <p class="product-price">
                        ${formatarPreco(produto.preco)}
                    </p>

                    <div class="quantity-area">
                        <button
                            class="quantity-button"
                            data-action="diminuir"
                            data-index="${index}"
                        >
                            −
                        </button>

                        <span class="quantity-number">
                            ${produto.quantidade}
                        </span>

                        <button
                            class="quantity-button"
                            data-action="aumentar"
                            data-index="${index}"
                        >
                            +
                        </button>
                    </div>

                    <button
                        class="remove-button"
                        data-action="remover"
                        data-index="${index}"
                    >
                        Remover produto
                    </button>
                </div>

                <strong class="product-total">
                    ${formatarPreco(totalProduto)}
                </strong>
            `;

            cartItems.appendChild(item);
        });

        subtotalElement.textContent = formatarPreco(subtotal);
        totalElement.textContent = formatarPreco(subtotal);
        totalQuantityElement.textContent = quantidadeTotal;
        checkoutButton.disabled = false;

        atualizarContador();
    }

    cartItems.addEventListener("click", (event) => {
        const botao = event.target.closest("button");

        if (!botao) {
            return;
        }

        const acao = botao.dataset.action;
        const index = Number(botao.dataset.index);

        if (acao === "aumentar") {
            carrinho[index].quantidade++;
        }

        if (acao === "diminuir") {
            carrinho[index].quantidade--;

            if (carrinho[index].quantidade <= 0) {
                carrinho.splice(index, 1);
            }
        }

        if (acao === "remover") {
            carrinho.splice(index, 1);
        }

        salvarCarrinho();
        mostrarCarrinho();
    });

    clearCartButton.addEventListener("click", () => {
        if (carrinho.length === 0) {
            return;
        }

        const confirmar = confirm(
            "Deseja realmente limpar o carrinho?"
        );

        if (confirmar) {
            carrinho = [];
            salvarCarrinho();
            mostrarCarrinho();
        }
    });

    checkoutButton.addEventListener("click", () => {
        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio.");
            return;
        }

        alert(
            "Pedido preparado com sucesso! " +
            "Agora você pode escolher Pix ou cartão."
        );
    });

    mostrarCarrinho();
});