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
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetchMenuItems(page);
  }, [page]);

  const fetchMenuItems = async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await adminMenuService.getAllMenuItems(pageNumber);
      console.log(res)
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
    formData.append("image", image);

    try {
      await adminMenuService.createMenuItem(formData);
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);

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

    if (image) formData.append("image", image);

    try {
      await adminMenuService.updateMenuItem(selectedItem._id, formData);
      setSelectedItem(null);
      fetchMenuItems(page);
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
    } catch (err) {
      alert("Failed to update menu item");
    }
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
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full"
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
          >
            {selectedItem ? "Update Item" : "Add Menu Item"}
          </button>

        </div>
      </form>

      <hr />

      {/* Table */}
      <h3 className="text-xl font-semibold">Saved Menu Items</h3>

      {loading ? (
        <p>Loading...</p>
      ) : menuItems.length === 0 ? (
        <p className="text-gray-600">No menu items found.</p>
      ) : (
        <>
          <table className="w-full border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3">
                    <img
                      src={item.imageURL}   // <-- FIXED HERE
                      alt={item.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                  </td>
                  <td className="p-3 font-medium">{item.title}</td>
                  <td className="p-3">${item.price.toFixed(2)}</td>
                  <td className="p-3">{item.description || "-"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                    <button 
                    style={{marginLeft: "10px"}}
                      onClick={() => {
                        setSelectedItem(item);
                        setTitle(item.title);
                        setDescription(item.description || "");
                        setPrice(item.price.toString());
                        setImage(null);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm mr-2" 
                    >
                      Edit
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          {/* Pagination UI */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded ${page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white"
                }`}
            >
              Prev
            </button>

            <span className="font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded ${page === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white"
                }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MenuManagement;
