import React from 'react';

export default function ProductCard({ product, onEdit, onDelete }) {
  const stockStatus = product.stock > 50 
    ? { label: 'In Stock', color: 'bg-green-100 text-green-800' }
    : product.stock > 10 
      ? { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' }
      : product.stock > 0 
        ? { label: 'Very Low', color: 'bg-orange-100 text-orange-800' }
        : { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2" />
      
      <div className="p-5">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {product.category}
          </span>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
            {stockStatus.label}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {product.description || 'No description available'}
        </p>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            {product.stock} units
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
