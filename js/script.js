// ===== ARQUIVO PRINCIPAL - ONG Platform =====
// Terceira Entrega - JavaScript Avançado

// ===== INICIALIZAÇÃO DA APLICAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ONG Platform - Aplicação inicializada');
    
    // Inicializar sistemas principais
    initializeStorage();
    initializeTemplates();
    initializeRouter();
    initializeValidators();
    initializeForms();
    
    // Inicializar módulos
    initSPA();
    initFormsModule();
    initProjectsModule();
    initVolunteersModule();
    initDonationsModule();
    
    // Carregar dados iniciais
    loadInitialData();
    
    console.log('✅ Todos os módulos foram inicializados');
});

// ===== SISTEMA DE ARMAZENAMENTO =====
function initializeStorage() {
    if (typeof Storage === 'undefined') {
        console.error('LocalStorage não suportado');
        return;
    }
    console.log('💾 Sistema de storage inicializado');
}

// ===== SISTEMA DE TEMPLATES =====
function initializeTemplates() {
    window.Templates = {
        projectCard(project) {
            return `
                <article class="card card-project" data-project-id="${project.id}">
                    <div class="card-header">
                        <div class="flex justify-between align-center">
                            <h3 class="card-title">${this.escapeHtml(project.title)}</h3>
                            <span class="badge ${project.status === 'active' ? 'badge-primary' : 'badge-secondary'}">
                                ${project.status === 'active' ? 'Ativo' : 'Inativo'}
                            </span>
                        </div>
                        <div class="tags">
                            <span class="tag">${this.getCategoryIcon(project.category)} ${this.getCategoryName(project.category)}</span>
                            <span class="tag">👥 ${project.volunteers} voluntários</span>
                        </div>
                    </div>
                    
                    <div class="card-body">
                        <p>${this.escapeHtml(project.description)}</p>
                        
                        <div style="margin: 1.5rem 0;">
                            <div class="progress-bar">
                                <div style="width: ${project.progress}%; background: ${this.getProgressColor(project.progress)};"></div>
                            </div>
                            <div class="flex justify-between">
                                <small>${project.progress}% alcançado</small>
                                <small>Meta: ${project.goal} pessoas</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-footer">
                        <div class="flex justify-between align-center">
                            <span style="font-weight: 600; color: var(--primary-600);">
                                🗓 ${this.getScheduleInfo(project.category)}
                            </span>
                            <div class="flex gap-2">
                                <button class="btn btn-outline btn-sm" onclick="ONGApp.showProjectDetails(${project.id})">
                                    Detalhes
                                </button>
                                <button class="btn btn-primary btn-sm" onclick="ONGApp.joinProject(${project.id})">
                                    Participar
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        },

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        getCategoryIcon(category) {
            const icons = {
                educacao: '📚',
                alimentacao: '🍲',
                saude: '🏥',
                moradia: '🏠',
                'meio-ambiente': '🌱',
                cultura: '🎭'
            };
            return icons[category] || '📋';
        },

        getCategoryName(category) {
            const names = {
                educacao: 'Educação',
                alimentacao: 'Alimentação',
                saude: 'Saúde',
                moradia: 'Moradia',
                'meio-ambiente': 'Meio Ambiente',
                cultura: 'Cultura'
            };
            return names[category] || 'Geral';
        },

        getProgressColor(progress) {
            if (progress >= 75) return 'var(--success-500)';
            if (progress >= 50) return 'var(--warning-500)';
            return 'var(--error-500)';
        },

        getScheduleInfo(category) {
            const schedules = {
                educacao: 'Segunda a Sexta, 14h-17h',
                alimentacao: 'Sábados, 8h-12h',
                saude: 'Terça e Quinta, 9h-16h',
                moradia: 'Sábado, 7h-13h',
                'meio-ambiente': 'Domingo, 7h-11h',
                cultura: 'Quarta e Sexta, 15h-18h'
            };
            return schedules[category] || 'A combinar';
        }
    };
    console.log('🎨 Sistema de templates inicializado');
}

// ===== SISTEMA DE ROTAS SPA =====
function initializeRouter() {
    window.Router = {
        currentPage: '',
        
        navigateTo(route) {
            console.log(📍 Navegando para: ${route});
            this.hideAllPages();
            this.showPage(route);
            this.updateActiveNav(route);
            this.updateBrowserHistory(route);
        },

        hideAllPages() {
            const pages = document.querySelectorAll('[data-page]');
            pages.forEach(page => {
                page.style.display = 'none';
            });
        },

        showPage(route) {
            const page = document.querySelector([data-page="${route}"]);
            if (page) {
                page.style.display = 'block';
                this.currentPage = route;
                
                // Disparar evento de página carregada
                window.dispatchEvent(new CustomEvent('pageLoaded', {
                    detail: { page: route }
                }));
            }
        },

        updateActiveNav(route) {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === route || 
                    link.getAttribute('data-route') === route) {
                    link.classList.add('active');
                }
            });
        },

        updateBrowserHistory(route) {
            if (route !== window.location.pathname) {
                window.history.pushState({ route }, '', route);
            }
        }
    };

    // Configurar navegação SPA
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[data-route]');
        if (link) {
            e.preventDefault();
            const route = link.getAttribute('data-route');
            Router.navigateTo(route);
        }
    });

    // Configurar botões de voltar/avançar
    window.addEventListener('popstate', function(e) {
        const route = e.state?.route || '/';
        Router.navigateTo(route);
    });

    console.log('🔄 Sistema de rotas SPA inicializado');
}

// ===== SISTEMA DE VALIDAÇÃO =====
function initializeValidators() {
    window.Validators = {
        required(value, fieldName = 'Este campo') {
            if (!value || value.toString().trim() === '') {
                return ${fieldName} é obrigatório;
            }
            return null;
        },

        email(value, fieldName = 'E-mail') {
            if (!value) return null;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return ${fieldName} deve ser válido;
            }
            return null;
        },

        phone(value, fieldName = 'Telefone') {
            if (!value) return null;
            const cleanValue = value.replace(/\D/g, '');
            if (cleanValue.length < 10 || cleanValue.length > 11) {
                return ${fieldName} deve ter 10 ou 11 dígitos;
            }
            return null;
        },

        cpf(value, fieldName = 'CPF') {
            if (!value) return null;
            const cleanValue = value.replace(/\D/g, '');
            if (cleanValue.length !== 11) {
                return ${fieldName} deve ter 11 dígitos;
            }
            return null;
        },

        cep(value, fieldName = 'CEP') {
            if (!value) return null;
            const cleanValue = value.replace(/\D/g, '');
            if (cleanValue.length !== 8) {
                return ${fieldName} deve ter 8 dígitos;
            }
            return null;
        },

        validateField(field) {
            const value = field.value;
            const fieldName = field.getAttribute('data-field-name') || field.name;
            
            let error = null;
            
            // Validações baseadas no tipo
            if (field.required) {
                error = this.required(value, fieldName);
            }
            
            if (!error && field.type === 'email') {
                error = this.email(value, fieldName);
            }
            
            if (!error && (field.type === 'tel' || field.name.includes('telefone'))) {
                error = this.phone(value, fieldName);
            }
            
            if (!error && field.name.includes('cpf')) {
                error = this.cpf(value, fieldName);
            }
            
            if (!error && field.name.includes('cep')) {
                error = this.cep(value, fieldName);
            }
            
            // Aplicar resultado
            if (error) {
                this.showFieldError(field, error);
                return false;
            } else {
                this.showFieldSuccess(field);
                return true;
            }
        },

        showFieldError(field, message) {
            this.clearFieldStatus(field);
            field.classList.add('error');
            field.classList.remove('success');
            
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.style.cssText = `
                color: var(--error-500);
                font-size: 0.875rem;
                margin-top: 0.25rem;
            `;
            
            field.parentNode.appendChild(errorElement);
        },

        showFieldSuccess(field) {
            this.clearFieldStatus(field);
            field.classList.remove('error');
            field.classList.add('success');
            
            const successElement = document.createElement('div');
            successElement.className = 'field-success';
            successElement.textContent = '✓ Válido';
            successElement.style.cssText = `
                color: var(--success-500);
                font-size: 0.875rem;
                margin-top: 0.25rem;
            `;
            
            field.parentNode.appendChild(successElement);
        },

        clearFieldStatus(field) {
            field.classList.remove('error', 'success');
            const existingError = field.parentNode.querySelector('.field-error');
            const existingSuccess = field.parentNode.querySelector('.field-success');
            if (existingError) existingError.remove();
            if (existingSuccess) existingSuccess.remove();
        },

        applyMask(field, maskType) {
            field.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                switch (maskType) {
                    case 'cpf':
                        if (value.length <= 11) {
                            value = value.replace(/(\d{3})(\d)/, '$1.$2');
                            value = value.replace(/(\d{3})(\d)/, '$1.$2');
                            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                        }
                        break;
                    case 'phone':
                        if (value.length <= 11) {
                            value = value.replace(/(\d{2})(\d)/, '($1) $2');
                            value = value.replace(/(\d{5})(\d)/, '$1-$2');
                        }
                        break;
                    case 'cep':
                        if (value.length <= 8) {
                            value = value.replace(/(\d{5})(\d)/, '$1-$2');
                        }
                        break;
                }
                
                e.target.value = value;
            });
        }
    };
    console.log('✅ Sistema de validação inicializado');
}

// ===== SISTEMA DE FORMULÁRIOS =====
function initializeForms() {
    window.Forms = {
        init() {
            this.setupFormEvents();
            this.setupRealTimeValidation();
            this.setupInputMasks();
            console.log('📝 Sistema de formulários inicializado');
        },

        setupFormEvents() {
            const mainForm = document.getElementById('formCadastro');
            if (mainForm) {
                mainForm.addEventListener('submit', this.handleFormSubmit.bind(this));
            }
        },

        setupRealTimeValidation() {
            document.addEventListener('blur', (e) => {
                if (e.target.matches('input, select, textarea')) {
                    Validators.validateField(e.target);
                }
            }, true);

            document.addEventListener('input', (e) => {
                if (e.target.matches('input, select, textarea')) {
                    Validators.clearFieldStatus(e.target);
                }
            }, true);
        },

        setupInputMasks() {
            // CPF
            const cpfFields = document.querySelectorAll('input[name="cpf"], input[id="cpf"]');
            cpfFields.forEach(field => {
                Validators.applyMask(field, 'cpf');
            });

            // Telefone
            const phoneFields = document.querySelectorAll('input[type="tel"], input[name="telefone"]');
            phoneFields.forEach(field => {
                Validators.applyMask(field, 'phone');
            });

            // CEP
            const cepFields = document.querySelectorAll('input[name="cep"], input[id="cep"]');
            cepFields.forEach(field => {
                Validators.applyMask(field, 'cep');
            });
        },

        handleFormSubmit(e) {
            e.preventDefault();
            console.log('📨 Processando formulário...');

            const form = e.target;
            const formData = this.collectFormData(form);

            // Validar formulário
            if (!this.validateForm(form)) {
                this.showMessage('Por favor, corrija os erros no formulário.', 'error');
                return;
            }

            // Processar dados
            this.showLoading(form);
            
            setTimeout(() => {
                this.processFormData(formData);
                this.showMessage('Cadastro realizado com sucesso!', 'success');
                this.hideLoading(form);
                form.reset();
                
                // Limpar estados de validação
                const inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    Validators.clearFieldStatus(input);
                    input.classList.remove('valid', 'error');
                });
            }, 2000);
        },

        collectFormData(form) {
            const formData = new FormData(form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            return data;
        },

        validateForm(form) {
            const inputs = form.querySelectorAll('input, select, textarea');
            let isValid = true;

            inputs.forEach(input => {
                if (!Validators.validateField(input)) {
                    isValid = false;
                }
            });

            return isValid;
        },

        processFormData(formData) {
            console.log('📊 Dados do formulário:', formData);
            
            // Simular salvamento no localStorage
            const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
            const newVolunteer = {
                id: volunteers.length + 1,
                ...formData,
                registrationDate: new Date().toISOString(),
                status: 'pending'
            };
            
            volunteers.push(newVolunteer);
            localStorage.setItem('volunteers', JSON.stringify(volunteers));
            
            console.log('✅ Voluntário salvo:', newVolunteer);
        },

        showLoading(form) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<div class="spinner"></div> Enviando...';
            }
        },

        hideLoading(form) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Cadastro';
            }
        },

        showMessage(message, type = 'info') {
            const messageDiv = document.createElement('div');
            messageDiv.className = form-message form-message-${type};
            messageDiv.textContent = message;
            messageDiv.style.cssText = `
                padding: 1rem;
                margin: 1rem 0;
                border-radius: 8px;
                background: ${type === 'success' ? 'var(--success-500)' : 'var(--error-500)'};
                color: white;
                text-align: center;
            `;
            
            const form = document.getElementById('formCadastro');
            if (form) {
                form.prepend(messageDiv);
                
                // Auto-remover após 5 segundos
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 5000);
            }
        }
    };
}

// ===== INICIALIZAÇÃO DOS MÓDULOS =====
function initSPA() {
    console.log('📍 SPA inicializado');
    // Navegação inicial
    const currentPath = window.location.pathname;
    const route = currentPath === '/' ? '/home' : currentPath;
    Router.navigateTo(route);
}

function initFormsModule() {
    if (window.Forms) {
        Forms.init();
    }
    console.log('📝 Módulo de formulários inicializado');
}

function initProjectsModule() {
    console.log('📋 Módulo de projetos inicializado');
    // Inicializar dados de exemplo
    initializeProjectsData();
}

function initVolunteersModule() {
    console.log('👥 Módulo de voluntários inicializado');
    // Inicializar dados de exemplo
    initializeVolunteersData();
}

function initDonationsModule() {
    console.log('💰 Módulo de doações inicializado');
    // Inicializar dados de exemplo
    initializeDonationsData();
}

// ===== DADOS INICIAIS =====
function loadInitialData() {
    console.log('📦 Carregando dados iniciais...');
    initializeProjectsData();
    initializeVolunteersData();
    initializeDonationsData();
}

function initializeProjectsData() {
    if (!localStorage.getItem('projects')) {
        const projects = [
            {
                id: 1,
                title: "Educação para Todos",
                description: "Reforço escolar e atividades extracurriculares para crianças e adolescentes em situação de vulnerabilidade.",
                category: "educacao",
                volunteers: 15,
                goal: 200,
                progress: 75,
                status: "active"
            },
            {
                id: 2,
                title: "Alimentação Solidária",
                description: "Distribuição de cestas básicas e refeições para famílias em situação de vulnerabilidade alimentar.",
                category: "alimentacao",
                volunteers: 8,
                goal: 500,
                progress: 45,
                status: "active"
            }
        ];
        localStorage.setItem('projects', JSON.stringify(projects));
        console.log('📚 Dados de projetos inicializados');
    }
}

function initializeVolunteersData() {
    if (!localStorage.getItem('volunteers')) {
        const volunteers = [
            {
                id: 1,
                nome: "Maria Silva",
                email: "maria@email.com",
                telefone: "(11) 99999-9999",
                cpf: "123.456.789-00",
                ajuda: "voluntario",
                status: "active",
                registrationDate: new Date().toISOString()
            }
        ];
        localStorage.setItem('volunteers', JSON.stringify(volunteers));
        console.log('👤 Dados de voluntários inicializados');
    }
}

function initializeDonationsData() {
    if (!localStorage.getItem('donations')) {
        const donations = [
            {
                id: 1,
                doador: "João Santos",
                email: "joao@email.com",
                valor: 100,
                data: new Date().toISOString(),
                status: "completed"
            }
        ];
        localStorage.setItem('donations', JSON.stringify(donations));
        console.log('💰 Dados de doações inicializados');
    }
}

// ===== APLICAÇÃO PRINCIPAL =====
window.ONGApp = {
    // Navegação
    navigateTo(route) {
        if (window.Router) {
            Router.navigateTo(route);
        }
    },

    // Notificações
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = notification notification-${type};
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-500)' : 
                         type === 'error' ? 'var(--error-500)' : 'var(--info-500)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    },

    // Projetos
    showProjectDetails(projectId) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const project = projects.find(p => p.id === projectId);
        
        if (project && window.Templates) {
            const modalContent = `
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>${project.title}</h2>
                            <button class="modal-close" onclick="ONGApp.closeModal()">&times;</button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Descrição:</strong> ${project.description}</p>
                            <p><strong>Categoria:</strong> ${Templates.getCategoryName(project.category)}</p>
                            <p><strong>Voluntários:</strong> ${project.volunteers}</p>
                            <p><strong>Progresso:</strong> ${project.progress}% de ${project.goal} pessoas</p>
                            <p><strong>Horários:</strong> ${Templates.getScheduleInfo(project.category)}</p>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-outline" onclick="ONGApp.closeModal()">Fechar</button>
                            <button class="btn btn-primary" onclick="ONGApp.joinProject(${project.id})">Participar</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalContent);
        }
    },

    joinProject(projectId) {
        this.showNotification('Redirecionando para cadastro...', 'info');
        setTimeout(() => {
            this.navigateTo('/cadastro');
        }, 1500);
    },

    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) modal.remove();
    },

    // Utilitários
    getProjects() {
        return JSON.parse(localStorage.getItem('projects') || '[]');
    },

    getVolunteers() {
        return JSON.parse(localStorage.getItem('volunteers') || '[]');
    },

    getDonations() {
        return JSON.parse(localStorage.getItem('donations') || '[]');
    }
};

// ===== ESTILOS DINÂMICOS =====
const dynamicStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        display: inline-block;
        margin-right: 8px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .form-control.error {
        border-color: var(--error-500) !important;
    }

    .form-control.success {
        border-color: var(--success-500) !important;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }

    .modal-header {
        display: flex;
        justify-content: between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }

    .modal-footer {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1.5rem;
    }
`;

// Adicionar estilos dinâmicos
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

console.log('🎨 Estilos dinâmicos carregados');