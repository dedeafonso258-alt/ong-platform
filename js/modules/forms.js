// ===== MÓDULO DE FORMULÁRIOS AVANÇADO =====

const Forms = {
    // ===== INICIALIZAÇÃO =====
    init() {
        console.log('📝 Módulo de formulários inicializado');
        this.setupFormEvents();
        this.setupRealTimeValidation();
        this.setupInputMasks();
        this.setupFormSubmissions();
    },

    // ===== CONFIGURAÇÃO DE EVENTOS =====
    setupFormEvents() {
        // Formulário de cadastro principal
        const mainForm = document.getElementById('formCadastro');
        if (mainForm) {
            mainForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }

        // Formulários dinâmicos
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeDynamicForms();
        });
    },

    // ===== VALIDAÇÃO EM TEMPO REAL =====
    setupRealTimeValidation() {
        document.addEventListener('blur', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.validateField(e.target);
            }
        }, true);

        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.clearFieldStatus(e.target);
            }
        }, true);
    },

    // ===== MÁSCARAS DE INPUT =====
    setupInputMasks() {
        // Aplicar máscaras dinamicamente
        document.addEventListener('DOMContentLoaded', () => {
            this.applyInputMasks();
        });

        // Re-aplicar máscaras quando conteúdo for carregado dinamicamente
        document.addEventListener('pageLoaded', () => {
            setTimeout(() => {
                this.applyInputMasks();
            }, 100);
        });
    },

    applyInputMasks() {
        // CPF
        const cpfFields = document.querySelectorAll('input[name="cpf"], input[id="cpf"]');
        cpfFields.forEach(field => {
            Validators.applyMask(field, 'cpf');
        });

        // Telefone
        const phoneFields = document.querySelectorAll('input[type="tel"], input[name="telefone"], input[id="telefone"]');
        phoneFields.forEach(field => {
            Validators.applyMask(field, 'phone');
        });

        // CEP
        const cepFields = document.querySelectorAll('input[name="cep"], input[id="cep"]');
        cepFields.forEach(field => {
            Validators.applyMask(field, 'cep');
            // Buscar endereço automaticamente
            field.addEventListener('blur', (e) => {
                if (e.target.value.replace(/\D/g, '').length === 8) {
                    this.searchAddressByCEP(e.target.value);
                }
            });
        });
    },

    // ===== SUBMISSÃO DE FORMULÁRIOS =====
    setupFormSubmissions() {
        // Interceptar todos os formulários
        document.addEventListener('submit', (e) => {
            const form = e.target;
            
            if (form.classList.contains('ajax-form') || form.hasAttribute('data-ajax')) {
                e.preventDefault();
                this.handleAjaxFormSubmit(form);
            }
        });
    },

    // ===== MANIPULAÇÃO DE SUBMISSÃO =====
    handleFormSubmit(e) {
        e.preventDefault();
        console.log('📨 Submetendo formulário...');

        const form = e.target;
        const formData = this.collectFormData(form);

        // Validação do formulário
        if (!this.validateForm(form)) {
            this.showFormMessage('Por favor, corrija os erros destacados no formulário.', 'error');
            return;
        }

        // Mostrar loading
        this.showFormLoading(form);

        // Simular processamento
        setTimeout(() => {
            this.processFormSubmission(form, formData);
        }, 1500);
    },

    handleAjaxFormSubmit(form) {
        const formData = this.collectFormData(form);

        if (!this.validateForm(form)) {
            return;
        }

        this.showFormLoading(form);

        // Simular requisição AJAX
        fetch(form.action || '#', {
            method: form.method || 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            this.handleFormSuccess(form, data);
        })
        .catch(error => {
            this.handleFormError(form, error);
        });
    },

    // ===== PROCESSAMENTO DE DADOS =====
    collectFormData(form) {
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Se já existe, transforma em array
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }

        return data;
    },

    processFormSubmission(form, formData) {
        console.log('📊 Processando dados do formulário:', formData);

        // Determinar tipo de formulário
        const formType = this.getFormType(form);
        
        try {
            let result;

            switch (formType) {
                case 'volunteer':
                    result = this.processVolunteerForm(formData);
                    break;
                case 'donation':
                    result = this.processDonationForm(formData);
                    break;
                case 'contact':
                    result = this.processContactForm(formData);
                    break;
                default:
                    result = this.processGenericForm(formData);
            }

            this.handleFormSuccess(form, result);
        } catch (error) {
            this.handleFormError(form, error);
        }
    },

    // ===== PROCESSADORES ESPECÍFICOS =====
    processVolunteerForm(data) {
        // Validação específica do voluntário
        const validationErrors = Validators.volunteerForm(data);
        if (validationErrors) {
            throw new Error('Dados de voluntário inválidos: ' + JSON.stringify(validationErrors));
        }

        // Preparar dados do voluntário
        const volunteerData = {
            name: data.nome,
            email: data.email,
            phone: data.telefone,
            cpf: data.cpf.replace(/\D/g, ''),
            birthDate: data.nascimento,
            address: {
                cep: data.cep,
                street: data.endereco,
                city: data.cidade,
                state: data.estado,
                neighborhood: data.bairro
            },
            helpType: data.ajuda,
            skills: data.areas || [],
            availability: {
                days: data.disponibilidade || [],
                period: data.periodo || ''
            },
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Salvar no storage
        const savedVolunteer = Storage.volunteers.save(volunteerData);

        return {
            success: true,
            message: 'Cadastro realizado com sucesso! Entraremos em contato em breve.',
            data: savedVolunteer
        };
    },

    processDonationForm(data) {
        const validationErrors = Validators.donationForm(data);
        if (validationErrors) {
            throw new Error('Dados de doação inválidos: ' + JSON.stringify(validationErrors));
        }

        const donationData = {
            donorName: data.doador,
            email: data.email,
            amount: parseFloat(data.valor),
            paymentMethod: data.pagamento || 'pix',
            status: 'pending',
            date: new Date().toISOString()
        };

        const savedDonation = Storage.donations.save(donationData);

        return {
            success: true,
            message: 'Doação registrada com sucesso! Em breve enviaremos as instruções de pagamento.',
            data: savedDonation
        };
    },

    processContactForm(data) {
        // Simular envio de email/contato
        return {
            success: true,
            message: 'Mensagem enviada com sucesso! Retornaremos em breve.',
            data: data
        };
    },

    processGenericForm(data) {
        // Processamento genérico para outros formulários
        return {
            success: true,
            message: 'Formulário enviado com sucesso!',
            data: data
        };
    },

    // ===== MANIPULAÇÃO DE RESPOSTAS =====
    handleFormSuccess(form, result) {
        this.hideFormLoading(form);
        
        if (result.success) {
            this.showFormMessage(result.message, 'success');
            this.resetForm(form);
            
            // Disparar evento personalizado
            this.dispatchFormEvent('formSuccess', { form, data: result.data });
            
            // Redirecionar se necessário
            if (form.hasAttribute('data-redirect')) {
                setTimeout(() => {
                    window.location.href = form.getAttribute('data-redirect');
                }, 2000);
            }
        } else {
            this.showFormMessage(result.message || 'Erro ao processar formulário.', 'error');
        }
    },

    handleFormError(form, error) {
        console.error('❌ Erro no formulário:', error);
        this.hideFormLoading(form);
        
        this.showFormMessage(
            error.message || 'Ocorreu um erro ao processar o formulário. Tente novamente.', 
            'error'
        );

        this.dispatchFormEvent('formError', { form, error });
    },

    // ===== VALIDAÇÃO =====
    validateForm(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    },

    validateField(field) {
        return Validators.validateField(field);
    },

    clearFieldStatus(field) {
        Validators.clearFieldError(field);
    },

    // ===== BUSCA DE CEP =====
    async searchAddressByCEP(cep) {
        const cleanCEP = cep.replace(/\D/g, '');
        
        if (cleanCEP.length !== 8) return;

        try {
            this.showCEPLoading();
            
            // Simular API ViaCEP
            const response = await fetch(https://viacep.com.br/ws/${cleanCEP}/json/);
            const data = await response.json();

            if (!data.erro) {
                this.fillAddressFields(data);
            } else {
                this.showFormMessage('CEP não encontrado.', 'error');
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            this.showFormMessage('Erro ao buscar endereço. Preencha manualmente.', 'error');
        } finally {
            this.hideCEPLoading();
        }
    },

    fillAddressFields(addressData) {
        const addressFields = {
            'endereco': addressData.logradouro,
            'bairro': addressData.bairro,
            'cidade': addressData.localidade,
            'estado': addressData.uf
        };

        Object.keys(addressFields).forEach(fieldName => {
            const field = document.querySelector([name="${fieldName}"], #${fieldName});
            if (field && !field.value) {
                field.value = addressFields[fieldName];
            }
        });
    },

    // ===== UTILITÁRIOS DE UI =====
    showFormLoading(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="spinner-small"></div> Enviando...';
            submitButton.classList.add('loading');
        }

        form.classList.add('form-loading');
    },

    hideFormLoading(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = submitButton.getAttribute('data-original-text') || 'Enviar';
            submitButton.classList.remove('loading');
        }

        form.classList.remove('form-loading');
    },

    showCEPLoading() {
        // Implementar loading específico para CEP se necessário
    },

    hideCEPLoading() {
        // Implementar fim do loading do CEP
    },

    showFormMessage(message, type = 'info') {
        if (window.ONGApp && window.ONGApp.showNotification) {
            ONGApp.showNotification(message, type);
        } else {
            // Fallback básico
            alert(message);
        }
    },

    resetForm(form) {
        form.reset();
        
        // Limpar estados de validação
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            this.clearFieldStatus(input);
            input.classList.remove('valid', 'error');
        });
    },

    // ===== EVENTOS PERSONALIZADOS =====
    dispatchFormEvent(eventName, detail) {
        const event = new CustomEvent(form:${eventName}, { detail });
        document.dispatchEvent(event);
    },

    // ===== INICIALIZAÇÃO DE FORMULÁRIOS DINÂMICOS =====
    initializeDynamicForms() {
        const dynamicForms = document.querySelectorAll('form[data-dynamic]');
        dynamicForms.forEach(form => {
            this.setupDynamicForm(form);
        });
    },

    setupDynamicForm(form) {
        // Configurar formulários que são carregados dinamicamente
        form.addEventListener('submit', this.handleFormSubmit.bind(this));
        this.setupRealTimeValidationForForm(form);
    },

    setupRealTimeValidationForForm(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldStatus(input));
        });
    },

    // ===== IDENTIFICAÇÃO DE TIPOS DE FORMULÁRIO =====
    getFormType(form) {
        if (form.id === 'formCadastro') return 'volunteer';
        if (form.id.includes('donation')) return 'donation';
        if (form.id.includes('contact')) return 'contact';
        if (form.hasAttribute('data-form-type')) {
            return form.getAttribute('data-form-type');
        }
        return 'generic';
    }
};

// ===== INICIALIZAÇÃO AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', function() {
    Forms.init();
});

// Exportar para uso global
window.Forms = Forms;