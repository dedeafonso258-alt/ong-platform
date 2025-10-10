// Máscaras para os campos do formulário
document.addEventListener('DOMContentLoaded', function() {
    // Máscara para CPF
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        e.target.value = value;
    });

    // Máscara para telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = value;
    });

    // Máscara para CEP
    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 8) {
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = value;
    });

    // Validação do formulário
    const form = document.getElementById('formCadastro');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validação básica - verificar se pelo menos uma opção de ajuda foi selecionada
        const ajudaCheckboxes = document.querySelectorAll('input[name="ajuda"]:checked');
        if (ajudaCheckboxes.length === 0) {
            alert('Por favor, selecione pelo menos uma forma de ajudar (voluntário ou doador).');
            return;
        }
        
        // Se todas as validações passarem
        alert('Cadastro enviado com sucesso! Entraremos em contato em breve.');
        form.reset();
    });
});
