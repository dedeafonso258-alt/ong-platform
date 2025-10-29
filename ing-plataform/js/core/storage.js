// ===== SISTEMA DE ARMAZENAMENTO (localStorage) =====

const Storage = {
    // ===== PROJETOS =====
    projects: {
        getAll() {
            return JSON.parse(localStorage.getItem('projects')) || [];
        },
        
        saveAll(projects) {
            localStorage.setItem('projects', JSON.stringify(projects));
        },
        
        getById(id) {
            const projects = this.getAll();
            return projects.find(project => project.id === parseInt(id));
        },
        
        save(project) {
            const projects = this.getAll();
            const existingIndex = projects.findIndex(p => p.id === project.id);
            
            if (existingIndex >= 0) {
                projects[existingIndex] = project;
            } else {
                // Gerar novo ID
                project.id = this.generateId(projects);
                projects.push(project);
            }
            
            this.saveAll(projects);
            return project;
        },
        
        delete(id) {
            const projects = this.getAll();
            const filteredProjects = projects.filter(project => project.id !== parseInt(id));
            this.saveAll(filteredProjects);
        },
        
        generateId(projects) {
            return projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
        }
    },

    // ===== VOLUNTÁRIOS =====
    volunteers: {
        getAll() {
            return JSON.parse(localStorage.getItem('volunteers')) || [];
        },
        
        saveAll(volunteers) {
            localStorage.setItem('volunteers', JSON.stringify(volunteers));
        },
        
        save(volunteer) {
            const volunteers = this.getAll();
            volunteer.id = this.generateId(volunteers);
            volunteer.createdAt = new Date().toISOString();
            volunteers.push(volunteer);
            this.saveAll(volunteers);
            return volunteer;
        },
        
        generateId(volunteers) {
            return volunteers.length > 0 ? Math.max(...volunteers.map(v => v.id)) + 1 : 1;
        }
    },

    // ===== DOAÇÕES =====
    donations: {
        getAll() {
            return JSON.parse(localStorage.getItem('donations')) || [];
        },
        
        saveAll(donations) {
            localStorage.setItem('donations', JSON.stringify(donations));
        },
        
        save(donation) {
            const donations = this.getAll();
            donation.id = this.generateId(donations);
            donation.date = new Date().toISOString();
            donation.status = 'pending';
            donations.push(donation);
            this.saveAll(donations);
            return donation;
        },
        
        generateId(donations) {
            return donations.length > 0 ? Math.max(...donations.map(d => d.id)) + 1 : 1;
        }
    },

    // ===== CONFIGURAÇÕES =====
    settings: {
        get() {
            return JSON.parse(localStorage.getItem('app_settings')) || {
                theme: 'light',
                language: 'pt-BR',
                notifications: true
            };
        },
        
        save(settings) {
            localStorage.setItem('app_settings', JSON.stringify(settings));
        }
    },

    // ===== UTILITÁRIOS =====
    clearAll() {
        localStorage.removeItem('projects');
        localStorage.removeItem('volunteers');
        localStorage.removeItem('donations');
        localStorage.removeItem('app_settings');
    },

    exportData() {
        return {
            projects: this.projects.getAll(),
            volunteers: this.volunteers.getAll(),
            donations: this.donations.getAll(),
            settings: this.settings.get(),
            exportDate: new Date().toISOString()
        };
    },

    importData(data) {
        if (data.projects) this.projects.saveAll(data.projects);
        if (data.volunteers) this.volunteers.saveAll(data.volunteers);
        if (data.donations) this.donations.saveAll(data.donations);
        if (data.settings) this.settings.save(data.settings);
    }
};

// ===== INICIALIZAR DADOS MOCK =====
function initializeMockData() {
    if (!localStorage.getItem('data_initialized')) {
        const mockProjects = [
            {
                id: 1,
                title: "Educação para Todos",
                description: "Reforço escolar e atividades extracurriculares para crianças e adolescentes em situação de vulnerabilidade.",
                category: "educacao",
                volunteers: 15,
                goal: 200,
                progress: 75,
                status: "active",
                image: "educacao.jpg",
                created: "2024-01-15"
            },
            {
                id: 2,
                title: "Alimentação Solidária",
                description: "Distribuição de cestas básicas e refeições para famílias em situação de vulnerabilidade alimentar.",
                category: "alimentacao",
                volunteers: 8,
                goal: 500,
                progress: 45,
                status: "active", 
                image: "alimentacao.jpg",
                created: "2024-02-01"
            }
        ];

        const mockVolunteers = [
            {
                id: 1,
                name: "Maria Silva",
                email: "maria@email.com",
                phone: "(11) 99999-9999",
                skills: ["educacao", "cozinha"],
                availability: ["sabado", "domingo"],
                status: "active"
            }
        ];

        Storage.projects.saveAll(mockProjects);
        Storage.volunteers.saveAll(mockVolunteers);
        localStorage.setItem('data_initialized', 'true');
    }
}

// Inicializar dados mock quando o módulo for carregado
initializeMockData();

// Exportar para uso global
window.Storage = Storage;