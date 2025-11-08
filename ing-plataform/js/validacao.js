// ===== MÁSCARAS DE INPUT =====
class InputMasks {
    static cpf(input) {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }

    static telefone(input) {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length === 11) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            } else if (value.length === 10) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }

    static cep(input) {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 8) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            
            e.target.value = value;
            
            // Buscar endereço automaticamente quando CEP estiver completo
            if (value.length === 9) {
                InputMasks.buscarEndereco(value);
            }
        });
    }

    static async buscarEndereco(cep) {
        const cepLimpo = cep.replace(/\D/g, '');
        
        if (cepLimpo.length !== 8) return;
        
        try {
            const response = await fetch(https://viacep.com.br/ws/${cepLimpo}/json/);
            const data = await response.json();
            
            if (!data.erro) {
                document.getElementById('endereco').value = data.logradouro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        }
    }
}

// ===== VALIDAÇÕES =====
class FormValidator {
    static validations = {
        nomeCompleto: {
            validate: (value) => value.length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(value),
            message: 'Nome deve ter pelo menos 2 caracteres e conter apenas letras'
        },
        
        email: {
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Digite um e-mail válido'
        },
        
        cpf: {
            validate: (value) => {
                const cpf = value.replace(/\D/g, '');
                if (cpf.length !== 11) return false;
                
                // Validação de CPF
                if (/^(\d)\1+$/.test(cpf)) return false;
                
                let soma = 0;
                for (let i = 0; i < 9; i++) {
                    soma += parseInt(cpf.charAt(i)) * (10 - i);
                }
                
                let resto = soma % 11;
                let digito1 = resto < 2 ? 0 : 11 - resto;
                
                if (digito1 !== parseInt(cpf.charAt(9))) return false;
                
                soma = 0;
                for (let i = 0; i < 10; i++) {
                    soma += parseInt(cpf.charAt(i)) * (11 - i);
                }
                
                resto = soma % 11;
                let digito2 = resto < 2 ? 0 : 11 - resto;
                
                return digito2 === parseInt(cpf.charAt(10));
            },
            message: 'CPF inválido'
        },
        
        telefone: {
            validate: (value) => {
                const telefone = value.replace(/\D/g, '');
                return telefone.length === 10 || telefone.length === 11;
            },
            message: 'Telefone deve ter 10 ou 11 dígitos'
        },
        
        dataNascimento: {
            validate: (value) => {
                const data = new Date(value);
                const hoje = new Date();
                const idade = hoje.getFullYear() - data.getFullYear();
                return idade >= 16 && idade <= 100;
            },
            message: 'Você deve ter entre 16 e 100 anos'
        },
        
        cep: {
            validate: (value) => value.replace(/\D/g, '').length === 8,
            message: 'CEP deve ter 8 dígitos'
        },
        
        endereco: {
            validate: (value) => value.length >= 5,
            message: 'Endereço deve ter pelo menos 5 caracteres'
        },
        
        cidade: {
            validate: (value) => value.length >= 2,
            message: 'Cidade deve ter pelo menos 2 caracteres'
        },
        
        estado: {
            validate: (value) => value.length === 2,
            message: 'Selecione um estado'
        }
    };

    static validateField(field) {
        const fieldName = field.name || field.id;
        const validation = this.validations[fieldName];
        
        if (!validation) return true;
        
        const isValid = validation.validate(field.value);
        this.showValidation(field, isValid, validation.message);
        
        return isValid;
    }

    static showValidation(field, isValid, message) {
        const errorElement = document.getElementById(${field.name || field.id}-error);
        
        if (errorElement) {
            if (!isValid && field.value) {
                errorElement.textContent = message;
                field.setAttribute('aria-invalid', 'true');
                field.classList.add('error');
            } else {
                errorElement.textContent = '';
                field.setAttribute('aria-invalid', 'false');
                field.classList.remove('error');
            }
        }
    }

    static validateAll(form) {
        const fields = form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        fields.forEach(field => {
            if (field.hasAttribute('required') || field.value) {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
}

// ===== GERENCIAMENTO DE FORMULÁRIO =====
class FormManager {
    static init() {
        this.setupMasks();
        this.setupValidation();
        this.setupParticipacaoToggle();
        this.setupFormSubmission();
    }

    static setupMasks() {
        const cpfInput = document.getElementById('cpf');
        const telefoneInput = document.getElementById('telefone');
        const cepInput = document.getElementById('cep');

        if (cpfInput) InputMasks.cpf(cpfInput);
        if (telefoneInput) InputMasks.telefone(telefoneInput);
        if (cepInput) InputMasks.cep(cepInput);
    }

    static setupValidation() {
        const form = document.getElementById('cadastroForm');
        if (!form) return;

        // Validação em tempo real
        form.addEventListener('input', (e) => {
            if (e.target.matches('input, select, textarea')) {
                FormValidator.validateField(e.target);
            }
        });

        // Validação no blur
        form.addEventListener('focusout', (e) => {
            if (e.target.matches('input, select, textarea')) {
                FormValidator.validateField(e.target);
            }
        });
    }

    static setupParticipacaoToggle() {
        const participacaoRadios = document.querySelectorAll('input[name="tipoParticipacao"]');
        const areasInteresseFieldset = document.getElementById('areas-interesse-fieldset');

        participacaoRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (areasInteresseFieldset) {
                    if (e.target.value === 'voluntario' || e.target.value === 'ambos') {
                        areasInteresseFieldset.hidden = false;
                        areasInteresseFieldset.setAttribute('aria-hidden', 'false');
                    } else {
                        areasInteresseFieldset.hidden = true;
                        areasInteresseFieldset.setAttribute('aria-hidden', 'true');
                    }
                }
            });
        });
    }

    static setupFormSubmission() {
        const form = document.getElementById('cadastroForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (FormValidator.validateAll(form)) {
                this.handleSuccess();
            } else {
                this.showFirstError();
            }
        });
    }

    static handleSuccess() {
        const form = document.getElementById('cadastroForm');
        const successMessage = document.getElementById('success-message');
        
        if (form && successMessage) {
            form.style.display = 'none';
            successMessage.hidden = false;
            successMessage.focus();
            
            // Rolagem suave para a mensagem de sucesso
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Salvar no localStorage (simulação)
            this.saveToLocalStorage();
        }
    }

    static saveToLocalStorage() {
        const form = document.getElementById('cadastroForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Salvar dados no localStorage
        const cadastros = JSON.parse(localStorage.getItem('ongCadastros') || '[]');
        cadastros.push({
            ...data,
            dataCadastro: new Date().toISOString(),
            id: Date.now()
        });
        
        localStorage.setItem('ongCadastros', JSON.stringify(cadastros));
    }

    static showFirstError() {
        const firstError = document.querySelector('.error-message:not(:empty)');
        if (firstError) {
            const field = document.getElementById(firstError.id.replace('-error', ''));
            if (field) {
                field.focus();
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
}

// ===== ACESSIBILIDADE =====
class Acessibilidade {
    static init() {
        this.setupSkipLink();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupHighContrast();
    }

    static setupSkipLink() {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    target.removeAttribute('tabindex');
                }
            });
        }
    }

    static setupKeyboardNavigation() {
        // Navegação por teclado no menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
        });

        // Trap focus em modais
        this.setupFocusTrap();
    }

    static setupFocusManagement() {
        // Gerencia foco para leitores de tela
        const liveRegions = document.querySelectorAll('[aria-live]');
        liveRegions.forEach(region => {
            region.setAttribute('aria-atomic', 'true');
        });
    }

    static setupHighContrast() {
        // Botão para alto contraste (pode ser adicionado posteriormente)
        const highContrastBtn = document.createElement('button');
        highContrastBtn.textContent = 'Alto Contraste';
        highContrastBtn.className = 'btn btn-outline';
        highContrastBtn.style.marginLeft = '10px';
        highContrastBtn.addEventListener('click', this.toggleHighContrast);
        
        const nav = document.querySelector('.nav-container');
        if (nav) {
            nav.appendChild(highContrastBtn);
        }
    }

    static toggleHighContrast() {
        document.body.classList.toggle('high-contrast');
    }

    static closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('[aria-expanded="true"]');
        dropdowns.forEach(dropdown => {
            dropdown.setAttribute('aria-expanded', 'false');
        });
    }

    static setupFocusTrap() {
        // Implementar trap focus para modais se necessário
    }
}

