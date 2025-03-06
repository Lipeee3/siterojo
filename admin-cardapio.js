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
    }});



// Função para carregar os ingredientes do estoque com suas quantidades
async function loadIngredientsWithStock() {
    try {
        // Supondo que exista uma API ou localStorage que armazene os dados de estoque
        const response = await fetch('/api/estoque');
        const stockItems = await response.json();
        
        // Alternativa se estiver usando localStorage
        // const stockItems = JSON.parse(localStorage.getItem('estoque')) || [];
        
        return stockItems;
    } catch (error) {
        console.error('Erro ao carregar dados de estoque:', error);
        return [];
    }
}

// Função para preencher os selects de ingredientes com informações de estoque
async function populateIngredientSelects() {
    const ingredientSelects = document.querySelectorAll('.ingredient-select');
    const stockItems = await loadIngredientsWithStock();
    
    ingredientSelects.forEach(select => {
        // Limpa opções existentes, mantendo apenas a primeira
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Adiciona os ingredientes do estoque com suas quantidades
        stockItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.nome} (${item.quantidade} ${item.unidade} em estoque)`;
            option.dataset.stock = item.quantidade;
            option.dataset.unit = item.unidade;
            select.appendChild(option);
        });
    });
}

// Função para verificar se há estoque suficiente para a receita
function checkStockAvailability(ingredientId, requiredAmount) {
    const stockItems = JSON.parse(localStorage.getItem('estoque')) || [];
    const ingredient = stockItems.find(item => item.id === ingredientId);
    
    if (!ingredient) return false;
    
    // Verifica se há quantidade suficiente
    return ingredient.quantidade >= requiredAmount;
}

// Função para adicionar uma nova linha de ingrediente com informações de estoque
function addIngredientRow(container, index, stockItems = []) {
    const ingredientRow = document.createElement('div');
    ingredientRow.className = 'ingredient-row';
    
    ingredientRow.innerHTML = `
        <div class="form-group">
            <label for="ingredient-${index}">Ingrediente</label>
            <select id="ingredient-${index}" name="ingredient-${index}" class="ingredient-select" required>
                <option value="">Selecione um ingrediente</option>
            </select>
            <span class="stock-info" id="stock-info-${index}"></span>
        </div>
        <div class="form-group">
            <label for="amount-${index}">Quantidade</label>
            <input type="number" id="amount-${index}" name="amount-${index}" min="0" step="0.01" required>
        </div>
        <div class="form-group">
            <label for="unit-${index}">Unidade</label>
            <select id="unit-${index}" name="unit-${index}" required>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="unidade">unidade</option>
                <option value="xícara">xícara</option>
                <option value="colher-sopa">colher de sopa</option>
                <option value="colher-cha">colher de chá</option>
            </select>
        </div>
        <button type="button" class="remove-ingredient btn-icon"><i class="fas fa-trash"></i></button>
    `;
    
    container.appendChild(ingredientRow);
    
    // Preenche o select com os ingredientes do estoque
    const select = ingredientRow.querySelector('.ingredient-select');
    
    stockItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.nome} (${item.quantidade} ${item.unidade} em estoque)`;
        option.dataset.stock = item.quantidade;
        option.dataset.unit = item.unidade;
        select.appendChild(option);
    });
    
    // Adiciona evento para atualizar informação de estoque quando a quantidade mudar
    const amountInput = ingredientRow.querySelector(`#amount-${index}`);
    amountInput.addEventListener('input', function() {
        updateStockInfo(select, amountInput, index);
    });
    
    // Adiciona evento para atualizar informação de estoque quando o ingrediente mudar
    select.addEventListener('change', function() {
        updateStockInfo(select, amountInput, index);
    });
    
    // Adiciona evento para remover a linha de ingrediente
    const removeButton = ingredientRow.querySelector('.remove-ingredient');
    removeButton.addEventListener('click', function() {
        container.removeChild(ingredientRow);
    });
    
    return ingredientRow;
}

// Função para atualizar a informação de estoque
function updateStockInfo(ingredientSelect, amountInput, index) {
    const stockInfo = document.getElementById(`stock-info-${index}`);
    const selectedOption = ingredientSelect.options[ingredientSelect.selectedIndex];
    
    if (selectedOption && selectedOption.dataset.stock && amountInput.value) {
        const stock = parseFloat(selectedOption.dataset.stock);
        const required = parseFloat(amountInput.value);
        
        if (required > stock) {
            stockInfo.textContent = `⚠️ Estoque insuficiente! Faltam ${(required - stock).toFixed(2)} ${selectedOption.dataset.unit}`;
            stockInfo.className = 'stock-info stock-warning';
        } else {
            stockInfo.textContent = `✓ Estoque disponível: ${stock} ${selectedOption.dataset.unit}`;
            stockInfo.className = 'stock-info stock-ok';
        }
    } else {
        stockInfo.textContent = '';
        stockInfo.className = 'stock-info';
    }
}

// Inicialização do formulário
document.addEventListener('DOMContentLoaded', async function() {
    const addRecipeForm = document.getElementById('add-recipe-form');
    const ingredientsContainer = document.getElementById('ingredients-container');
    const addIngredientButton = document.getElementById('add-ingredient');
    
    // Carrega os dados de estoque
    const stockItems = await loadIngredientsWithStock();
    
    // Inicializa o primeiro ingrediente
    if (ingredientsContainer.children.length === 0) {
        addIngredientRow(ingredientsContainer, 1, stockItems);
    } else {
        // Atualiza os selects existentes
        populateIngredientSelects();
    }
    
    // Adiciona evento para adicionar uma nova linha de ingrediente
    addIngredientButton.addEventListener('click', function() {
        const nextIndex = ingredientsContainer.children.length + 1;
        addIngredientRow(ingredientsContainer, nextIndex, stockItems);
    });
    
    // Adiciona evento para submeter o formulário
    addRecipeForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Verifica se há estoque suficiente para todos os ingredientes
        let hasEnoughStock = true;
        const ingredientRows = ingredientsContainer.querySelectorAll('.ingredient-row');
        
        ingredientRows.forEach(row => {
            const select = row.querySelector('.ingredient-select');
            const amount = row.querySelector('input[type="number"]').value;
            
            if (select.value && amount) {
                const option = select.options[select.selectedIndex];
                const stock = parseFloat(option.dataset.stock);
                const required = parseFloat(amount);
                
                if (required > stock) {
                    hasEnoughStock = false;
                }
            }
        });
        
        if (!hasEnoughStock) {
            if (!confirm('Alguns ingredientes não têm estoque suficiente. Deseja continuar mesmo assim?')) {
                return;
            }
        }
        
        // Continua com o salvamento da receita
        saveRecipe();
    });
    
    // Função para salvar a receita
    function saveRecipe() {
        // Lógica existente para salvar a receita
        // ...
        
        // Após salvar, limpa o formulário e atualiza a tabela
        addRecipeForm.reset();
        loadRecipes(); // Supondo que exista uma função para carregar as receitas
        alert('Receita salva com sucesso!');
    }
    

});
