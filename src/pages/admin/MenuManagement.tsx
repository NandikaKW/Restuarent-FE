import { useState, useEffect } from "react";
import { adminMenuService } from "../../services/adminMenuService";
import type { MenuItem } from "../../services/adminMenuService";

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("pizza"); // Added category state
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For preview

  // Category options
  const categoryOptions = [
    { value: "pizza", label: "Pizza" },
    { value: "burger", label: "Burger" },
    { value: "dessert", label: "Dessert" },
    { value: "drinks", label: "Drinks" },
    { value: "pasta", label: "Pasta" },
    { value: "snacks", label: "Snacks" }
  ];

  useEffect(() => {
    fetchMenuItems(page);
  }, [page]);

  const fetchMenuItems = async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await adminMenuService.getAllMenuItems(pageNumber);
      console.log(res);
      setMenuItems(res.data);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError("Failed to load menu items");
    } finally {
      setLoading(false);
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
    formData.append("category", category); // Added category
    formData.append("image", image);

    try {
      await adminMenuService.createMenuItem(formData);
      resetForm();
      // reload page 1 after create
      setPage(1);
      fetchMenuItems(1);
    } catch (err: any) {
      alert("Failed to create menu item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      await adminMenuService.deleteMenuItem(id);
      // Refresh the current page after successful deletion
      fetchMenuItems(page);
    } catch (err: any) {
      console.error("Delete error:", err);
      alert("Failed to delete menu item");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category); // Added category

    if (image) {
      formData.append("image", image);
    }

    try {
      await adminMenuService.updateMenuItem(selectedItem._id, formData);
      setSelectedItem(null);
      resetForm();
      fetchMenuItems(page);
    } catch (err) {
      alert("Failed to update menu item");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("pizza");
    setImage(null);
    setImagePreview(null);
    setSelectedItem(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleEditClick = (item: MenuItem) => {
    setSelectedItem(item);
    setTitle(item.title);
    setDescription(item.description || "");
    setPrice(item.price.toString());
    setCategory(item.category || "pizza"); // Set category
    setImagePreview(item.imageURL);
    setImage(null);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>

      {/* Form */}
      <form
        onSubmit={selectedItem ? handleUpdate : handleCreate}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              placeholder="Item title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Item description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border px-3 py-2 pl-7 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedItem ? "New Image (optional)" : "Image *"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border px-3 py-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              {selectedItem 
                ? "Leave empty to keep current image"
                : "Upload a high-quality image for the menu item"
              }
            </p>
          </div>

          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className={`px-4 py-2 rounded font-medium ${
                selectedItem
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {selectedItem ? "Update Item" : "Add Menu Item"}
            </button>

            {selectedItem && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-medium"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-semibold text-gray-700 mb-2">Form Tips:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Title and Price are required fields</li>
            <li>• Image is required when creating new items</li>
            <li>• Category helps customers filter items</li>
            <li>• Description improves customer experience</li>
            <li>• Use high-quality images (recommended: 800x600px)</li>
            <li>• Price should be in USD format (e.g., 12.99)</li>
          </ul>
          
          {selectedItem && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-700">
                <strong>Editing:</strong> {selectedItem.title}
              </p>
            </div>
          )}
        </div>
      </form>

      <hr />

      {/* Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Saved Menu Items</h3>
          <div className="text-sm text-gray-500">
            Total: {menuItems.length} items
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading menu items...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600 bg-red-50 rounded">
            <p>{error}</p>
            <button
              onClick={() => fetchMenuItems(page)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Try Again
            </button>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-10 text-gray-600 bg-gray-50 rounded">
            <p className="text-lg">No menu items found.</p>
            <p className="text-sm mt-1">Add your first menu item using the form above.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Image</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Title</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item, index) => (
                    <tr 
                      key={item._id} 
                      className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="p-3">
                        <img
                          src={item.imageURL}
                          alt={item.title}
                          className="w-16 h-16 rounded object-cover border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image';
                          }}
                        />
                      </td>
                      <td className="p-3 font-medium">{item.title}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : "Uncategorized"}
                        </span>
                      </td>
                      <td className="p-3 font-semibold">${item.price.toFixed(2)}</td>
                      <td className="p-3 text-sm text-gray-600 max-w-xs">
                        <div className="line-clamp-2">{item.description || "-"}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing page {page} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className={`px-4 py-2 rounded ${
                      page === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
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
                          className={`w-10 h-10 rounded ${
                            page === pageNum
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className={`px-4 py-2 rounded ${
                      page === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;