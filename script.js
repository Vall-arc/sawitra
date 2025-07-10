document.addEventListener('DOMContentLoaded', function() {

    AOS.init({
        duration: 800,
        once: true
    });

    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split("/").pop();
            link.classList.remove('active');

            if (currentPage === linkPage) {
                link.classList.add('active');
            }
        });
    };
    setActiveNavLink();

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
    }

    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        const toggleBackToTop = () => {
            if (window.scrollY > 100) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        };
        window.addEventListener('scroll', toggleBackToTop);
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const filterContainer = document.querySelector('.py-5 .row .text-center.mb-5');
    if (filterContainer) {
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        const itemsToFilter = document.querySelectorAll('.product-item, .article-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.textContent.trim();
                itemsToFilter.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterValue === 'Semua' || itemCategory === filterValue) {
                        item.classList.remove('item-hidden');
                        item.classList.remove('aos-animate');
                        setTimeout(() => { item.classList.add('aos-animate'); }, 50);
                    } else {
                        item.classList.add('item-hidden');
                    }
                });
            });
        });
    }

    const contactForm = document.querySelector('form');
    if (contactForm && window.location.pathname.includes('kontak.html')) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Mengirim...`;
            setTimeout(() => {
                submitButton.innerHTML = `Pesan Terkirim!`;
                submitButton.classList.remove('btn-warning');
                submitButton.classList.add('btn-success');
                setTimeout(() => {
                    contactForm.reset();
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                    submitButton.classList.remove('btn-success');
                    submitButton.classList.add('btn-warning');
                }, 3000);
            }, 2000);
        });
    }

    if (window.location.pathname.includes('forum.html')) {
        const submitTopicBtn = document.getElementById('submitTopicBtn');
        const forumList = document.getElementById('forumList');
        const newTopicModal = new bootstrap.Modal(document.getElementById('newTopicModal'));
        const searchInput = document.getElementById('searchInput');

        const getBadgeInfo = (categoryValue) => {
            switch (categoryValue) {
                case '1': return { text: 'Pemupukan', class: 'text-bg-primary' };
                case '2': return { text: 'Hama & Penyakit', class: 'text-bg-danger' };
                case '3': return { text: 'Teknologi', class: 'text-bg-success' };
                case '4': return { text: 'Panen & Pasca-Panen', class: 'text-bg-warning' };
                case '5': return { text: 'Lain-lain', class: 'text-bg-secondary' };
                default: return { text: 'Umum', class: 'text-bg-dark' };
            }
        };

        submitTopicBtn.addEventListener('click', () => {
            const form = document.getElementById('newTopicForm');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const title = document.getElementById('topicTitle').value.trim();
            const categoryValue = document.getElementById('topicCategory').value;
            const badgeInfo = getBadgeInfo(categoryValue);
            const newTimestamp = new Date().toISOString();
            const newThreadHTML = `
                <div class="card forum-thread-card p-3 mb-3" data-aos="fade-up">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="flex-grow-1">
                            <h5 class="mb-1"><a href="#">${title}</a></h5>
                            <div class="thread-meta">
                                <span class="me-3"><i class="bi bi-person-fill me-1"></i>Anda</span>
                                <span class="me-3 thread-time" data-timestamp="${newTimestamp}"><i class="bi bi-clock me-1"></i>baru saja</span>
                                <span class="badge ${badgeInfo.class}">${badgeInfo.text}</span>
                            </div>
                        </div>
                        <div class="thread-stats d-none d-md-block">
                            <div class="stat-number">0</div>
                            <div>Balasan</div>
                        </div>
                    </div>
                </div>`;
            forumList.insertAdjacentHTML('afterbegin', newThreadHTML);
            form.reset();
            newTopicModal.hide();
            AOS.refresh();
        });

        const timeAgo = (date) => {
            const seconds = Math.floor((new Date() - new Date(date)) / 1000);
            let interval = seconds / 31536000;
            if (interval > 1) return Math.floor(interval) + " tahun yang lalu";
            interval = seconds / 2592000;
            if (interval > 1) return Math.floor(interval) + " bulan yang lalu";
            interval = seconds / 86400;
            if (interval > 1) return Math.floor(interval) + " hari yang lalu";
            interval = seconds / 3600;
            if (interval > 1) return Math.floor(interval) + " jam yang lalu";
            interval = seconds / 60;
            if (interval > 1) return Math.floor(interval) + " menit yang lalu";
            return "baru saja";
        };
        
        const updateTimestamps = () => {
            document.querySelectorAll('.thread-time').forEach(span => {
                const timestamp = span.getAttribute('data-timestamp');
                span.innerHTML = `<i class="bi bi-clock me-1"></i>${timeAgo(timestamp)}`;
            });
        };
        updateTimestamps();
        setInterval(updateTimestamps, 60000);
        
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const allThreads = document.querySelectorAll('#forumList .forum-thread-card');

            allThreads.forEach(card => {
                const titleElement = card.querySelector('h5 a');
                const categoryElement = card.querySelector('.badge');

                if (titleElement && categoryElement) {
                    const title = titleElement.textContent.toLowerCase();
                    const category = categoryElement.textContent.toLowerCase();

                    if (title.includes(searchTerm) || category.includes(searchTerm)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    }

});