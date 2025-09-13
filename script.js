const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const creatureInfo = document.getElementById('creature-info');

// API base URL
const API_BASE_URL = 'https://rpg-creature-api.freecodecamp.rocks/api/creature';

// Function to search for creature
async function searchCreature() {
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        alert('Please enter a creature name or ID');
        return;
    }

    try {
        // For numeric IDs, don't convert to lowercase
        const searchValue = isNaN(searchTerm) ? searchTerm.toLowerCase() : searchTerm;
        const response = await fetch(`${API_BASE_URL}/${searchValue}`);

        if (!response.ok) {
            throw new Error('Creature not found');
        }

        const creatureData = await response.json();
        displayCreature(creatureData);

    } catch (error) {
        alert('Creature not found');
        creatureInfo.style.display = 'none';
    }
}

// Creature icon mapping based on types and names
const creatureIcons = {
    // Type-based icons
    'fire': '🔥',
    'water': '💧',
    'rock': '🪨',
    'electric': '⚡',
    'grass': '🌿',
    'ice': '❄️',
    'ground': '🌍',
    'flying': '🦅',
    'psychic': '🔮',
    'dark': '🌙',
    'dragon': '🐉',
    'poison': '☠️',
    'steel': '⚔️',
    'fairy': '🧚',
    'normal': '⭐',
    // Specific creature icons
    'pyrolynx': '🦁',
    'aquoroc': '🐢',
    'voltadon': '🐊',
    'floraspine': '🌵',
    'cryostag': '🦌',
    'terradon': '🦕',
    'emberapod': '🕷️',
    'lunaclaw': '🐺',
    'quillquake': '🦔',
    'mystifin': '🐠',
    'dracilume': '🐲',
    'thornaconda': '🐍',
    'frostbyte': '🐧',
    'graviboa': '🐍',
    'zephyreon': '🦋',
    'blazebore': '🐗',
    'brontogale': '🦏',
    'shadeelisk': '🦎',
    'titanule': '🐛',
    'faegis': '🦄'
};

// Function to get creature icon
function getCreatureIcon(data) {
    const creatureName = data.name.toLowerCase();

    // Check for specific creature icon first
    if (creatureIcons[creatureName]) {
        return creatureIcons[creatureName];
    }

    // Fall back to type-based icon
    if (data.types && data.types.length > 0) {
        const primaryType = data.types[0].name.toLowerCase();
        return creatureIcons[primaryType] || '🐾';
    }

    return '🐾'; // Default icon
}

// Function to display creature data
function displayCreature(data) {
    // Basic info
    document.getElementById('creature-name').textContent = data.name.toUpperCase();
    document.getElementById('creature-id').textContent = `#${data.id}`;
    document.getElementById('weight').textContent = `Weight: ${data.weight}`;
    document.getElementById('height').textContent = `Height: ${data.height}`;

    // Handle base experience and order (may not exist in RPG API)
    const baseExpElement = document.getElementById('base-experience');
    const orderElement = document.getElementById('order');
    if (baseExpElement) baseExpElement.textContent = data.base_experience || 'N/A';
    if (orderElement) orderElement.textContent = data.order || 'N/A';

    // Creature icon/image
    const creatureImage = document.getElementById('creature-image');
    if (data.sprites && data.sprites.front_default) {
        creatureImage.src = data.sprites.front_default;
        creatureImage.style.display = 'block';
        creatureImage.alt = `${data.name} image`;
    } else {
        // Create emoji icon as fallback
        const icon = getCreatureIcon(data);
        creatureImage.style.display = 'none';

        // Create or update icon element
        let iconElement = document.getElementById('creature-icon');
        if (!iconElement) {
            iconElement = document.createElement('div');
            iconElement.id = 'creature-icon';
            iconElement.className = 'creature-icon-emoji';
            creatureImage.parentNode.appendChild(iconElement);
        }
        iconElement.textContent = icon;
        iconElement.style.display = 'block';
    }

    // Abilities (handle RPG API special ability format)
    const abilitiesContainer = document.getElementById('abilities');
    if (abilitiesContainer) {
        abilitiesContainer.innerHTML = '';
        if (data.special) {
            const abilityElement = document.createElement('span');
            abilityElement.className = 'ability-badge';
            abilityElement.textContent = data.special.name;
            abilityElement.title = data.special.description;
            abilitiesContainer.appendChild(abilityElement);
        }
    }

    // Stats - RPG API has different structure
    const statsMap = {};
    data.stats.forEach(stat => {
        statsMap[stat.name] = stat.base_stat;
    });

    document.getElementById('hp').textContent = statsMap['hp'];
    document.getElementById('attack').textContent = statsMap['attack'];
    document.getElementById('defense').textContent = statsMap['defense'];
    document.getElementById('special-attack').textContent = statsMap['special-attack'];
    document.getElementById('special-defense').textContent = statsMap['special-defense'];
    document.getElementById('speed').textContent = statsMap['speed'];

    // Types - clear previous types and add new ones
    const typesContainer = document.getElementById('types');
    typesContainer.innerHTML = '';
    data.types.forEach(typeInfo => {
        const typeElement = document.createElement('span');
        typeElement.className = 'type-badge';
        typeElement.textContent = typeInfo.name.toUpperCase();
        typesContainer.appendChild(typeElement);
    });

    // Show creature info
    creatureInfo.style.display = 'block';
}

