document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const recipeSelect = document.getElementById('recipeSelect');
    const recipeDetailsContainer = document.getElementById('recipe-details');
    const explodeRecipeBtn = document.getElementById('explodeRecipeBtn');
    const printSeparationReportBtn = document.getElementById('printSeparationReportBtn');
    const printPreparationReportBtn = document.getElementById('printPreparationReportBtn');
    const actionButtonsContainer = document.querySelector('.action-buttons');
    const quantidadePratosInput = document.getElementById('quantidadePratos'); // Novo campo de entrada

    // Load Recipes from localStorage
    function loadRecipes() {
        try {
            const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
            
            console.log('Loaded recipes:', recipes); // Debug log
            
            recipeSelect.innerHTML = '<option value="">Selecione uma receita</option>';
            
            recipes.forEach((recipe, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = recipe.nome;
                recipeSelect.appendChild(option);
            });
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
                
                <h5>Modo de Preparo:</h5>
                <ol>
                    ${recipe.modoPreparo.map(passo => 
                        `<li>${passo}</li>`
                    ).join('')}
                </ol>
                
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
                        
                        <h2>Modo de Preparo:</h2>
                        <ol>
                            ${selectedRecipe.modoPreparo.map(passo => 
                                `<li>${passo}</li>`
                            ).join('')}
                        </ol>
                        
                        <p>Rendimento: ${quantidadePratos} porções</p>
                    </div>
                </body>
            </html>
        `);
        explodeWindow.document.close();
    }

    // Generate separation report
// Gerar relatório de separação
// Gerar relatório de separação
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


    // Generate preparation report
// Gerar relatório de preparação
function generatePreparationReport() {
    const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    const selectedIndex = recipeSelect.value;

    if (selectedIndex === "") {
        alert('Selecione uma receita primeiro');
        return;
    }

    const recipe = recipes[selectedIndex];
    const quantidadePratos = parseInt(quantidadePratosInput.value) || 1; // Valor padrão é 1

    const reportContent = `
    RELATÓRIO DE PREPARAÇÃO

    RECEITA: ${recipe.nome}
    QUANTIDADE DE PRATOS: ${quantidadePratos}

    MODO DE PREPARO:
    ${recipe.modoPreparo.map((passo, index) => `${index + 1}. ${passo}`).join('\n')}

    RENDIMENTO DA RECEITA: ${quantidadePratos} porções
    `;

    const reportWindow = window.open('', 'Relatório de Preparação', 'width=600,height=400');
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
                <h1>RELATÓRIO DE PREPARAÇÃO</h1>
                <pre>${reportContent}</pre>
            </body>
        </html>
    `);
    reportWindow.document.close();
}
// Gerar relatório de preparação
function generatePreparationReport() {
    const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    const selectedIndex = recipeSelect.value;
    
    if (selectedIndex === "") {
        alert('Selecione uma receita primeiro');
        return;
    }
    
    const recipe = recipes[selectedIndex];
    const quantidadePratos = parseInt(quantidadePratosInput.value) || 1; // Valor padrão é 1

    const reportContent = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; font-size: 16px;">
    <h1 style="text-align: center; color: #e63946;">RELATÓRIO DE PREPARAÇÃO</h1>
    <p><strong>RECEITA:</strong> ${recipe.nome}</p>
    <p><strong>QUANTIDADE DE PRATOS:</strong> ${quantidadePratos}</p>

    <h2>Modo de Preparo:</h2>
    <ol>
        ${recipe.modoPreparo.map((passo, index) => `<li>${passo}</li>`).join('')}
    </ol>

    <p><strong>Rendimento da Receita:</strong> ${quantidadePratos} porções</p>
</div>
    `;
    
    const reportWindow = window.open('', 'Relatório de Preparação', 'width=600,height=400');
    reportWindow.document.write(`
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        margin: 0;
                        padding: 20px;
                    }
                    h1 {
                        text-align: center;
                        color: #e63946;
                    }
                    h2 {
                        color: #333;
                    }
                    ol {
                        padding-left: 20px;
                    }
                    li {
                        margin-bottom: 8px;
                    }
                </style>
            </head>
            <body>
                ${reportContent}
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="window.print()" style="padding: 10px 20px; background-color: #e63946; color: white; border: none; cursor: pointer;">Imprimir Relatório</button>
                </div>
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
            ['RELATÓRIO DE PREPARAÇÃO'],
            ['RECEITA', selectedRecipe.nome],
            ['QUANTIDADE DE PRATOS', quantidadePratos],
            ['RENDIMENTO DA RECEITA', `${quantidadePratos} porções`],
            [],
            ['MODO DE PREPARO']
        ];

        // Add preparation steps
        selectedRecipe.modoPreparo.forEach((passo, index) => {
            csvContent.push([`Passo ${index + 1}`, passo]);
        });

        // Add ingredients
        csvContent.push([], ['INGREDIENTES']);
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
        link.setAttribute("download", `Relatorio_${selectedRecipe.nome}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Function to add example recipes
    function addExampleRecipes() {
        const exampleRecipes = [
            {
                nome: 'Bolo de Chocolate',
                rendimento: 8,
                ingredientes: [
                    { nome: 'Farinha', quantidade: 2, unidade: 'xícaras' },
                    { nome: 'Açúcar', quantidade: 1, unidade: 'xícara' },
                    { nome: 'Chocolate em pó', quantidade: 0.5, unidade: 'xícara' }
                ],
                modoPreparo: [
                    'Misture os ingredientes secos',
                    'Adicione os ingredientes líquidos',
                    'Misture até obter uma massa homogênea',
                    'Asse em forno preaquecido a 180°C por 40 minutos'
                ]
            },
            {
                nome: 'Frango Assado',
                rendimento: 4,
                ingredientes: [
                    { nome: 'Frango', quantidade: 1, unidade: 'unidade' },
                    { nome: 'Sal', quantidade: 2, unidade: 'colheres' },
                    { nome: 'Alho', quantidade: 3, unidade: 'dentes' }
                ],
                modoPreparo: [
                    'Tempere o frango',
                    'Coloque em assadeira',
                    'Asse por 1 hora a 200°C',
                    'Vire o frango na metade do tempo'
                ]
            }
        ];

        localStorage.setItem('recipes', JSON.stringify(exampleRecipes));
        loadRecipes();
    }

    // Add event listeners
    recipeSelect.addEventListener('change', displayRecipeDetails);
    explodeRecipeBtn.addEventListener('click', explodeRecipe);
    quantidadePratosInput.addEventListener('input', displayRecipeDetails); // Atualizar ao mudar a quantidade
    
    printSeparationReportBtn.addEventListener('click', generateSeparationReport);
    printPreparationReportBtn.addEventListener('click', generatePreparationReport);

    // Add Excel download button
    const excelDownloadBtn = document.createElement('button');
    excelDownloadBtn.textContent = 'Baixar Relatório Excel';
    excelDownloadBtn.addEventListener('click', downloadExcelReport);
    actionButtonsContainer.appendChild(excelDownloadBtn);

    // Debug button to add example recipes
    const debugBtn = document.createElement('button');
    debugBtn.textContent = 'Adicionar Receitas Exemplo';
    debugBtn.addEventListener('click', addExampleRecipes);
    actionButtonsContainer.appendChild(debugBtn);

    // Load recipes initially
    loadRecipes();

    // Add a first-time initialization check
    if (!localStorage.getItem('recipes')) {
        addExampleRecipes();
    }
});
