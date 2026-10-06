// Fichier : js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');

    // Ajout d'un paramètre de cache-busting (?v=) pour forcer le navigateur à lire le nouveau JSON
    fetch('./data/content.json?v=' + new Date().getTime())
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            buildPortfolio(data, appContainer);
            // Initialisation de l'observateur une fois le DOM généré
            setupIntersectionObserver();
        })
        .catch(error => {
            console.error('Erreur de chargement:', error);
            appContainer.innerHTML = '<p style="color:red;">Erreur de chargement des données système.</p>';
        });
});

function sanitizeHTML(str) {
    if (!str) return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

function buildPortfolio(data, container) {
    // Déstructuration mise à jour pour extraire 'formations'
    const { personnel, experiences, formations, competences } = data;
    const nameParts = personnel.identite.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    let html = `
        <section id="accueil" class="hero-section">
            <div class="hero-content">
                <div class="availability-badge" style="color: var(--primary-blue);">• ${sanitizeHTML(personnel.statut)}</div>
                
                <h1 class="hero-title">
                    <span class="text-white">${sanitizeHTML(firstName)}</span><br>
                    <span class="text-accent-blue">${sanitizeHTML(lastName)}</span>
                </h1>
                
                <div class="hero-code-comments">
                    <p>// Étudiant ${sanitizeHTML(personnel.etablissement)} - Campus Paris</p>
                    <p>// Filière ${sanitizeHTML(personnel.formation)}</p>
                </div>
                
                <p class="hero-description">
                    Passionné par l'administration système et la cybersécurité, je construis mes compétences en cours, sur des projets d'infrastructure personnels et en environnement de production. Actuellement en <strong>alternance chez Thales</strong>, j'applique mon expertise technique sur le Maintien en Condition Opérationnelle de systèmes critiques.
                </p>
                
                <div class="hero-actions">
                    <a href="#experiences" class="btn btn-primary">→ Expériences</a>
                    <a href="#competences" class="btn btn-secondary"># Compétences</a>
                    <a href="assets/cv-louis-holler-thales.pdf" target="_blank" rel="noopener noreferrer" class="btn btn-accent">📄 Télécharger mon CV</a>
                </div>
            </div>
            
            <div class="hero-visual">
                <div class="profile-card">
                    <div class="profile-avatar">
                        <span class="terminal-icon">$_</span>
                    </div>
                    <h3>${sanitizeHTML(personnel.identite)}</h3>
                    <p class="profile-tags">Hardening • SysAdmin • Infrastructure • Sécurité</p>
                    
                    <div class="profile-stats">
                        <div class="stat-row">
                            <span class="stat-label">Niveau</span>
                            <span class="stat-value">Bachelor 3</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Technologies</span>
                            <span class="stat-value">Linux, Windows, Ansible</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Localisation</span>
                            <span class="stat-value">Île-de-France</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;

    // Génération de la section Parcours (Timeline Académique incluant l'ambition Master)
    if (formations && formations.length > 0) {
        html += `
            <section id="parcours" class="content-section">
                <div class="section-header">
                    <h2 class="section-title">Parcours</h2>
                    <p style="color: var(--text-muted); margin-top: 0.5rem;">Mon parcours académique et universitaire.</p>
                </div>
                
                <div class="timeline-category">
                    <h3 class="timeline-category-title">Formation</h3>
                    <div class="timeline-wrapper">
        `;

        formations.forEach(form => {
            const statusColor = form.statut === 'Ambition' ? 'var(--primary-blue)' : 'var(--status-green)';
            
            html += `
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <span class="timeline-date">${sanitizeHTML(form.periode)}</span>
                            <h4 class="timeline-item-title">${sanitizeHTML(form.titre)}</h4>
                            <span class="timeline-item-subtitle" style="color: ${statusColor};">${sanitizeHTML(form.statut)}</span>
                            <p class="timeline-item-desc">${sanitizeHTML(form.description)}</p>
                        </div>
            `;
        });

        html += `
                    </div>
                </div>
            </section>
        `;
    }

    // Génération de la section Expériences (Timeline Professionnelle refondue)
    if (experiences && experiences.length > 0) {
        html += `
            <section id="experiences" class="content-section" style="padding-top: 2rem; border-top: none;">
                <div class="timeline-category">
                    <h3 class="timeline-category-title">Expériences clés</h3>
                    <div class="timeline-wrapper">
        `;

        experiences.forEach(exp => {
            const descriptionConcat = exp.missions.join(' ');
            
            html += `
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <span class="timeline-date">${sanitizeHTML(exp.periode)}</span>
                            <h4 class="timeline-item-title">${sanitizeHTML(exp.type)} — ${sanitizeHTML(exp.entreprise)}</h4>
                            <span class="timeline-item-subtitle">${sanitizeHTML(exp.role)}</span>
                            <p class="timeline-item-desc" style="margin-bottom: 1rem;">${sanitizeHTML(descriptionConcat)}</p>
                            
                            <div class="tag-container">
                                ${exp.technologies.map(tech => `<span class="tag-cyber">${sanitizeHTML(tech)}</span>`).join('')}
                            </div>
                        </div>
            `;
        });

        html += `
                    </div>
                </div>
            </section>
        `;
    }

    // Génération de la section Compétences
    if (competences) {
        html += `
            <section id="competences" class="content-section">
                <div class="section-header">
                    <span class="section-subtitle">— Arsenal</span>
                    <h2 class="section-title">Compétences</h2>
                    <p style="color: var(--text-muted); margin-top: 0.5rem;">Langages, outils et domaines maîtrisés.</p>
                </div>
                <div class="grid">
        `;

        for (const [category, skills] of Object.entries(competences)) {
            const formatCategory = category.replace('_', ' ').toUpperCase();
            
            html += `
                <div class="cyber-card modern-skill-card">
                    <h4 class="skill-category">
                        <span class="category-icon"></span>
                        ${sanitizeHTML(formatCategory)}
                    </h4>
                    <ul class="modern-skill-list">
            `;

            skills.forEach(skill => {
                // Extraction directe des valeurs depuis le nouvel objet JSON
                const skillName = skill.nom;
                const skillPct = skill.niveau; 
                
                html += `
                        <li class="skill-item">
                            <div class="skill-info">
                                <span class="skill-name">${sanitizeHTML(skillName)}</span>
                                <span class="skill-pct">${sanitizeHTML(String(skillPct))}%</span>
                            </div>
                            <div class="progress-track">
                                <div class="progress-fill" style="width: ${sanitizeHTML(String(skillPct))}%;"></div>
                            </div>
                        </li>
                `;
            });

            html += `
                    </ul>
                </div>
            `;
        }

        html += `
                </div>
            </section>
        `;
    }

    // Génération de la section Contact et du Footer
    if (data.contact) {
        const { contact } = data;
        
        html += `
            <section id="contact" class="content-section contact-section">
                <span class="section-subtitle text-center">— Contact</span>
                <h2 class="section-title text-center">Intéressé par mon profil ?</h2>
                
                <p class="contact-description text-center">
                    Actuellement en alternance chez Thales. Disponible pour échanger sur mes missions en cybersécurité ou mes projets d'infrastructure technique à partir de la rentrée 2027.
                </p>
                
                <div class="contact-actions text-center">
                    <a href="mailto:${sanitizeHTML(contact.email)}" class="btn btn-gradient">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        Me contacter
                    </a>
                    <a href="https://github.com/${sanitizeHTML(personnel.github_username)}" target="_blank" rel="noopener noreferrer" class="btn btn-dark">GitHub</a>
                    <a href="tel:${sanitizeHTML(contact.telephone).replace(/\s/g, '')}" class="btn btn-dark">Téléphone</a>
                </div>
            </section>
            
            <footer class="cyber-footer">
                <p>© ${new Date().getFullYear()} ${sanitizeHTML(personnel.identite)} — Portfolio Cybersécurité</p>
            </footer>
        `;
    }

    container.innerHTML = html;
}

// Fonction de gestion du ScrollSpy via IntersectionObserver
function setupIntersectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}