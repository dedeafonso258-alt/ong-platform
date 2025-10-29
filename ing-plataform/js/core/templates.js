// ===== SISTEMA DE TEMPLATES DINÂMICOS =====

const Templates = {
    // ===== TEMPLATES DE PROJETOS =====
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

    projectDetails(project) {
        return `
            <div class="project-details-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${this.escapeHtml(project.title)}</h2>
                        <button class="modal-close" onclick="ONGApp.closeModal()">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="grid-2">
                            <div>
                                <h3>📋 Descrição</h3>
                                <p>${this.escapeHtml(project.description)}</p>
                                
                                <h3>🎯 Metas</h3>
                                <ul>
                                    <li>Pessoas impactadas: ${project.goal}</li>
                                    <li>Progresso atual: ${project.progress}%</li>
                                    <li>Voluntários ativos: ${project.volunteers}</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3>📊 Estatísticas</h3>
                                <div class="stats-grid">
                                    <div class="stat-card">
                                        <span class="stat-number">${project.progress}%</span>
                                        <span class="stat-label">Concluído</span>
                                    </div>
                                    <div class="stat-card">
                                        <span class="stat-number">${project.volunteers}</span>
                                        <span class="stat-label">Voluntários</span>
                                    </div>
                                </div>
                                
                                <h3>🕐 Horários</h3>
                                <p>${this.getScheduleInfo(project.category)}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="ONGApp.closeModal()">Fechar</button>
                        <button class="btn btn-primary" onclick="ONGApp.joinProject(${project.id})">
                            Quero Participar
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // ===== TEMPLATES DE VOLUNTÁRIOS =====
    volunteerCard(volunteer) {
        return `
            <div class="card volunteer-card">
                <div class="card-body">
                    <div class="flex align-center gap-3">
                        <div class="volunteer-avatar">
                            ${this.getInitials(volunteer.name)}
                        </div>
                        <div>
                            <h4>${this.escapeHtml(volunteer.name)}</h4>
                            <p class="text-muted">${volunteer.email}</p>
                            <div class="tags">
                                ${volunteer.skills.map(skill => 
                                    <span class="tag tag-sm">${this.getSkillName(skill)}</span>
                                ).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // ===== TEMPLATES DE FORMULÁRIOS =====
    formField(config) {
        const { id, label, type, required, placeholder, value } = config;
        return `
            <div class="form-group">
                <label for="${id}" class="form-label ${required ? 'required' : ''}">
                    ${label}
                </label>
                <input 
                    type="${type}" 
                    id="${id}" 
                    name="${id}" 
                    class="form-control"
                    ${required ? 'required' : ''}
                    ${placeholder ? placeholder="${placeholder}" : ''}
                    ${value ? value="${value}" : ''}
                >
                <div class="form-feedback" id="${id}-feedback"></div>
            </div>
        `;
    },

    selectField(config) {
        const { id, label, required, options, value } = config;
        return `
            <div class="form-group">
                <label for="${id}" class="form-label ${required ? 'required' : ''}">
                    ${label}
                </label>
                <select id="${id}" name="${id}" class="form-control" ${required ? 'required' : ''}>
                    <option value="">Selecione...</option>
                    ${options.map(option => 
                        `<option value="${option.value}" ${value === option.value ? 'selected' : ''}>
                            ${option.label}
                        </option>`
                    ).join('')}
                </select>
                <div class="form-feedback" id="${id}-feedback"></div>
            </div>
        `;
    },

    // ===== TEMPLATES DE NOTIFICAÇÕES =====
    notification(message, type = 'info') {
        return `
            <div class="notification notification-${type}">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${this.escapeHtml(message)}</span>
                <button class="notification-close" onclick="this.parentElement.remove()">
                    &times;
                </button>
            </div>
        `;
    },

    // ===== TEMPLATES DE CARREGAMENTO =====
    loadingSpinner(text = 'Carregando...') {
        return `
            <div class="loading-container">
                <div class="spinner"></div>
                <p>${text}</p>
            </div>
        `;
    },

    // ===== UTILITÁRIOS =====
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
            meio-ambiente: '🌱',
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
            meio-ambiente: 'Meio Ambiente',
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
    },

    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    },

    getSkillName(skill) {
        const skills = {
            educacao: 'Ensino',
            cozinha: 'Culinária',
            saude: 'Saúde',
            construcao: 'Construção',
            dirigir: 'Motorista',
            organizacao: 'Organização'
        };
        return skills[skill] || skill;
    },

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || 'ℹ';
    }
};

// ===== SISTEMA DE RENDERIZAÇÃO DINÂMICA =====
Templates.render = {
    projectsList(projects, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (projects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhum projeto encontrado</h3>
                    <p>Não há projetos cadastrados no momento.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = projects.map(project => 
            Templates.projectCard(project)
        ).join('');
    },

    volunteersList(volunteers, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (volunteers.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhum voluntário cadastrado</h3>
                    <p>Não há voluntários cadastrados no momento.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = volunteers.map(volunteer =>
            Templates.volunteerCard(volunteer)
        ).join('');
    },

    modal(content) {
        // Remover modal existente
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) existingModal.remove();
        
        // Criar novo modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = content;
        
        document.body.appendChild(modal);
        
        // Fechar modal ao clicar fora
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
};

// Exportar para uso global
window.Templates = Templates;