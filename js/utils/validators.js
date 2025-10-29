// ===== SISTEMA DE VALIDAÇÃO AVANÇADA =====

const Validators = {
    // ===== VALIDAÇÕES BÁSICAS =====
    required(value, fieldName = 'Este campo') {
        if (!value || value.toString().trim() === '') {
            return ${fieldName} é obrigatório;
        }
        return null;
    },

    minLength(value, min, fieldName = 'Este campo') {
        if (value && value.length < min) {
            return ${fieldName} deve ter pelo menos ${min} caracteres;
        }
        return null;
    },

    maxLength(value, max, fieldName = 'Este campo') {
        if (value && value.length > max) {
            return ${fieldName} deve ter no máximo ${max} caracteres;
        }
        return null;
    },

    // ===== VALIDAÇÕES DE EMAIL =====
    email(value, fieldName = 'E-mail') {
        if (!value) return null;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return ${fieldName} deve ser um endereço de e-mail válido;
        }
        return null;
    },

    // ===== VALIDAÇÕES DE TELEFONE =====
    phone(value, fieldName = 'Telefone') {
        if (!value) return null;
        
        // Remove caracteres não numéricos
        const cleanValue = value.replace(/\D/g, '');
        
        // Verifica se tem 10 ou 11 dígitos (com DDD)
        if (cleanValue.length < 10 || cleanValue.length > 11) {
            return ${fieldName} deve conter 10 ou 11 dígitos;
        }
        
        return null;
    },

    // ===== VALIDAÇÕES DE CPF =====
    cpf(value, fieldName = 'CPF') {
        if (!value) return null;
        
        // Remove caracteres não numéricos
        const cleanValue = value.replace(/\D/g, '');
        
        // Verifica tamanho
        if (cleanValue.length !== 11) {
            return ${fieldName} deve conter 11 dígitos;
        }
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cleanValue)) {
            return ${fieldName} inválido;
        }
        
        // Validação dos dígitos verificadores
        let sum = 0;
        let remainder;
        
        // Primeiro dígito verificador
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cleanValue.substring(i - 1, i)) * (11 - i);
        }
        
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleanValue.substring(9, 10))) {
            return ${fieldName} inválido;
        }
        
        // Segundo dígito verificador
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cleanValue.substring(i - 1, i)) * (12 - i);
        }
        
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleanValue.substring(10, 11))) {
            return ${fieldName} inválido;
        }
        
        return null;
    },

    // ===== VALIDAÇÕES DE CEP =====
    cep(value, fieldName = 'CEP') {
        if (!value) return null;
        
        const cleanValue = value.replace(/\D/g, '');
        
        if (cleanValue.length !== 8) {
            return ${fieldName} deve conter 8 dígitos;
        }
        
        return null;
    },

    // ===== VALIDAÇÕES DE DATA =====
    date(value, fieldName = 'Data') {
        if (!value) return null;
        
        const date = new Date(value);
        const today = new Date();
        
        // Verifica se é uma data válida
        if (isNaN(date.getTime())) {
            return ${fieldName} inválida;
        }
        
        // Verifica se não é uma data futura (para data de nascimento)
        if (date > today) {
            return ${fieldName} não pode ser futura;
        }
        
        // Verifica se a pessoa tem pelo menos 16 anos
        const minAgeDate = new Date();
        minAgeDate.setFullYear(today.getFullYear() - 16);
        
        if (date > minAgeDate) {
            return 'É necessário ter pelo menos 16 anos';
        }
        
        return null;
    },

    // ===== VALIDAÇÕES DE SENHA =====
    password(value, fieldName = 'Senha') {
        if (!value) return null;
        
        const errors = [];
        
        if (value.length < 8) {
            errors.push('pelo menos 8 caracteres');
        }
        
        if (!/(?=.*[a-z])/.test(value)) {
            errors.push('uma letra minúscula');
        }
        
        if (!/(?=.*[A-Z])/.test(value)) {
            errors.push('uma letra maiúscula');
        }
        
        if (!/(?=.*\d)/.test(value)) {
            errors.push('um número');
        }
        
        if (!/(?=.[@$!%?&])/.test(value)) {
            errors.push('um caractere especial (@$!%*?&)');
        }
        
        if (errors.length > 0) {
            return A senha deve conter ${errors.join(', ')};
        }
        
        return null;
    },

    passwordMatch(value, confirmValue, fieldName = 'Senhas') {
        if (value !== confirmValue) {
            return ${fieldName} não coincidem;
        }
        return null;
    },

    // ===== VALIDAÇÕES PERSONALIZADAS =====
    url(value, fieldName = 'URL') {
        if (!value) return null;
        
        try {
            new URL(value);
            return null;
        } catch {
            return ${fieldName} deve ser uma URL válida;
        }
    },

    number(value, fieldName = 'Número') {
        if (!value) return null;
        
        if (isNaN(value) || value === '') {
            return ${fieldName} deve ser um número válido;
        }
        
        return null;
    },

    minValue(value, min, fieldName = 'Valor') {
        if (!value) return null;
        
        const numValue = parseFloat(value);
        if (numValue < min) {
            return ${fieldName} deve ser maior ou igual a ${min};
        }
        
        return null;
    },

    maxValue(value, max, fieldName = 'Valor') {
        if (!value) return null;
        
        const numValue = parseFloat(value);
        if (numValue > max) {
            return ${fieldName} deve ser menor ou igual a ${max};
        }
        
        return null;
    },

    // ===== VALIDAÇÕES DE FORMULÁRIOS ESPECÍFICOS =====
    volunteerForm(data) {
        const errors = {};
        
        // Nome
        errors.nome = this.required(data.nome, 'Nome completo') ||
                     this.minLength(data.nome, 3, 'Nome completo') ||
                     this.maxLength(data.nome, 100, 'Nome completo');
        
        // Email
        errors.email = this.required(data.email, 'E-mail') ||
                      this.email(data.email);
        
        // Telefone
        errors.telefone = this.required(data.telefone, 'Telefone') ||
                         this.phone(data.telefone);
        
        // CPF
        errors.cpf = this.required(data.cpf, 'CPF') ||
                    this.cpf(data.cpf);
        
        // Data de nascimento
        errors.nascimento = this.required(data.nascimento, 'Data de nascimento') ||
                           this.date(data.nascimento);
        
        // CEP
        errors.cep = this.required(data.cep, 'CEP') ||
                    this.cep(data.cep);
        
        // Endereço
        errors.endereco = this.required(data.endereco, 'Endereço') ||
                         this.minLength(data.endereco, 5, 'Endereço');
        
        // Cidade
        errors.cidade = this.required(data.cidade, 'Cidade');
        
        // Estado
        errors.estado = this.required(data.estado, 'Estado');
        
        // Tipo de ajuda
        errors.ajuda = this.required(data.ajuda, 'Tipo de ajuda');
        
        // Filtrar apenas erros (remover nulls)
        const finalErrors = {};
        Object.keys(errors).forEach(key => {
            if (errors[key]) {
                finalErrors[key] = errors[key];
            }
        });
        
        return Object.keys(finalErrors).length > 0 ? finalErrors : null;
    },

    donationForm(data) {
        const errors = {};
        
        // Valor
        errors.valor = this.required(data.valor, 'Valor da doação') ||
                      this.number(data.valor, 'Valor da doação') ||
                      this.minValue(data.valor, 5, 'Valor da doação');
        
        // Nome do doador
        errors.doador = this.required(data.doador, 'Nome do doador') ||
                       this.minLength(data.doador, 3, 'Nome do doador');
        
        // Email
        errors.email = this.required(data.email, 'E-mail') ||
                      this.email(data.email);
        
        // Filtrar apenas erros
        const finalErrors = {};
        Object.keys(errors).forEach(key => {
            if (errors[key]) {
                finalErrors[key] = errors[key];
            }
        });
        
        return Object.keys(finalErrors).length > 0 ? finalErrors : null;
    },

    // ===== VALIDAÇÃO EM TEMPO REAL =====
    setupRealTimeValidation(formElement) {
        const inputs = formElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Validar ao sair do campo
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            // Limpar erro ao digitar
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    },

    validateField(field) {
        const value = field.value;
        const fieldName = field.getAttribute('data-field-name') || 
                         field.previousElementSibling?.textContent || 
                         'Este campo';
        
        let error = null;
        
        // Aplicar validações baseadas no tipo do campo
        switch (field.type) {
            case 'email':
                error = this.email(value, fieldName);
                break;
            case 'tel':
                error = this.phone(value, fieldName);
                break;
            case 'date':
                error = this.date(value, fieldName);
                break;
            default:
                // Validações baseadas no nome/atributos
                if (field.name.includes('cpf') || field.id.includes('cpf')) {
                    error = this.cpf(value, fieldName);
                } else if (field.name.includes('cep') || field.id.includes('cep')) {
                    error = this.cep(value, fieldName);
                } else if (field.required) {
                    error = this.required(value, fieldName);
                }
        }
        
        // Validação de tamanho mínimo
        if (!error && field.minLength) {
            error = this.minLength(value, parseInt(field.minLength), fieldName);
        }
        
        // Validação de tamanho máximo
        if (!error && field.maxLength) {
            error = this.maxLength(value, parseInt(field.maxLength), fieldName);
        }
        
        // Mostrar/ocultar erro
        if (error) {
            this.showFieldError(field, error);
        } else {
            this.showFieldSuccess(field);
        }
        
        return !error;
    },

    // ===== MANIPULAÇÃO DE ERROS =====
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        field.classList.remove('success');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--error-500);
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        field.parentNode.appendChild(errorElement);
    },

    showFieldSuccess(field) {
        this.clearFieldError(field);
        
        field.classList.remove('error');
        field.classList.add('success');
        
        const successElement = document.createElement('div');
        successElement.className = 'field-success';
        successElement.textContent = '✓ Campo válido';
        successElement.style.cssText = `
            color: var(--success-500);
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        field.parentNode.appendChild(successElement);
    },

    clearFieldError(field) {
        field.classList.remove('error', 'success');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        const existingSuccess = field.parentNode.querySelector('.field-success');
        if (existingSuccess) {
            existingSuccess.remove();
        }
    },

    // ===== VALIDAÇÃO DE FORMULÁRIO COMPLETO =====
    validateForm(formElement) {
        const inputs = formElement.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    },

    // ===== UTILITÁRIOS =====
    formatCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },

    formatPhone(phone) {
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    },

    formatCEP(cep) {
        return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    },

    // ===== MÁSCARAS =====
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

// Exportar para uso global
window.Validators = Validators;