// Add event listeners
searchButton.addEventListener('click', searchCreature);
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchCreature();
    }
});

// Add close button functionality
const closeButton = document.getElementById('close-button');
closeButton.addEventListener('click', closeCreatureDetails);

function closeCreatureDetails() {
    const creatureInfo = document.getElementById('creature-info');
    creatureInfo.style.display = 'none';

    // Clear the search input
    searchInput.value = '';

    // Focus back to search input
    searchInput.focus();
}

// Load available creatures on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAvailableCreatures();
    initializeAccordion();
});

// Initialize accordion functionality
function initializeAccordion() {
    const accordionHeader = document.getElementById('accordion-header');
    const accordionContent = document.getElementById('accordion-content');
    const accordionToggle = accordionHeader.querySelector('.accordion-toggle');

    accordionHeader.addEventListener('click', () => {
        const isExpanded = accordionContent.classList.contains('expanded');

        if (isExpanded) {
            // Collapse
            accordionContent.classList.remove('expanded');
            accordionToggle.classList.remove('rotated');
            accordionToggle.textContent = '▼';
        } else {
            // Expand
            accordionContent.classList.add('expanded');
            accordionToggle.classList.add('rotated');
            accordionToggle.textContent = '▲';
        }
    });
}

// Function to load and display all available creatures
async function loadAvailableCreatures() {
    try {
        const response = await fetch('https://rpg-creature-api.freecodecamp.rocks/api/creatures');
        const data = await response.json();

        const creaturesGrid = document.getElementById('creatures-grid');
        creaturesGrid.innerHTML = '';

        // Create clickable creature name elements - RPG API returns array directly
        data.forEach(creature => {
            const creatureElement = document.createElement('div');
            creatureElement.className = 'creature-name-item';

            // Add creature icon to the list item
            const creatureName = creature.name.toLowerCase();
            const icon = creatureIcons[creatureName] || '🐾';

            creatureElement.innerHTML = `<span class="creature-list-icon">${icon}</span> ${creature.name}`;
            creatureElement.title = `Click to search for ${creature.name}`;

            // Add click event to search for this creature
            creatureElement.addEventListener('click', () => {
                searchInput.value = creature.name;
                searchCreature();
                // Scroll to top to see the results
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            creaturesGrid.appendChild(creatureElement);
        });

    } catch (error) {
        const creaturesGrid = document.getElementById('creatures-grid');
        creaturesGrid.innerHTML = '<div class="loading">Failed to load creature list. Please refresh the page.</div>';
    }
}

// Focus on input when page loads
window.addEventListener('load', () => {
    searchInput.focus();
});