// ===== SPA (SINGLE PAGE APPLICATION) BÁSICO =====
class SPAManager {
    static init() {
        this.setupNavigation();
        this.loadInitialPage();
    }

    static setupNavigation() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            }
        });
    }

    static scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Foco no conteúdo para acessibilidade
            section.setAttribute('tabindex', '-1');
            section.focus();
            section.removeAttribute('tabindex');
        }
    }

    static loadInitialPage() {
        // Carregar conteúdo inicial se necessário
        this.updateActiveNavLink();
    }

    static updateActiveNavLink() {
        const currentPage = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (currentPage.includes(linkPage) || (currentPage.endsWith('/') && linkPage === 'index.html')) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('ONG Platform - Inicializando...');
    
    // Inicializar todos os módulos
    FormManager.init();
    Acessibilidade.init();
    SPAManager.init();
    
    // Menu mobile - CÓDIGO CORRIGIDO AQUI!
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.setAttribute('aria-expanded', !isExpanded);
        });
    }
    
    // Fechar menu ao clicar fora - CÓDIGO CORRIGIDO AQUI!
    document.addEventListener('click', function(e) {
        if (menuToggle && navMenu && !e.target.closest('.nav-container')) {
            menuToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-expanded', 'false');
        }
    });
});

// ===== FUNÇÕES GLOBAIS =====
function closeSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.hidden = true;
        
        // Voltar para o formulário
        const form = document.getElementById('cadastroForm');
        if (form) {
            form.style.display = 'block';
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Suporte para navegadores antigos
if (typeof NodeList.prototype.forEach !== 'function') {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = function(entries) {
        return Array.from(entries).reduce((obj, [key, val]) => {
            obj[key] = val;
            return obj;
        }, {});
    };
}
