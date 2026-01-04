import React, { useState, useMemo } from 'react';
import { initialProducts } from './data/products';
import { useDebounce } from './hooks/useDebounce';
import SearchBar from './components/SearchBar';
import ViewToggle from './components/ViewToggle';
import ProductList from './components/ProductList';
import ProductCard from './components/ProductCard';
import ProductForm from './components/ProductForm';
import Pagination from './components/Pagination';

const ITEMS_PER_PAGE = 6;

export default function App() {
  // State management
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('card');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Debounced search term (500ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return products;
    }
    return products.filter((product) =>
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [products, debouncedSearchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Handlers
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing product
      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? productData : p))
      );
    } else {
      // Add new product
      setProducts((prev) => [productData, ...prev]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDeleteClick = (productId) => {
    setDeleteConfirm(productId);
  };

  const handleConfirmDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deleteConfirm));
    setDeleteConfirm(null);
    // Adjust current page if needed
    const newTotal = Math.ceil((filteredProducts.length - 1) / ITEMS_PER_PAGE);
    if (currentPage > newTotal && newTotal > 0) {
      setCurrentPage(newTotal);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Product Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your products inventory with ease
              </p>
            </div>
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
          <span>
            Showing <span className="font-semibold text-gray-900">{paginatedProducts.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
            {debouncedSearchTerm && (
              <span className="ml-1">
                for "<span className="font-medium text-blue-600">{debouncedSearchTerm}</span>"
              </span>
            )}
          </span>
          <span className="text-gray-500">
            Page {currentPage} of {totalPages || 1}
          </span>
        </div>

        {/* Product Display */}
        {viewMode === 'list' ? (
          <ProductList
            products={paginatedProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteClick}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteClick}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or add a new product.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCloseForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Delete Product?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              This action cannot be undone. The product will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
