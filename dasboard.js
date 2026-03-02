class Dashboard {
    constructor() {
        // AMBIL DATA DARI localStorage INDEX.HTML
        this.inventory = JSON.parse(localStorage.getItem('inventory')) || {};

        // INISIALISASI KATEGORI KOSONG JIKA BELUM ADA
        const requiredCategories = [
            'Barang Elektronik',
            'Perabotan',
            'Peralatan Dapur',
            'Peralatan Kebersihan',
            'Lainnya'
        ];

        requiredCategories.forEach(cat => {
            if (!this.inventory[cat]) {
                this.inventory[cat] = [];
            }
        });

        // SIMPAN KE LOCALSTORAGE
        localStorage.setItem('inventory', JSON.stringify(this.inventory));
        this.itemsLog = JSON.parse(localStorage.getItem('itemsLog')) || [];
        this.chartInstance = null;
        this.init();
    }

    getCategoryTotals() {
        const totals = { all: 0, elektronik: 0, perabotan: 0, dapur: 0, kebersihan: 0, lainnya: 0 };

        Object.entries(this.inventory).forEach(([cat, items]) => {
            const count = items.length || 0;
            totals.all += count;

            if (cat === 'Barang Elektronik') totals.elektronik = count;
            else if (cat === 'Perabotan') totals.perabotan = count;
            else if (cat === 'Peralatan Dapur') totals.dapur = count;
            else if (cat === 'Peralatan Kebersihan') totals.kebersihan = count;
            else totals.lainnya = count;
        });

        return totals;
    }

    renderStats() {
        const totals = this.getCategoryTotals();

        const elements = {
            totalAll: totals.all,
            totalElektronik: totals.elektronik,
            totalPerabotan: totals.perabotan,
            totalDapur: totals.dapur,
            totalItems: totals.all
        };

        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });
    }

    renderPieChart() {
        const canvas = document.getElementById('pieChart');
        if (!canvas || typeof Chart === 'undefined') {
            console.warn('Canvas atau Chart.js belum siap');
            return;
        }

        const totals = this.getCategoryTotals();
        const ctx = canvas.getContext('2d');

        // HAPUS CHART LAMA
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        this.chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Elektronik', 'Perabotan', 'Dapur', 'Kebersihan', 'Lainnya'],
                datasets: [{
                    data: [totals.elektronik, totals.perabotan, totals.dapur, totals.kebersihan, totals.lainnya],
                    backgroundColor: ['#2196F3', '#FF9800', '#4CAF50', '#9C27B0', '#607D8B'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: 'white' }
                    }
                }
            }
        });
    }

    renderRecentItems() {
        const container = document.getElementById('recentItems');
        if (!container) return;

        const recent = [];
        Object.entries(this.inventory).forEach(([cat, items]) => {
            items.slice(-3).forEach(item => {
                recent.push({ name: item, category: cat });
            });
        });

        container.innerHTML = recent.length ?
            recent.map(item => `
                <div class="recent-item">
                    <span>${item.name}</span>
                    <small>${item.category}</small>
                </div>
            `).join('') :
            '<div style="text-align:center;color:#ccc;padding:40px;">Belum ada data</div>';
    }

    renderTable() {
        const allItems = [];
        Object.entries(this.inventory).forEach(([cat, items]) => {
            items.slice(-10).forEach(item => {
                allItems.push({ name: item, category: cat });
            });
        });

        const tbody = document.querySelector('#itemsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = allItems.map((item, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td>${item.name}</td>
                <td><span class="badge">${item.category}</span></td>
                <td>${new Date().toLocaleDateString('id-ID')}</td>
                <td><button class="btn btn-danger">Hapus</button></td>
            </tr>
        `).join('');
    }

    init() {
        // DELAY SEDIKIT SUPAYA DOM READY
        setTimeout(() => {
            try {
                this.renderStats();
                this.renderPieChart();
                this.renderRecentItems();
                this.renderTable();
            } catch (error) {
                console.error('Dashboard init error:', error);
            }
        }, 100);

        // PROFILE MODAL LOGIC
        const openBtn = document.getElementById('openProfile');
        const closeBtn = document.getElementById('closeProfile');
        const modal = document.getElementById('profileModal');

        if (openBtn && closeBtn && modal) {
            openBtn.addEventListener('click', () => {
                modal.classList.add('active');
            });

            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    }
}

// MULAI SAAT DOM READY
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Dashboard();
    });
} else {
    new Dashboard();
}
