document.addEventListener('DOMContentLoaded', function() {
    // Usuários padrão (em um cenário real, isso seria feito no servidor)
    const defaultUsers = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'cliente', password: 'cliente123', role: 'customer' }
    ];
    
    // Verificar se já temos usuários no localStorage
    if (!getData('users')) {
        saveData('users', defaultUsers);
    }
    
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const users = getData('users');
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                // Salvar sessão do usuário
                saveData('currentUser', {
                    username: user.username,
                    role: user.role
                });
                
                // Redirecionar com base no papel do usuário
                if (user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'cardapio.html';
                }
            } else {
                showNotification('Usuário ou senha incorretos', 'error');
            }
        });
    }
});