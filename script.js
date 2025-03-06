document.addEventListener('DOMContentLoaded', () => {
    // Simular login (substitua por autenticação real)
    const username = localStorage.getItem('username') || 'Administrador';
    document.getElementById('admin-name').textContent = username;

    // Botão de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Remove o nome do usuário do localStorage
            localStorage.removeItem('username');


            // Redireciona para a página de login
            window.location.href = 'login.html'; // Certifique-se de que o caminho está correto
        });
    }

  });

// Funções gerais compartilhadas por todas as páginas

// Função para mostrar notificações
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Funções para gerenciar o localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Função para formatar preço
function formatPrice(price) {
    return 'R$ ' + parseFloat(price).toFixed(2).replace('.', ',');
}

// Carrinho de compras
let cart = getData('cart') || [];

function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function toggleCart() {
    const cartPanel = document.querySelector('.cart-panel');
    cartPanel.classList.toggle('active');
    
    if (cartPanel.classList.contains('active')) {
        renderCartItems();
    }
}

function renderCartItems() {
    const cartItemsElement = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.cart-total-value');
    
    if (!cartItemsElement) return;
    
    cartItemsElement.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p>Seu carrinho está vazio</p>';
        cartTotalElement.textContent = formatPrice(0);
        return;
    }
    
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Quantidade: ${item.quantity}</p>
                <p class="cart-item-price">${formatPrice(itemTotal)}</p>
            </div>
            <div class="cart-item-actions">
                <button class="btn-icon" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItemsElement.appendChild(cartItemElement);
    });
    
    cartTotalElement.textContent = formatPrice(total);
}

function addToCart(product) {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveData('cart', cart);
    updateCartCount();
    showNotification(`${product.name} adicionado ao carrinho`);
}

function removeFromCart(index) {
    const item = cart[index];
    cart.splice(index, 1);
    
    saveData('cart', cart);
    updateCartCount();
    renderCartItems();
    showNotification(`${item.name} removido do carrinho`);
}

function clearCart() {
    cart = [];
    saveData('cart', cart);
    updateCartCount();
    renderCartItems();
    showNotification('Carrinho esvaziado');
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio', 'error');
        return;
    }
    
    // Simulando um checkout
    showNotification('Pedido realizado com sucesso!');
    clearCart();
    toggleCart();
}

// Inicializar elementos do carrinho quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Inicializar carrinho se estiver na página de cardápio
    const cartIcon = document.querySelector('.cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }
    
    const cartClose = document.querySelector('.cart-close');
    if (cartClose) {
        cartClose.addEventListener('click', toggleCart);
    }
    
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});
// Carregar dados do estoque ao iniciar a página
document.addEventListener('DOMContentLoaded', function() {
    updateInventoryTable();
    document.getElementById('reports').style.display = 'none';
});

// Atualizar a tabela de estoque
function updateInventoryTable() {
    const inventoryTable = document.getElementById('inventory-items');
    inventoryTable.innerHTML = '';
    
    for (const itemName in inventory) {
        const item = inventory[itemName];
        const row = document.createElement('tr');
        
        // Formatar o nome do item para exibição (substituir underscores por espaços)
        const displayName = itemName.replace(/_/g, ' ');
        
        row.innerHTML = `
            <td>${displayName}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
        `;
        
        inventoryTable.appendChild(row);
    }
}

