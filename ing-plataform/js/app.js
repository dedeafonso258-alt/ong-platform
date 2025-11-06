// ===== APP PRINCIPAL =====
class ONGApp {
    static init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupLazyLoading();
        this.setupPerformance();
    }

    static setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.setAttribute('aria-expanded', !isExpanded);
            });
        }

        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navMenu.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    static setupSmoothScroll() {
        // Scroll suave para links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    static setupLazyLoading() {
        // Lazy loading para imagens
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    static setupPerformance() {
        // Preload de recursos críticos
        this.preloadCriticalResources();
        
        // Monitoramento de performance
        this.monitorPerformance();
    }

    static preloadCriticalResources() {
        // Preload de fonts e CSS crítico
        const criticalResources = [
            '/css/style.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }

    static monitorPerformance() {
        // Monitorar Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log('LCP:', entry.startTime);
                    }
                }
            });

            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }
}

// ===== INICIALIZAÇÃO DA APLICAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar app principal
    ONGApp.init();

    // Adicionar classe loaded para transições
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Log para debug
    console.log('🚀 ONG Platform carregada com sucesso!');
});

// ===== TRATAMENTO DE ERROS GLOBAL =====
window.addEventListener('error', function(e) {
    console.error('Erro global:', e.error);
});

// ===== OFFLINE SUPPORT =====
window.addEventListener('online', function() {
    document.body.classList.remove('offline');
    this.showNotification('Conexão restaurada', 'success');
});

window.addEventListener('offline', function() {
    document.body.classList.add('offline');
    this.showNotification('Você está offline', 'warning');
});

// ===== NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    // Implementação básica de notificações
    const notification = document.createElement('div');
    notification.className = notification notification-${type};
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}
