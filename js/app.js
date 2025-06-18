document.addEventListener('DOMContentLoaded', () => {
    console.log("1. app.js loaded and DOMContentLoaded fired.");
    const productsContainer = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const filterBrandSelect = document.getElementById('filterBrand');

    let allProducts = []; // Para almacenar todos los productos cargados

    // Función para obtener el ID de Google Drive y construir la URL directa
    function getGoogleDriveDirectLink(viewUrl) {
        if (!viewUrl) {
            return 'https://via.placeholder.com/150?text=No+Image'; // Imagen por defecto si no hay URL
        }
        // Expresión regular para extraer el ID del archivo de Google Drive
        const match = viewUrl.match(/\/d\/([a-zA-Z0-9_-]+)(?:\/view)?/);
        if (match && match[1]) {
            const fileId = match[1];
            // Construir la URL de descarga directa
            return `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
        // Si no se puede extraer el ID, devuelve la URL original o una por defecto
        return viewUrl; // O 'https://via.placeholder.com/150?text=No+Image' si prefieres no intentar con la URL original fallida
    }

    // Función para cargar los productos desde el JSON
    async function fetchProducts() {
        console.log("2. fetchProducts() called. Attempting to fetch JSON...");
        try {
            const response = await fetch('data/catalogo_mrpartes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allProducts = data;
            displayProducts(allProducts); // Mostrar todos los productos al inicio
            populateFilters(allProducts); // Llenar los filtros
        } catch (error) {
            console.error('Error fetching products:', error);
            productsContainer.innerHTML = '<p>Error al cargar los productos. Por favor, intente de nuevo más tarde.</p>';
        }
    }

    // Función para mostrar los productos en el contenedor
    function displayProducts(products) {
        productsContainer.innerHTML = ''; // Limpiar contenedor
        if (products.length === 0) {
            productsContainer.innerHTML = '<p>No se encontraron productos con los criterios de búsqueda/filtro.</p>';
            return;
        }
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            // Usar la función getGoogleDriveDirectLink para obtener la URL correcta de la imagen
            const imageUrl = getGoogleDriveDirectLink(product.imagenUrl);
            productCard.innerHTML = `
                <img src="${imageUrl}" alt="${product.nombre}">
                <h2>${product.nombre}</h2>
                <p>Código: ${product.codigo}</p>
                <p>Marca: ${product.marca || 'N/A'}</p>
                <p class="price">$ ${product.precio.toLocaleString('es-CO')}</p>
            `;
            productsContainer.appendChild(productCard);
        });
    }

    // Función para poblar los selectores de filtros
    function populateFilters(products) {
        const brands = new Set();
        products.forEach(product => {
            if (product.marca) {
                brands.add(product.marca);
            }
        });

        // Limpiar y añadir opciones de marca
        filterBrandSelect.innerHTML = '<option value="">Todas</option>';
        Array.from(brands).sort().forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            filterBrandSelect.appendChild(option);
        });
    }

    // Función para aplicar búsqueda y filtros
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedBrand = filterBrandSelect.value;

        let filteredProducts = allProducts.filter(product => {
            const matchesSearch = product.nombre.toLowerCase().includes(searchTerm) ||
                                  product.codigo.toLowerCase().includes(searchTerm);

            const matchesBrand = selectedBrand === "" || product.marca === selectedBrand;

            return matchesSearch && matchesBrand;
        });

        displayProducts(filteredProducts);
    }

    // Event listeners para la búsqueda y los filtros
    searchButton.addEventListener('click', applyFilters);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            applyFilters();
        }
    });
    filterBrandSelect.addEventListener('change', applyFilters);

    // Cargar productos cuando el DOM esté listo
    fetchProducts();
});