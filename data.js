const inventory = {
    "farinha": { quantity: 10000, unit: "g" },
    "acucar": { quantity: 5000, unit: "g" },
    "leite": { quantity: 5000, unit: "ml" },
    "ovos": { quantity: 24, unit: "un" },
    "fermento": { quantity: 500, unit: "g" },
    "chocolate_po": { quantity: 1000, unit: "g" },
    "manteiga": { quantity: 2000, unit: "g" },
    "sal": { quantity: 1000, unit: "g" },
    "agua": { quantity: 10000, unit: "ml" },
    "oleo": { quantity: 2000, unit: "ml" },
    "tomate": { quantity: 3000, unit: "g" },
    "queijo_mussarela": { quantity: 2000, unit: "g" },
    "oregano": { quantity: 200, unit: "g" },
    "azeite": { quantity: 1000, unit: "ml" }
};

const recipes = {
    "bolo_chocolate": {
        name: "Bolo de Chocolate",
        ingredients: [
            { name: "farinha", quantity: 300, unit: "g" },
            { name: "acucar", quantity: 200, unit: "g" },
            { name: "chocolate_po", quantity: 100, unit: "g" },
            { name: "ovos", quantity: 4, unit: "un" },
            { name: "leite", quantity: 250, unit: "ml" },
            { name: "manteiga", quantity: 150, unit: "g" },
            { name: "fermento", quantity: 15, unit: "g" }
        ],
        steps: [
            "Pré-aqueça o forno a 180°C e unte uma forma redonda.",
            "Em uma tigela, misture a farinha, o açúcar e o chocolate em pó.",
            "Em outra tigela, bata os ovos, adicione o leite e a manteiga derretida.",
            "Junte os ingredientes secos aos líquidos, misturando suavemente.",
            "Por último, adicione o fermento e misture delicadamente.",
            "Despeje a massa na forma e leve ao forno por aproximadamente 40 minutos.",
            "Faça o teste do palito para verificar se está assado."
        ]
    },
    // Add more recipes as needed
};