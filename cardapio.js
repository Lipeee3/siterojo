document.addEventListener('DOMContentLoaded', function() {
    // Pratos padrão (em um cenário real, isso seria carregado do servidor)
    const defaultDishes = [
        {
            id: 1,
            name: 'Risoto de Camarão',
            description: 'Risoto cremoso com camarões frescos, ervas finas e um toque de limão.',
            price: 68.90,
            image: 'https://via.placeholder.com/300x200'
        },
        {
            id: 2,
            name: 'Filé Mignon ao Molho Madeira',
            description: 'Filé mignon grelhado, acompanhado de molho madeira e batatas rústicas.',
            price: 75.50,
            image: 'https://via.placeholder.com/300x200'
        },
        {
            id: 3,
            name: 'Salmão Grelhado',
            description: 'Salmão fresco grelhado, servido com legumes salteados e molho de ervas.',
            price: 82.90,
            image: 'https://via.placeholder.com/300x200'
        },
        {
            id: 4,
            name: 'Massa ao Molho Pesto',
            description: 'Massa fresca ao molho pesto caseiro, tomate cereja e queijo parmesão.',
            price: 52.00,
            image: 'https://via.placeholder.com/300x200'
        }
    ];
    
    // Verificar se já temos pratos no localStorage
    if (!getData('menu')) {
        saveData('menu', defaultDishes);
    }
    
    const menuItemsContainer = document.getElementById('menu-items-container');
    const searchInput = document.getElementById('menu-search');
    const searchBtn = document.getElementById('search-btn');
    
    // Função para exibir os pratos
    function displayMenuItems(dishes) {
        menuItemsContainer.innerHTML = '';
        
        if (dishes.length === 0) {
            menuItemsContainer.innerHTML = '<p>Nenhum prato encontrado.</p>';
            return;
        }
        
        dishes.forEach(dish => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = `
                <div class="menu-item-img">
                    <img src="${dish.image}" alt="${dish.name}">
                </div>
                <div class="menu-item-info">
                    <h3>${dish.name}</h3>
                    <p>${dish.description}</p>
                    <div class="menu-item-price">${formatPrice(dish.price)}</div>
                    <button class="btn add-to-cart-btn" data-id="${dish.id}">Adicionar ao Carrinho</button>
                </div>
            `;
            
            menuItemsContainer.appendChild(menuItem);
        });
        
        // Adicionar event listeners aos botões de adicionar ao carrinho
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const dish = dishes.find(d => d.id === id);
                
                if (dish) {
                    addToCart(dish);
                }
            });
        });
    }
    
    // Função para pesquisar pratos
    function searchMenuItems() {
        const searchTerm = searchInput.value.toLowerCase();
        const menu = getData('menu');
        
        const filteredDishes = menu.filter(dish => 
            dish.name.toLowerCase().includes(searchTerm) || 
            dish.description.toLowerCase().includes(searchTerm)
        );
        
        displayMenuItems(filteredDishes);
    }
    
    // Carregar pratos quando a página carrega
    const menu = getData('menu');
    displayMenuItems(menu);
    
    // Event listeners para pesquisa
    if (searchBtn) {
        searchBtn.addEventListener('click', searchMenuItems);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchMenuItems();
            }
        });
    }
});
