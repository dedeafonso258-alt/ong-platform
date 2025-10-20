// ===== SISTEMA DE NAVEGAÇÃO RESPONSIVA =====
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    // Menu Hambúrguer
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }

    // ===== MÁSCARAS DE INPUT =====
    // Máscara para CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            e.target.value = value;
        });
    }

    // Máscara para telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    }

    // Máscara para CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 8) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    }

    // ===== VALIDAÇÃO DE FORMULÁRIO =====
    const form = document.getElementById('formCadastro');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar checkboxes de ajuda
            const ajudaCheckboxes = document.querySelectorAll('input[name="ajuda"]:checked');
            if (ajudaCheckboxes.length === 0) {
                showAlert('Por favor, selecione pelo menos uma forma de ajudar (voluntário, doador ou material).', 'error');
                return;
            }

            // Se todas as validações passarem
            showAlert('Cadastro enviado com sucesso! Entraremos em contato em breve.', 'success');
            form.reset();
        });

        // Validação em tempo real
        const inputs = form.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                clearValidation(this);
            });
        });
    }

    // ===== FUNÇÕES DE VALIDAÇÃO =====
    function validateField(field) {
        const feedback = field.parentElement.querySelector('.form-feedback');
        
        if (!field.checkValidity()) {
            field.classList.add('invalid');
            if (feedback) {
                feedback.textContent = getValidationMessage(field);
                feedback.className = 'form-feedback invalid';
            }
        } else {
            field.classList.remove('invalid');
            field.classList.add('valid');
            if (feedback) {
                feedback.textContent = '✓ Campo válido';
                feedback.className = 'form-feedback valid';
            }
        }
    }

    function clearValidation(field) {
        field.classList.remove('invalid', 'valid');
        const feedback = field.parentElement.querySelector('.form-feedback');
        if (feedback) {
            feedback.textContent = '';
        }
    }

    function getValidationMessage(field) {
        if (field.validity.valueMissing) {
            return '⚠ Este campo é obrigatório';
        }
        if (field.validity.typeMismatch) {
            return '⚠ Formato inválido';
        }
        if (field.validity.patternMismatch) {
            return '⚠ Formato incorreto';
        }
        if (field.validity.tooShort) {
            return ⚠ Mínimo ${field.minLength} caracteres;
        }
        return '⚠ Campo inválido';
    }

    // ===== SISTEMA DE ALERTAS =====
    function showAlert(message, type = 'info') {
        // Criar elemento de alerta
        const alert = document.createElement('div');
        alert.className = alert alert-${type};
        alert.innerHTML = `
            <span>${message}</span>
            <button class="alert-close">&times;</button>
        `;

        // Estilos do alerta
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-500)' : 
                         type === 'error' ? 'var(--error-500)' : 'var(--info-500)'};
            color: white;
            padding: var(--space-3) var(--space-4);
            border-radius: var(--border-radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: var(--space-3);
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;

        // Botão fechar
        const closeBtn = alert.querySelector('.alert-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: var(--font-size-xl);
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        closeBtn.addEventListener('click', () => {
            alert.remove();
        });

        // Adicionar ao body
        document.body.appendChild(alert);

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }

    // ===== ANIMAÇÃO DE SCROLL SUAVE =====
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== DROPDOWN INTERATIVO =====
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });

        dropdown.addEventListener('mouseleave', function() {
            this.classList.remove('active');
        });
    });
});

// ===== ESTILOS DINÂMICOS PARA ALERTAS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .alert {
        animation: slideIn 0.3s ease-out;
    }

    /* Estados de validação visuais */
    .form-control.valid {
        border-color: var(--success-500) !important;
    }

    .form-control.invalid {
        border-color: var(--error-500) !important;
    }

    /* Loading states */
    .btn.loading {
        position: relative;
        color: transparent;
    }

    .btn.loading::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);