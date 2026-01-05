import { useState, useEffect } from "react";
import { adminMenuService } from "../../services/adminMenuService";
import type { MenuItem } from "../../services/adminMenuService";
import "../../components/componentStyles/AdminMenuManagement.css";

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [search, setSearch] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("pizza");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Category options
  const categoryOptions = [
    { value: "pizza", label: "Pizza", icon: "🍕" },
    { value: "burger", label: "Burger", icon: "🍔" },
    { value: "dessert", label: "Dessert", icon: "🍰" },
    { value: "drinks", label: "Drinks", icon: "🥤" },
    { value: "pasta", label: "Pasta", icon: "🍝" },
    { value: "snacks", label: "Snacks", icon: "🍟" }
  ];

  useEffect(() => {
    fetchMenuItems(page);
  }, [page]);

  const fetchMenuItems = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminMenuService.getAllMenuItems(pageNumber);
      setMenuItems(res.data);
      setTotalPages(res.totalPages);
      setTotalItems(res.totalItems || res.data.length);
    } catch (err: any) {
      setError("Failed to load menu items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !image) {
      alert("Title, price & image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", image);

    try {
      await adminMenuService.createMenuItem(formData);
      resetForm();
      setPage(1);
      fetchMenuItems(1);
    } catch (err: any) {
      alert("Failed to create menu item");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      await adminMenuService.updateMenuItem(selectedItem._id, formData);
      resetForm();
      setSelectedItem(null);
      fetchMenuItems(page);
    } catch (err) {
      alert("Failed to update menu item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      await adminMenuService.deleteMenuItem(id);
      fetchMenuItems(page);
    } catch (err: any) {
      console.error("Delete error:", err);
      alert("Failed to delete menu item");
    }
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setTitle(item.title);
    setDescription(item.description || "");
    setPrice(item.price.toString());
    setCategory(item.category || "pizza");
    setImagePreview(item.imageURL);
    setImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    resetForm();
    setSelectedItem(null);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("pizza");
    setImage(null);
    setImagePreview(null);
  };

  // Filter menu items based on search
  const filteredMenuItems = menuItems.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.toLowerCase().includes(search.toLowerCase())
  );

  // Category statistics
  const categoryStats = categoryOptions.map(cat => ({
    ...cat,
    count: menuItems.filter(item => item.category === cat.value).length
  }));

  // Calculate stats
  const stats = {
    total: totalItems,
    averagePrice: menuItems.length > 0 
      ? (menuItems.reduce((acc, item) => acc + item.price, 0) / menuItems.length).toFixed(2)
      : "0.00",
    categories: categoryOptions.length,
    popularCategory: categoryStats.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    ).label
  };

  return (
    <div className="menu-mgmt-container">
      {/* Header Section */}
      <div className="menu-mgmt-header">
        <div className="menu-mgmt-header-content">
          <h2>Menu Management</h2>
          <p>Create, update, and manage your restaurant menu items with categories</p>
        </div>
        <div className="menu-mgmt-header-icon">
          <i className="fas fa-utensils"></i>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="menu-mgmt-stats">
        <div className="menu-mgmt-stat-card">
          <div className="menu-mgmt-stat-icon menu-mgmt-stat-icon-primary">
            <i className="fas fa-utensils"></i>
          </div>
          <div className="menu-mgmt-stat-content">
            <h3>{stats.total}</h3>
            <p>Total Menu Items</p>
          </div>
        </div>
        
        <div className="menu-mgmt-stat-card">
          <div className="menu-mgmt-stat-icon menu-mgmt-stat-icon-secondary">
            <i className="fas fa-tag"></i>
          </div>
          <div className="menu-mgmt-stat-content">
            <h3>${stats.averagePrice}</h3>
            <p>Average Price</p>
          </div>
        </div>
        
        <div className="menu-mgmt-stat-card">
          <div className="menu-mgmt-stat-icon menu-mgmt-stat-icon-success">
            <i className="fas fa-layer-group"></i>
          </div>
          <div className="menu-mgmt-stat-content">
            <h3>{stats.categories}</h3>
            <p>Categories</p>
          </div>
        </div>
        
        <div className="menu-mgmt-stat-card">
          <div className="menu-mgmt-stat-icon menu-mgmt-stat-icon-warning">
            <i className="fas fa-fire"></i>
          </div>
          <div className="menu-mgmt-stat-content">
            <h3>{stats.popularCategory}</h3>
            <p>Popular Category</p>
          </div>
        </div>
      </div>

      {/* Category Quick Stats */}
      <div className="menu-mgmt-categories">
        <h3>Category Distribution</h3>
        <div className="menu-mgmt-category-badges">
          {categoryStats.map(cat => (
            <div key={cat.value} className="menu-mgmt-category-badge">
              <span className="menu-mgmt-category-icon">{cat.icon}</span>
              <span className="menu-mgmt-category-label">{cat.label}</span>
              <span className="menu-mgmt-category-count">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Control Bar */}
      <div className="menu-mgmt-controls">
        <div className="menu-mgmt-search">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search items by title, description, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="menu-mgmt-actions">
          <button
            onClick={() => fetchMenuItems(page)}
            className="menu-mgmt-action-btn menu-mgmt-refresh-btn"
          >
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
          <button
            onClick={resetForm}
            className="menu-mgmt-action-btn menu-mgmt-clear-btn"
          >
            <i className="fas fa-times"></i>
            Clear Form
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="menu-mgmt-error">
          <div className="menu-mgmt-error-content">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error}</span>
          </div>
          <button 
            onClick={() => setError(null)}
            className="menu-mgmt-error-close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Menu Form */}
      <div className="menu-mgmt-form-container">
        <div className="menu-mgmt-form-header">
          <h3>
            <i className={`fas ${selectedItem ? 'fa-edit' : 'fa-plus-circle'}`}></i>
            {selectedItem ? "Edit Menu Item" : "Add New Menu Item"}
          </h3>
          <p>{selectedItem ? "Update the item details below" : "Fill in all required fields to add a new item"}</p>
        </div>
        
        <form onSubmit={selectedItem ? handleUpdate : handleCreate} className="menu-mgmt-form">
          <div className="menu-mgmt-form-grid">
            {/* Left Column - Basic Info */}
            <div className="menu-mgmt-form-section">
              <h4>Basic Information</h4>
              
              <div className="menu-mgmt-form-group">
                <label className="menu-mgmt-form-label">
                  <i className="fas fa-heading"></i>
                  Item Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter menu item title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="menu-mgmt-form-input"
                  required
                />
              </div>

              <div className="menu-mgmt-form-group">
                <label className="menu-mgmt-form-label">
                  <i className="fas fa-align-left"></i>
                  Description
                </label>
                <textarea
                  placeholder="Describe your menu item (ingredients, special notes, etc.)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="menu-mgmt-form-textarea"
                  rows={4}
                />
              </div>

              <div className="menu-mgmt-form-row">
                <div className="menu-mgmt-form-group">
                  <label className="menu-mgmt-form-label">
                    <i className="fas fa-dollar-sign"></i>
                    Price *
                  </label>
                  <div className="menu-mgmt-price-input-wrapper">
                    <span className="menu-mgmt-currency-symbol">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="menu-mgmt-form-input menu-mgmt-price-input"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="menu-mgmt-form-group">
                  <label className="menu-mgmt-form-label">
                    <i className="fas fa-tag"></i>
                    Category *
                  </label>
                  <div className="menu-mgmt-category-select-wrapper">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="menu-mgmt-form-select"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </option>
                      ))}
                    </select>
                    <i className="fas fa-chevron-down menu-mgmt-select-arrow"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="menu-mgmt-form-section">
              <h4>Item Image</h4>
              
              <div className="menu-mgmt-image-upload-section">
                {imagePreview ? (
                  <div className="menu-mgmt-image-preview-container">
                    <div className="menu-mgmt-preview-header">
                      <span>Image Preview</span>
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                        className="menu-mgmt-remove-image-btn"
                      >
                        <i className="fas fa-trash"></i>
                        Remove
                      </button>
                    </div>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="menu-mgmt-preview-image"
                    />
                  </div>
                ) : (
                  <label className="menu-mgmt-upload-area">
                    <div className="menu-mgmt-upload-icon">
                      <i className="fas fa-cloud-upload-alt"></i>
                    </div>
                    <div className="menu-mgmt-upload-text">
                      <p className="menu-mgmt-upload-title">Click to upload image</p>
                      <p className="menu-mgmt-upload-subtitle">or drag and drop</p>
                      <p className="menu-mgmt-upload-info">PNG, JPG, JPEG up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="menu-mgmt-file-input"
                      accept="image/*"
                      required={!selectedItem}
                    />
                  </label>
                )}

                {selectedItem && !imagePreview && (
                  <div className="menu-mgmt-current-image-section">
                    <div className="menu-mgmt-current-image-header">
                      <i className="fas fa-image"></i>
                      <span>Current Image</span>
                    </div>
                    <div className="menu-mgmt-current-image-container">
                      <img 
                        src={selectedItem.imageURL} 
                        alt={selectedItem.title}
                        className="menu-mgmt-current-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                      <div className="menu-mgmt-image-info">
                        <span className="menu-mgmt-image-name">{selectedItem.title}</span>
                        <span className="menu-mgmt-image-hint">Upload new image to replace</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="menu-mgmt-upload-tips">
                  <h5><i className="fas fa-lightbulb"></i> Image Tips</h5>
                  <ul>
                    <li>Use high-quality images (800x600px recommended)</li>
                    <li>Ensure good lighting and focus</li>
                    <li>Use PNG format for transparency</li>
                    <li>Keep file size under 5MB</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="menu-mgmt-form-actions">
            {selectedItem ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="menu-mgmt-form-btn menu-mgmt-cancel-btn"
                >
                  <i className="fas fa-times"></i>
                  Cancel Edit
                </button>
                <button
                  type="submit"
                  className="menu-mgmt-form-btn menu-mgmt-update-btn"
                >
                  <i className="fas fa-save"></i>
                  Update Item
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="menu-mgmt-form-btn menu-mgmt-submit-btn"
              >
                <i className="fas fa-plus"></i>
                Add Menu Item
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Menu Items Table */}
      <div className="menu-mgmt-table-container">
        <div className="menu-mgmt-table-header">
          <div className="menu-mgmt-table-title">
            <h3>
              <i className="fas fa-list"></i>
              Menu Items ({filteredMenuItems.length})
            </h3>
            <div className="menu-mgmt-table-info">
              Page <span className="menu-mgmt-info-highlight">{page}</span> of <span className="menu-mgmt-info-highlight">{totalPages}</span>
              <span className="menu-mgmt-info-divider">•</span>
              Showing <span className="menu-mgmt-info-highlight">{filteredMenuItems.length}</span> items
            </div>
          </div>
          
          <div className="menu-mgmt-table-filters">
            <select className="menu-mgmt-filter-select" defaultValue="all">
              <option value="all">All Categories</option>
              {categoryOptions.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="menu-mgmt-loading-state">
            <div className="menu-mgmt-loading-spinner">
              <i className="fas fa-utensils fa-spin"></i>
            </div>
            <p className="menu-mgmt-loading-text">Loading menu items...</p>
            <p className="menu-mgmt-loading-subtext">Please wait while we fetch your data</p>
          </div>
        ) : filteredMenuItems.length === 0 ? (
          /* Empty State */
          <div className="menu-mgmt-empty-state">
            <div className="menu-mgmt-empty-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>No Menu Items Found</h3>
            <p>
              {search 
                ? "No items match your search criteria. Try different keywords."
                : "Your menu is empty. Start by adding your first menu item above!"
              }
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="menu-mgmt-empty-action-btn"
              >
                <i className="fas fa-times"></i>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="menu-mgmt-table-scroll-container">
              <table className="menu-mgmt-table">
                <thead>
                  <tr>
                    <th className="menu-mgmt-table-th">
                      <i className="fas fa-image"></i>
                      Image
                    </th>
                    <th className="menu-mgmt-table-th">
                      <i className="fas fa-info-circle"></i>
                      Details
                    </th>
                    <th className="menu-mgmt-table-th">
                      <i className="fas fa-tag"></i>
                      Category
                    </th>
                    <th className="menu-mgmt-table-th">
                      <i className="fas fa-dollar-sign"></i>
                      Price
                    </th>
                    <th className="menu-mgmt-table-th">
                      <i className="fas fa-cogs"></i>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMenuItems.map((item) => {
                    const categoryInfo = categoryOptions.find(c => c.value === item.category) || categoryOptions[0];
                    return (
                      <tr key={item._id} className="menu-mgmt-table-row">
                        {/* Image Column */}
                        <td className="menu-mgmt-table-cell menu-mgmt-image-cell">
                          <div className="menu-mgmt-item-image-wrapper">
                            <img
                              src={item.imageURL}
                              alt={item.title}
                              className="menu-mgmt-item-image"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image';
                              }}
                            />
                            <div className="menu-mgmt-image-overlay">
                              <i className="fas fa-expand"></i>
                            </div>
                          </div>
                        </td>

                        {/* Details Column */}
                        <td className="menu-mgmt-table-cell menu-mgmt-details-cell">
                          <div className="menu-mgmt-item-details">
                            <h4 className="menu-mgmt-item-title">{item.title}</h4>
                            <p className="menu-mgmt-item-description">
                              {item.description || <span className="menu-mgmt-no-description">No description provided</span>}
                            </p>
                            <div className="menu-mgmt-item-meta">
                              <span className="menu-mgmt-item-id">
                                <i className="fas fa-fingerprint"></i>
                                ID: {item._id.slice(-8)}
                              </span>
                              <span className="menu-mgmt-item-date">
                                <i className="far fa-clock"></i>
                                Updated recently
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category Column */}
                        <td className="menu-mgmt-table-cell menu-mgmt-category-cell">
                          <div className="menu-mgmt-category-display">
                            <span className="menu-mgmt-category-icon">{categoryInfo.icon}</span>
                            <div className="menu-mgmt-category-info">
                              <span className="menu-mgmt-category-name">{categoryInfo.label}</span>
                              <span className="menu-mgmt-category-badge">{categoryInfo.value}</span>
                            </div>
                          </div>
                        </td>

                        {/* Price Column */}
                        <td className="menu-mgmt-table-cell menu-mgmt-price-cell">
                          <div className="menu-mgmt-price-display">
                            <div className="menu-mgmt-price-amount">
                              <span className="menu-mgmt-currency">$</span>
                              <span className="menu-mgmt-amount">{item.price.toFixed(2)}</span>
                            </div>
                            <div className="menu-mgmt-price-comparison">
                              <i className="fas fa-chart-line"></i>
                              {item.price > 20 ? "Premium" : item.price > 10 ? "Standard" : "Budget"}
                            </div>
                          </div>
                        </td>

                        {/* Actions Column */}
                        <td className="menu-mgmt-table-cell menu-mgmt-actions-cell">
                          <div className="menu-mgmt-action-buttons">
                            <button
                              onClick={() => handleEdit(item)}
                              className="menu-mgmt-action-btn menu-mgmt-edit-btn"
                              title="Edit Item"
                            >
                              <i className="fas fa-edit"></i>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="menu-mgmt-action-btn menu-mgmt-delete-btn"
                              title="Delete Item"
                            >
                              <i className="fas fa-trash-alt"></i>
                              Delete
                            </button>
                            <button
                              className="menu-mgmt-action-btn menu-mgmt-view-btn"
                              title="Quick View"
                              onClick={() => window.open(item.imageURL, '_blank')}
                            >
                              <i className="fas fa-eye"></i>
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="menu-mgmt-pagination">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => prev - 1)}
                  className={`menu-mgmt-pagination-btn menu-mgmt-prev-btn ${page === 1 ? 'menu-mgmt-disabled' : ''}`}
                >
                  <i className="fas fa-chevron-left"></i>
                  Previous
                </button>
                
                <div className="menu-mgmt-pagination-pages">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`menu-mgmt-page-btn ${page === pageNum ? 'menu-mgmt-active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && page < totalPages - 2 && (
                    <>
                      <span className="menu-mgmt-page-dots">...</span>
                      <button
                        onClick={() => setPage(totalPages)}
                        className={`menu-mgmt-page-btn ${page === totalPages ? 'menu-mgmt-active' : ''}`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => prev + 1)}
                  className={`menu-mgmt-pagination-btn menu-mgmt-next-btn ${page === totalPages ? 'menu-mgmt-disabled' : ''}`}
                >
                  Next
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;