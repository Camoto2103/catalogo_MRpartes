document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const filterBrandSelect = document.getElementById('filterBrand');

    let allProducts = []; // Para almacenar todos los productos cargados

    // Función para cargar los productos desde el JSON
    async function fetchProducts() {
        try {
            const response = await fetch('data/products.json');
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
            productCard.innerHTML = `
                <img src="${product.imagenUrl || 'https://via.placeholder.com/150?text=No+Image'}" alt="${product.nombre}">
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