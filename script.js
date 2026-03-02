// EMOJI & KATEGORI (SAMA)
const specificEmojis = {
    'kulkas': '❄️', 'tv': '📺', 'televisi': '📺', 'ac': '❄️', 'kipas': '💨',
    'mesin cuci': '🧺', 'blender': '🔄', 'rice cooker': '🍚', 'kompor': '🔥',
    'setrika': '🔧', 'microwave': '🔥', 'dispenser': '💧', 'smartwatch': '⌚',
    'smartphone': '📱', 'laptop': '💻', 'air fryer': '🌪️', 'robot vacuum': '🤖',
    'penyedot debu': '🧹', 'air purifier': '💨', 'kursi': '🪑', 'meja': '🪑',
    'sofa': '🛋️', 'lemari': '🚪', 'tempat tidur': '🛏️', 'kasur': '🛏️',
    'panci': '🥘', 'wajan': '🥄', 'pisau': '🔪', 'sapu': '🧹', 'pel': '🧽'
};

const categoryEmojis = {
    'Barang Elektronik': '🔌', 'Perabotan': '🛋️', 'Peralatan Dapur': '🍽️',
    'Peralatan Kebersihan': '🧹', 'Lainnya': '📦'
};

const categories = {
    'Barang Elektronik': ['kulkas', 'tv', 'ac', 'kipas', 'mesin cuci', 'laptop', 'hp'],
    'Perabotan': ['kursi', 'meja', 'sofa', 'lemari', 'tempat tidur'],
    'Peralatan Dapur': ['panci', 'wajan', 'pisau'],
    'Peralatan Kebersihan': ['sapu', 'pel', 'ember'],
    'Lainnya': []
};

let inventory = JSON.parse(localStorage.getItem('inventory')) || {};
Object.keys(categories).forEach(cat => { if (!inventory[cat]) inventory[cat] = []; });

function getItemEmoji(itemName, category) {
    const lowerItem = itemName.toLowerCase();
    for (const [keyword, emoji] of Object.entries(specificEmojis)) {
        if (lowerItem.includes(keyword)) return emoji;
    }
    return categoryEmojis[category] || '📦';
}

function categorizeItem(item) {
    const lowerItem = item.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => lowerItem.includes(keyword))) return category;
    }
    return 'Lainnya';
}

function renderCategories() {
    const container = document.getElementById('categories');
    container.innerHTML = '';

    Object.entries(inventory).forEach(([category, items]) => {
        const catDiv = document.createElement('div');
        catDiv.className = `category`;
        catDiv.innerHTML = `
            <h3>${categoryEmojis[category]} ${category} (${items.length})</h3>
            <div class="items">
                ${items.map((item, idx) => {
            const emoji = getItemEmoji(item, category);
            return `<div class="item"><span>${emoji} ${item}</span><button class="delete-btn" onclick="deleteItem('${category}', ${idx})">🗑️</button></div>`;
        }).join('') || `<div class="empty">${categoryEmojis[category]} Kosong</div>`}
            </div>
        `;
        container.appendChild(catDiv);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('itemForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const itemName = document.getElementById('itemName').value.trim();
        if (!itemName) return;

        const category = categorizeItem(itemName);
        inventory[category].unshift(itemName);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        document.getElementById('itemName').value = '';
        renderCategories();
    });

    window.deleteItem = function (category, index) {
        inventory[category].splice(index, 1);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        renderCategories();
    };

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

    renderCategories();
});
