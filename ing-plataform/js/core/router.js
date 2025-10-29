// ===== SISTEMA DE ROTAS SPA (SINGLE PAGE APPLICATION) =====

const Router = {
    currentPage: '',
    routes: {},
    pageContainers: {},

    // ===== INICIALIZAÇÃO DO ROUTER =====
    init() {
        console.log('📍 Router SPA inicializado');
        
        // Mapear containers de página
        this.pageContainers = {
            'home': document.getElementById('home-page'),
            'projects': document.getElementById('projects-page'),
            'cadastro': document.getElementById('cadastro-page'),
            'about': document.getElementById('about-page')
        };

        // Configurar rotas
        this.setupRoutes();
        
        // Configurar navegação
        this.setupNavigation();
        
        // Configurar botões de voltar/avancar
        window.addEventListener('popstate', (event) => {
            this.handlePopState(event);
        });

        // Carregar página inicial
        this.navigateTo(this.getCurrentRoute());
    },

    // ===== CONFIGURAÇÃO DE ROTAS =====
    setupRoutes() {
        this.routes = {
            '/': {
                id: 'home',
                title: 'ONG Solidária - Página Inicial',
                template: 'home',
                load: this.loadHomePage.bind(this)
            },
            '/projetos': {
                id: 'projects', 
                title: 'ONG Solidária - Nossos Projetos',
                template: 'projects',
                load: this.loadProjectsPage.bind(this)
            },
            '/cadastro': {
                id: 'cadastro',
                title: 'ONG Solidária - Cadastre-se',
                template: 'cadastro', 
                load: this.loadCadastroPage.bind(this)
            },
            '/sobre': {
                id: 'about',
                title: 'ONG Solidária - Sobre Nós',
                template: 'about',
                load: this.loadAboutPage.bind(this)
            }
        };
    },

    // ===== CONFIGURAÇÃO DE NAVEGAÇÃO =====
    setupNavigation() {
        // Interceptar clicks em links
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[data-route]');
            if (link) {
                event.preventDefault();
                const route = link.getAttribute('data-route');
                this.navigateTo(route);
            }
        });

        // Configurar links do menu principal
        const menuLinks = document.querySelectorAll('a[href]');
        menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('/') && this.routes[href]) {
                link.setAttribute('data-route', href);
            }
        });
    },

    // ===== NAVEGAÇÃO PRINCIPAL =====
    navigateTo(route) {
        console.log(🔄 Navegando para: ${route});
        
        // Validar rota
        if (!this.routes[route]) {
            console.warn(Rota não encontrada: ${route});
            route = '/';
        }

        // Atualizar estado do navegador
        if (route !== this.getCurrentRoute()) {
            window.history.pushState({ route }, '', route);
        }

        // Carregar página
        this.loadPage(route);
    },

    // ===== CARREGAMENTO DE PÁGINA =====
    async loadPage(route) {
        const pageConfig = this.routes[route];
        
        if (!pageConfig) {
            console.error(Configuração não encontrada para rota: ${route});
            return;
        }

        // Mostrar loading
        this.showLoading();

        try {
            // Atualizar título da página
            document.title = pageConfig.title;

            // Esconder todas as páginas
            this.hideAllPages();

            // Carregar conteúdo da página
            await pageConfig.load();

            // Atualizar estado atual
            this.currentPage = pageConfig.id;

            // Atualizar navegação ativa
            this.updateActiveNavigation(pageConfig.id);

            // Disparar evento de página carregada
            this.dispatchPageLoadedEvent(pageConfig.id);

        } catch (error) {
            console.error('Erro ao carregar página:', error);
            this.showErrorPage();
        } finally {
            // Esconder loading
            this.hideLoading();
        }
    },

    // ===== CARREGADORES DE PÁGINA =====
    async loadHomePage() {
        const container = this.pageContainers.home;
        if (!container) {
            await this.loadPageContent('home', container);
            return;
        }

        container.style.display = 'block';
        container.innerHTML = this.generateHomeContent();
        
        // Inicializar componentes da home
        this.initHomeComponents();
    },

    async loadProjectsPage() {
        const container = this.pageContainers.projects;
        if (!container) {
            await this.loadPageContent('projects', container);
            return;
        }

        container.style.display = 'block';
        container.innerHTML = this.generateProjectsContent();
        
        // Inicializar componentes de projetos
        this.initProjectsComponents();
    },

    async loadCadastroPage() {
        const container = this.pageContainers.cadastro;
        if (!container) {
            await this.loadPageContent('cadastro', container);
            return;
        }

        container.style.display = 'block';
        container.innerHTML = this.generateCadastroContent();
        
        // Inicializar componentes do formulário
        this.initCadastroComponents();
    },

    async loadAboutPage() {
        const container = this.pageContainers.about;
        if (!container) {
            await this.loadPageContent('about', container);
            return;
        }

        container.style.display = 'block';
        container.innerHTML = this.generateAboutContent();
    },

    // ===== GERADORES DE CONTEÚDO DINÂMICO =====
    generateHomeContent() {
        const projects = Storage.projects.getAll().slice(0, 2);
        
        return `
            <section class="hero">
                <div class="container">
                    <div class="grid">
                        <div class="col-span-12 text-center">
                            <h1>Transformando vidas através da solidariedade</h1>
                            <p class="lead">Há mais de 10 anos atuando em comunidades carentes</p>
                            <button class="btn btn-secondary btn-lg" data-route="/projetos">
                                Conheça nossos projetos
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="sobre container">
                <div class="grid-12">
                    <div class="col-span-12 text-center">
                        <h2>Sobre Nossa Organização</h2>
                        <p class="lead">Trabalhamos por um mundo mais justo e solidário</p>
                    </div>
                </div>

                <div class="grid-3">
                    ${projects.map(project => 
                        Templates.projectCard(project)
                    ).join('')}
                </div>
            </section>

            <section class="stats-section">
                <div class="container">
                    <div class="grid-4">
                        <div class="stat-item">
                            <div class="stat-number">${projects.length}</div>
                            <div class="stat-label">Projetos Ativos</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${this.getTotalVolunteers()}</div>
                            <div class="stat-label">Voluntários</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${this.getTotalImpact()}</div>
                            <div class="stat-label">Pessoas Impactadas</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">R$ ${this.getTotalDonations()}</div>
                            <div class="stat-label">Arrecadados</div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    generateProjectsContent() {
        const projects = Storage.projects.getAll();
        
        return `
            <section class="intro-projetos container">
                <div class="grid-12">
                    <div class="col-span-12 text-center">
                        <h1>Nossos Projetos Sociais</h1>
                        <p class="lead">Conheça nossas iniciativas e descubra como você pode fazer a diferença</p>
                    </div>
                </div>
            </section>

            <section class="projetos-lista container">
                <div class="projects-filter">
                    <button class="btn btn-outline active" data-filter="all">Todos</button>
                    <button class="btn btn-outline" data-filter="educacao">Educação</button>
                    <button class="btn btn-outline" data-filter="alimentacao">Alimentação</button>
                    <button class="btn btn-outline" data-filter="saude">Saúde</button>
                </div>

                <div class="grid-2" id="projects-container">
                    ${Templates.render.projectsList(projects, 'projects-container')}
                </div>
            </section>
        `;
    },

    generateCadastroContent() {
        return `
            <section class="form-cadastro container">
                <div class="form-container">
                    <div class="form-header">
                        <h1>Cadastre-se</h1>
                        <p>Preencha o formulário abaixo para se tornar um voluntário ou doador</p>
                    </div>

                    <form id="formCadastro" novalidate>
                        <!-- O formulário será carregado dinamicamente -->
                        <div id="form-content">
                            ${Templates.loadingSpinner('Carregando formulário...')}
                        </div>
                    </form>
                </div>
            </section>
        `;
    },

    generateAboutContent() {
        return `
            <section class="about-page container">
                <div class="grid-12">
                    <div class="col-span-12 text-center">
                        <h1>Sobre a ONG Solidária</h1>
                        <p class="lead">Conheça nossa história, missão e valores</p>
                    </div>
                </div>

                <div class="grid-2">
                    <div>
                        <h2>Nossa História</h2>
                        <p>Fundada em 2010, a ONG Solidária nasceu do sonho de transformar realidades através da educação e da solidariedade.</p>
                    </div>
                    <div>
                        <h2>Nossa Equipe</h2>
                        <p>Contamos com uma equipe de profissionais dedicados e voluntários comprometidos com a causa social.</p>
                    </div>
                </div>
            </section>
        `;
    },

    // ===== INICIALIZADORES DE COMPONENTES =====
    initHomeComponents() {
        // Configurar botões na home
        const buttons = document.querySelectorAll('button[data-route]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const route = button.getAttribute('data-route');
                this.navigateTo(route);
            });
        });
    },

    initProjectsComponents() {
        // Configurar filtros de projetos
        const filterButtons = document.querySelectorAll('.projects-filter button');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterProjects(filter);
                
                // Atualizar estado dos botões
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    },

    initCadastroComponents() {
        // Carregar formulário dinamicamente
        setTimeout(() => {
            this.loadFormContent();
        }, 500);
    },

    // ===== UTILITÁRIOS =====
    getCurrentRoute() {
        return window.location.pathname || '/';
    },

    handlePopState(event) {
        const route = event.state?.route || '/';
        this.loadPage(route);
    },

    hideAllPages() {
        Object.values(this.pageContainers).forEach(container => {
            if (container) container.style.display = 'none';
        });
    },

    updateActiveNavigation(pageId) {
        // Atualizar links do menu
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-route') === /${pageId}) {
                link.classList.add('active');
            }
        });
    },

    showLoading() {
        // Implementar loading global se necessário
    },

    hideLoading() {
        // Implementar esconder loading
    },

    showErrorPage() {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div class="error-page">
                    <h2>Erro ao carregar página</h2>
                    <p>Desculpe, ocorreu um erro ao carregar a página solicitada.</p>
                    <button class="btn btn-primary" data-route="/">Voltar para Home</button>
                </div>
            `;
        }
    },

    dispatchPageLoadedEvent(pageId) {
        window.dispatchEvent(new CustomEvent('pageLoaded', {
            detail: { pageId }
        }));
    },

    // ===== ESTATÍSTICAS =====
    getTotalVolunteers() {
        return Storage.volunteers.getAll().length;
    },

    getTotalImpact() {
        const projects = Storage.projects.getAll();
        return projects.reduce((total, project) => total + project.goal, 0);
    },

    getTotalDonations() {
        const donations = Storage.donations.getAll();
        return donations.reduce((total, donation) => total + (donation.amount || 0), 0);
    },

    // ===== FILTROS =====
    filterProjects(category) {
        const projects = Storage.projects.getAll();
        const filteredProjects = category === 'all' 
            ? projects 
            : projects.filter(project => project.category === category);
        
        const container = document.getElementById('projects-container');
        if (container) {
            Templates.render.projectsList(filteredProjects, 'projects-container');
        }
    },

    // ===== CARREGAMENTO DINÂMICO DE FORMULÁRIO =====
    loadFormContent() {
        const formContent = document.getElementById('form-content');
        if (!formContent) return;

        formContent.innerHTML = `
            ${Templates.formField({
                id: 'nome',
                label: 'Nome Completo',
                type: 'text',
                required: true,
                placeholder: 'Digite seu nome completo'
            })}
            
            ${Templates.formField({
                id: 'email',
                label: 'E-mail',
                type: 'email', 
                required: true,
                placeholder: 'seu@email.com'
            })}
            
            ${Templates.selectField({
                id: 'tipo',
                label: 'Como deseja ajudar?',
                required: true,
                options: [
                    { value: 'voluntario', label: 'Voluntário' },
                    { value: 'doador', label: 'Doador' },
                    { value: 'ambos', label: 'Voluntário e Doador' }
                ]
            })}
            
            <button type="submit" class="btn-submit">
                📨 Enviar Cadastro
            </button>
        `;

        // Re-inicializar validações do formulário
        if (window.Forms) {
            Forms.init();
        }
    }
};

// ===== CARREGAMENTO DE CONTEÚDO EXTERNO =====
Router.loadPageContent = async function(pageName, container) {
    try {
        // Simular carregamento de conteúdo externo
        const response = await fetch(/pages/${pageName}.html);
        if (response.ok) {
            const content = await response.text();
            if (container) {
                container.innerHTML = content;
            }
        } else {
            throw new Error('Página não encontrada');
        }
    } catch (error) {
        console.error(Erro ao carregar página ${pageName}:, error);
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h3>Erro ao carregar conteúdo</h3>
                    <p>A página solicitada não pôde ser carregada.</p>
                </div>
            `;
        }
    }
};

// Exportar para uso global
window.Router = Router;