document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const recipeSelect = document.getElementById('recipeSelect');
    const recipeDetailsContainer = document.getElementById('recipe-details');
    const explodeRecipeBtn = document.getElementById('explodeRecipeBtn');
    const printSeparationReportBtn = document.getElementById('printSeparationReportBtn');
    const quantidadePratosInput = document.getElementById('quantidadePratos'); // Novo campo de entrada

    // Load Recipes from localStorage
    function loadRecipes() {
        try {
            const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
            
            console.log('Loaded recipes:', recipes); // Debug log
            
            // Limpa o select antes de adicionar novas opções
            recipeSelect.innerHTML = '<option value="">Selecione uma receita</option>';
            
            // Adiciona as receitas ao select
            recipes.forEach((recipe, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = recipe.nome;
                recipeSelect.appendChild(option);
            });

            // Verifica se há receitas carregadas
            if (recipes.length === 0) {
                console.warn('Nenhuma receita encontrada no localStorage.');
            }
        } catch (error) {
            console.error('Error loading recipes:', error);
            alert('Erro ao carregar receitas. Tente adicionar receitas de exemplo.');
        }
    }

    // Display Recipe Details
    function displayRecipeDetails() {
        const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        const selectedIndex = recipeSelect.value;
        
        if (selectedIndex === "") {
            recipeDetailsContainer.innerHTML = '';
            return;
        }
        
        const recipe = recipes[selectedIndex];
        const quantidadePratos = parseInt(quantidadePratosInput.value) || 1; // Valor padrão é 1

        // Calcular fator de proporção
        const fatorProporcao = quantidadePratos / (recipe.rendimento || 1);

        // Create detailed view of recipe
        let detailsHTML = `
            <h4>${recipe.nome}</h4>
            <div class="recipe-info">
                <h5>Ingredientes (para ${quantidadePratos} pratos):</h5>
                <ul>
                    ${recipe.ingredientes.map(ing => {
                        const quantidadeAjustada = ing.quantidade * fatorProporcao;
                        return `<li>${ing.nome}: ${quantidadeAjustada.toFixed(2)} ${ing.unidade}</li>`;
                    }).join('')}
                </ul>
                
                <p>Rendimento: ${quantidadePratos} porções</p>
            </div>
        `;
        
        recipeDetailsContainer.innerHTML = detailsHTML;
    }

    // Explode Recipe (show details in a new window)
    function explodeRecipe() {
        const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        const selectedIndex = recipeSelect.value;
    
        if (selectedIndex === "") {
            alert('Selecione uma receita primeiro');
            return;
        }
    
        const selectedRecipe = recipes[selectedIndex];
        const quantidadePratos = parseInt(quantidadePratosInput.value) || 1; // Valor padrão é 1
    
        // Calcular fator de proporção
        const fatorProporcao = quantidadePratos / (selectedRecipe.rendimento || 1);
    
        const explodeWindow = window.open('', 'Detalhes da Receita', 'width=600,height=400');
        explodeWindow.document.write(`
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                            font-size: 16px;
                        }
                        h1 {
                            color: #e63946;
                            text-align: center;
                            margin-bottom: 20px;
                        }
                    </style>
                </head>
                <body>
                    <h1>${selectedRecipe.nome}</h1>
                    <div class="recipe-info">
                        <h2>Ingredientes (para ${quantidadePratos} pratos):</h2>
                        <ul>
                            ${selectedRecipe.ingredientes.map(ing => {
                                const quantidadeAjustada = ing.quantidade * fatorProporcao;
                                return `<li>${ing.nome}: ${quantidadeAjustada.toFixed(2)} ${ing.unidade}</li>`;
                            }).join('')}
                        </ul>
                        
                        <p>Rendimento: ${quantidadePratos} porções</p>
                    </div>
                </body>
            </html>
        `);
        explodeWindow.document.close();
    }

    // Generate separation report (somente ordem de separação)
    function generateSeparationReport() {
        const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        const selectedIndex = recipeSelect.value;

        if (selectedIndex === "") {
            alert('Selecione uma receita primeiro');
            return;
        }

        const recipe = recipes[selectedIndex];
        const quantidadePratos = parseInt(quantidadePratosInput.value) || 1; // Valor padrão é 1

        // Calcular fator de proporção
        const fatorProporcao = quantidadePratos / (recipe.rendimento || 1);

        const reportContent = `
        RELATÓRIO DE SEPARAÇÃO

        RECEITA: ${recipe.nome}
        QUANTIDADE DE PRATOS: ${quantidadePratos}

        INGREDIENTES NECESSÁRIOS:
        ${recipe.ingredientes.map(ing => {
            const quantidadeAjustada = ing.quantidade * fatorProporcao;
            return `- ${ing.nome}: ${quantidadeAjustada.toFixed(2)} ${ing.unidade}`;
        }).join('\n')}

        RENDIMENTO DA RECEITA: ${quantidadePratos} porções
        `;

        const reportWindow = window.open('', 'Relatório de Separação', 'width=600,height=400');
        reportWindow.document.write(`
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                            font-size: 16px;
                        }
                        h1 {
                            color: #e63946;
                            text-align: center;
                            margin-bottom: 20px;
                        }
                    </style>
                </head>
                <body>
                    <h1>RELATÓRIO DE SEPARAÇÃO</h1>
                    <pre>${reportContent}</pre>
                </body>
            </html>
        `);
        reportWindow.document.close();
    }

    // Function to download report as Excel
    function downloadExcelReport() {
        const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        const selectedIndex = recipeSelect.value;
        
        if (selectedIndex === "") {
            alert('Selecione uma receita primeiro');
            return;
        }

        const selectedRecipe = recipes[selectedIndex];
        const quantidadePratos = parseInt(quantidadePratosInput.value) || 1; // Valor padrão é 1

        // Calcular fator de proporção
        const fatorProporcao = quantidadePratos / (selectedRecipe.rendimento || 1);

        // Create CSV content
        const csvContent = [
            ['RELATÓRIO DE SEPARAÇÃO'],
            ['RECEITA', selectedRecipe.nome],
            ['QUANTIDADE DE PRATOS', quantidadePratos],
            ['RENDIMENTO DA RECEITA', `${quantidadePratos} porções`],
            [],
            ['INGREDIENTES']
        ];

        // Add ingredients
        selectedRecipe.ingredientes.forEach(ing => {
            const quantidadeAjustada = ing.quantidade * fatorProporcao;
            csvContent.push([ing.nome, `${quantidadeAjustada.toFixed(2)} ${ing.unidade}`]);
        });

        // Convert to CSV
        const csvString = csvContent.map(e => e.join(",")).join("\n");

        // Create download
        const blob = new Blob(["\ufeff" + csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Relatorio_Separacao_${selectedRecipe.nome}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Add event listeners
    recipeSelect.addEventListener('change', displayRecipeDetails);
    explodeRecipeBtn.addEventListener('click', explodeRecipe);
    quantidadePratosInput.addEventListener('input', displayRecipeDetails); // Atualizar ao mudar a quantidade
    
    printSeparationReportBtn.addEventListener('click', generateSeparationReport);

    // Add Excel download button
    const excelDownloadBtn = document.createElement('button');
    excelDownloadBtn.textContent = 'Baixar Relatório Excel';
    excelDownloadBtn.addEventListener('click', downloadExcelReport);
    document.querySelector('.action-buttons').appendChild(excelDownloadBtn);

    // Load recipes initially
    loadRecipes();
});

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