document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário é admin
    const currentUser = getData('currentUser');
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Atualizar nome do administrador
    const adminNameElement = document.getElementById('admin-name');
    if (adminNameElement) {
        adminNameElement.textContent = currentUser.username;
    }
    
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
    const addInventoryForm = document.getElementById('add-inventory-form');
    const inventoryTable = document.getElementById('inventory-table').querySelector('tbody');
    const searchInput = document.getElementById('inventory-search');
    const searchBtn = document.getElementById('search-btn');
    
    // Função para exibir os itens do estoque na tabela
    function displayInventoryItems(items) {
        inventoryTable.innerHTML = '';
        
        if (items.length === 0) {
            inventoryTable.innerHTML = '<tr><td colspan="7">Nenhum item encontrado no estoque</td></tr>';
            return;
        }
        
        items.forEach(item => {
            const totalValue = item.quantity * item.price;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.quantity.toFixed(2)}</td>
                <td>${item.unit}</td>
                <td>${formatPrice(item.price)}</td>
                <td>${formatPrice(totalValue)}</td>
                <td>
                    <button class="btn-icon edit-item-btn" data-id="${item.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-item-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            inventoryTable.appendChild(row);
        });
        
        // Adicionar event listeners para editar e excluir
        addActionListeners();
    }
    
    // Função para adicionar event listeners para os botões de ação
    function addActionListeners() {
        // Event listeners para os botões de excluir
        document.querySelectorAll('.delete-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteInventoryItem(id);
            });
        });
        
        // Event listeners para os botões de editar
        document.querySelectorAll('.edit-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editInventoryItem(id);
            });
        });
    }
    
    // Função para adicionar um novo item ao estoque
    function addInventoryItem(e) {
        e.preventDefault();
        
        const name = document.getElementById('item-name').value;
        const quantity = parseFloat(document.getElementById('item-quantity').value);
        const unit = document.getElementById('item-unit').value;
        const price = parseFloat(document.getElementById('item-price').value);
        
        const inventory = getData('inventory') || [];
        
        // Verificar se o item já existe (pelo nome e unidade)
        const existingItemIndex = inventory.findIndex(item => 
            item.name.toLowerCase() === name.toLowerCase() && item.unit === unit
        );
        
        if (existingItemIndex !== -1) {
            // Atualizar quantidade do item existente
            inventory[existingItemIndex].quantity += quantity;
            
            // Calcular novo preço médio ponderado
            const oldValue = inventory[existingItemIndex].quantity * inventory[existingItemIndex].price;
            const newValue = quantity * price;
            const totalQuantity = inventory[existingItemIndex].quantity + quantity;
            
            inventory[existingItemIndex].price = (oldValue + newValue) / totalQuantity;
            
            saveData('inventory', inventory);
            showNotification(`Quantidade de "${name}" atualizada no estoque!`);
        } else {
            // Gerar ID único (em um cenário real, isso seria feito pelo banco de dados)
            const maxId = inventory.length > 0 ? Math.max(...inventory.map(item => item.id)) : 0;
            const newId = maxId + 1;
            
            const newItem = {
                id: newId,
                name,
                quantity,
                unit,
                price
            };
            
            inventory.push(newItem);
            saveData('inventory', inventory);
            showNotification(`Item "${name}" adicionado ao estoque!`);
        }
        
        // Limpar formulário
        addInventoryForm.reset();
        
        // Atualizar tabela
        displayInventoryItems(inventory);
    }
    
    // Função para excluir um item do estoque
    function deleteInventoryItem(id) {
        if (!confirm('Tem certeza que deseja excluir este item do estoque?')) {
            return;
        }
        
        let inventory = getData('inventory') || [];
        const itemIndex = inventory.findIndex(item => item.id === id);
        
        if (itemIndex !== -1) {
            const itemName = inventory[itemIndex].name;
            
            // Verificar se o item está sendo usado em alguma receita
            const recipes = getData('recipes') || [];
            const isUsedInRecipe = recipes.some(recipe => 
                recipe.ingredients.some(ingredient => ingredient.itemId === id)
            );
            
            if (isUsedInRecipe) {
                alert(`Não é possível excluir "${itemName}" pois está sendo usado em receitas!`);
                return;
            }
            
            inventory.splice(itemIndex, 1);
            saveData('inventory', inventory);
            
            // Atualizar tabela
            displayInventoryItems(inventory);
            
            showNotification(`Item "${itemName}" excluído do estoque!`);
        }
    }
    
    // Função para editar um item do estoque
    function editInventoryItem(id) {
        const inventory = getData('inventory') || [];
        const item = inventory.find(item => item.id === id);
        
        if (!item) return;
        
        // Preencher o formulário com os dados do item
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-quantity').value = item.quantity;
        document.getElementById('item-unit').value = item.unit;
        document.getElementById('item-price').value = item.price;
        
        // Alterar o formulário para modo de edição
        const submitBtn = addInventoryForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Atualizar Item';
        
        // Desabilitar o campo de unidade para evitar inconsistências
        document.getElementById('item-unit').disabled = true;
        
        // Remover event listener anterior
        addInventoryForm.removeEventListener('submit', addInventoryItem);
        
        // Adicionar novo event listener para atualizar
        addInventoryForm.addEventListener('submit', function updateItemHandler(e) {
            e.preventDefault();
            
            const name = document.getElementById('item-name').value;
            const quantity = parseFloat(document.getElementById('item-quantity').value);
            const unit = document.getElementById('item-unit').value;
            const price = parseFloat(document.getElementById('item-price').value);
            
            const inventory = getData('inventory') || [];
            const itemIndex = inventory.findIndex(item => item.id === id);
            
            if (itemIndex !== -1) {
                inventory[itemIndex] = {
                    ...inventory[itemIndex],
                    name,
                    quantity,
                    unit,
                    price
                };
                
                saveData('inventory', inventory);
                
                // Limpar formulário e redefinir botão
                addInventoryForm.reset();
                submitBtn.textContent = 'Adicionar ao Estoque';
                document.getElementById('item-unit').disabled = false;
                
                // Remover este event listener
                addInventoryForm.removeEventListener('submit', updateItemHandler);
                
                // Restaurar event listener original
                addInventoryForm.addEventListener('submit', addInventoryItem);
                
                // Atualizar tabela
                displayInventoryItems(inventory);
                
                showNotification(`Item "${name}" atualizado no estoque!`);
            }
        });
    }
    
    // Função para pesquisar itens
    function searchItems() {
        const searchTerm = searchInput.value.toLowerCase();
        const inventory = getData('inventory') || [];
        
        const filteredItems = inventory.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
        
        displayInventoryItems(filteredItems);
    }
    
    // Inicializar dados de estoque se não existirem
    if (!getData('inventory')) {
        const defaultInventory = [
            { id: 1, name: 'Arroz Arbóreo', quantity: 10.00, unit: 'KG', price: 12.50 },
            { id: 2, name: 'Camarão Limpo', quantity: 5.00, unit: 'KG', price: 89.90 },
            { id: 3, name: 'Filé Mignon', quantity: 8.00, unit: 'KG', price: 79.90 },
            { id: 4, name: 'Sal', quantity: 3.00, unit: 'KG', price: 3.50 },
            { id: 5, name: 'Azeite Extra Virgem', quantity: 5.00, unit: 'LT', price: 25.90 },
            { id: 6, name: 'Creme de Leite Fresco', quantity: 3.00, unit: 'LT', price: 15.80 },
            { id: 7, name: 'Limão Siciliano', quantity: 20.00, unit: 'UN', price: 1.50 }
        ];
        saveData('inventory', defaultInventory);
    }
    
    // Carregar itens do estoque quando a página carrega
    const inventory = getData('inventory') || [];
    displayInventoryItems(inventory);
    
    // Event listeners
    addInventoryForm.addEventListener('submit', addInventoryItem);
    
    if (searchBtn) {
        searchBtn.addEventListener('click', searchItems);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchItems();
            }
        });
    }
});