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

            // Exibe um alerta personalizado (opcional)
           // alert('Você foi desconectado com sucesso!');

            // Redireciona para a página de login
            window.location.href = 'login.html'; // Certifique-se de que o caminho está correto
        });
    }
    // Load recipes from admin-cardapio.html
    async function loadRecipes() {
        try {
            const response = await fetch('admin-cardapio.html');
            const text = await response.text();
            const parser = new DOMParser();
            const cardapioDoc = parser.parseFromString(text, 'text/html');
            
            const recipeSelect = document.getElementById('recipe-select');
            const recipes = cardapioDoc.querySelectorAll('.recipe');
            
            recipes.forEach(recipe => {
                const option = document.createElement('option');
                option.value = recipe.dataset.recipeId;
                option.textContent = recipe.dataset.recipeName;
                recipeSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar receitas:', error);
        }
    }

    // Explosion functionality
    document.getElementById('explode-recipe-btn').addEventListener('click', async () => {
        const selectedRecipeId = document.getElementById('recipe-select').value;
        
        // Fetch recipe details from admin-cardapio.html
        const recipeDetails = await fetchRecipeDetails(selectedRecipeId);
        
        // Subtract ingredients from stock
        await updateStock(recipeDetails.ingredients);
        
        // Generate reports
        generateSeparationReport(recipeDetails.ingredients);
        generatePreparationReport(recipeDetails);
    });

    // Function to fetch recipe details
    async function fetchRecipeDetails(recipeId) {
        // Implement logic to fetch recipe details from admin-cardapio.html
        // This is a placeholder implementation
        return {
            id: recipeId,
            name: 'Receita Exemplo',
            ingredients: [
                { name: 'Ingrediente 1', quantity: 100, unit: 'g' },
                { name: 'Ingrediente 2', quantity: 50, unit: 'ml' }
            ],
            steps: [
                'Passo 1: Misturar ingredientes',
                'Passo 2: Cozinhar por 10 minutos'
            ]
        };
    }

    // Function to update stock
    async function updateStock(ingredients) {
        try {
            // Fetch current stock from admin-estoque.html
            const response = await fetch('admin-estoque.html');
            const text = await response.text();
            const parser = new DOMParser();
            const estoqueDoc = parser.parseFromString(text, 'text/html');
            
            // Update stock logic here
            ingredients.forEach(ingredient => {
                const stockItem = estoqueDoc.querySelector(`[data-ingredient="${ingredient.name}"]`);
                if (stockItem) {
                    const currentStock = parseFloat(stockItem.dataset.quantity);
                    const newStock = currentStock - ingredient.quantity;
                    stockItem.dataset.quantity = newStock.toFixed(2);
                }
            });
            
            // Save updated stock back to admin-estoque.html
            // Note: This is a simplified example and would require server-side implementation
        } catch (error) {
            console.error('Erro ao atualizar estoque:', error);
        }
    }

    // Generate Separation Report
    function generateSeparationReport(ingredients) {
        const reportWindow = window.open('', 'Relatório de Separação', 'width=600,height=400');
        reportWindow.document.write('<html><head><title>Relatório de Separação</title></head><body>');
        reportWindow.document.write('<h1>Relatório de Separação</h1>');
        reportWindow.document.write('<table border="1"><tr><th>Ingrediente</th><th>Quantidade</th><th>Unidade</th></tr>');
        
        ingredients.forEach(ingredient => {
            reportWindow.document.write(`
                <tr>
                    <td>${ingredient.name}</td>
                    <td>${ingredient.quantity}</td>
                    <td>${ingredient.unit}</td>
                </tr>
            `);
        });
        
        reportWindow.document.write('</table>');
        reportWindow.document.write('<button onclick="window.print()">Imprimir</button>');
        reportWindow.document.write('</body></html>');
    }

    // Generate Preparation Report
    function generatePreparationReport(recipeDetails) {
        const reportWindow = window.open('', 'Relatório de Preparação', 'width=600,height=400');
        reportWindow.document.write('<html><head><title>Relatório de Preparação</title></head><body>');
        reportWindow.document.write(`<h1>Relatório de Preparação - ${recipeDetails.name}</h1>`);
        reportWindow.document.write('<h2>Ingredientes:</h2>');
        reportWindow.document.write('<ul>');
        
        recipeDetails.ingredients.forEach(ingredient => {
            reportWindow.document.write(`
                <li>${ingredient.name}: ${ingredient.quantity} ${ingredient.unit}</li>
            `);
        });
        
        reportWindow.document.write('</ul>');
        reportWindow.document.write('<h2>Passos de Preparação:</h2>');
        reportWindow.document.write('<ol>');
        
        recipeDetails.steps.forEach(step => {
            reportWindow.document.write(`<li>${step}</li>`);
        });
        
        reportWindow.document.write('</ol>');
        reportWindow.document.write('<button onclick="window.print()">Imprimir</button>');
        reportWindow.document.write('</body></html>');
    }

    // Initial setup
    loadRecipes();
});