// Função para explodir receita
function explodeRecipe() {
    const recipeSelect = document.getElementById('recipe');
    const quantityInput = document.getElementById('quantity');
    const resultDiv = document.getElementById('result');
    
    const recipeId = recipeSelect.value;
    const quantity = parseInt(quantityInput.value);
    
    // Validações
    if (!recipeId) {
        showResult('Por favor, selecione uma receita.', 'alert-danger');
        return;
    }
    
    if (isNaN(quantity) || quantity < 1) {
        showResult('Por favor, informe uma quantidade válida.', 'alert-danger');
        return;
    }
    
    const recipe = recipes[recipeId];
    
    // Verificar disponibilidade no estoque
    const insufficientItems = [];
    
    for (const ingredient of recipe.ingredients) {
        const requiredQuantity = ingredient.quantity * quantity;
        const inventoryItem = inventory[ingredient.name];
        
        if (!inventoryItem || inventoryItem.quantity < requiredQuantity) {
            const displayName = ingredient.name.replace(/_/g, ' ');
            insufficientItems.push({
                name: displayName,
                required: requiredQuantity,
                available: inventoryItem ? inventoryItem.quantity : 0,
                unit: ingredient.unit
            });
        }
    }
    
    if (insufficientItems.length > 0) {
        let message = 'Estoque insuficiente para os seguintes itens:<ul>';
        
        for (const item of insufficientItems) {
            message += `<li>${item.name}: necessário ${item.required} ${item.unit}, disponível ${item.available} ${item.unit}</li>`;
        }
        
        message += '</ul>';
        showResult(message, 'alert-danger');
        return;
    }
    
    // Subtrair do estoque
    for (const ingredient of recipe.ingredients) {
        const requiredQuantity = ingredient.quantity * quantity;
        inventory[ingredient.name].quantity -= requiredQuantity;
    }
    
    // Atualizar tabela de estoque
    updateInventoryTable();
    
    // Gerar relatórios
    generateReports(recipe, quantity);
    
    showResult(`Receita "${recipe.name}" explodida com sucesso para ${quantity} unidade(s)!`, 'alert-success');
}

// Exibir mensagem de resultado
function showResult(message, className) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = message;
    resultDiv.className = 'alert ' + className;
    resultDiv.style.display = 'block';
}

// Gerar relatórios
function generateReports(recipe, quantity) {
    // Exibir a seção de relatórios
    document.getElementById('reports').style.display = 'block';
    
    // Configurar dados comuns
    const currentDate = new Date().toLocaleDateString('pt-BR');
    document.getElementById('report-date').textContent = currentDate;
    document.getElementById('recipe-name').textContent = recipe.name;
    document.getElementById('recipe-quantity').textContent = quantity;
    
    document.getElementById('prep-report-date').textContent = currentDate;
    document.getElementById('prep-recipe-name').textContent = recipe.name;
    document.getElementById('prep-recipe-quantity').textContent = quantity;
    
    // Gerar relatório de separação
    const separationItems = document.getElementById('separation-items');
    separationItems.innerHTML = '';
    
    for (const ingredient of recipe.ingredients) {
        const requiredQuantity = ingredient.quantity * quantity;
        const row = document.createElement('tr');
        
        // Formatar o nome do item para exibição (substituir underscores por espaços)
        const displayName = ingredient.name.replace(/_/g, ' ');
        
        row.innerHTML = `
            <td>${displayName}</td>
            <td>${requiredQuantity}</td>
            <td>${ingredient.unit}</td>
            <td>${inventory[ingredient.name].quantity + requiredQuantity} ${ingredient.unit}</td>
        `;
        
        separationItems.appendChild(row);
    }
    
    // Gerar relatório de preparação
    const preparationSteps = document.getElementById('preparation-steps');
    preparationSteps.innerHTML = '';
    
    recipe.steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        stepDiv.innerHTML = `<span class="step-number">Passo ${index + 1}:</span> ${step}`;
        preparationSteps.appendChild(stepDiv);
    });
}

// Alternar entre as abas de relatórios
function switchTab(tabId) {
    // Atualizar abas
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    const clickedTab = document.querySelector(`.tab[onclick="switchTab('${tabId}')"]`);
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
    
    // Mostrar o relatório correto
    document.getElementById('separation-report').style.display = tabId === 'separation' ? 'block' : 'none';
    document.getElementById('preparation-report').style.display = tabId === 'preparation' ? 'block' : 'none';
}

// Exemplo de como abrir o modal de editar receita
function openEditRecipeModal() {
    document.getElementById('edit-recipe-modal').classList.add('active');
}

// Exemplo de como fechar o modal de editar receita
function closeEditRecipeModal() {
    document.getElementById('edit-recipe-modal').classList.remove('active');
}


// Exemplo simples de script para controlar a sidebar
const sidebar = document.querySelector('.sidebar');
const toggleButton = document.querySelector('.toggle-sidebar'); // Botão para abrir/fechar a sidebar

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    sidebar.classList.toggle('inactive');
});
