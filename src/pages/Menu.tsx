import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageURL: string;
  category?: string;
}

const categoriesList = ["Pizza", "Burger", "Dessert", "Drinks", "Pasta", "Snacks"];

const Menu: React.FC = () => {
  const { addToCart, loading } = useCart();

  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(50);
  const [sortBy, setSortBy] = useState("latest");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = async () => {
    setLoadingItems(true);

    const params = new URLSearchParams({
      page: page.toString(),
      limit: "9",
      search,
      maxPrice: maxPrice.toString(),
      sort: sortBy,
      categories: selectedCategories.join(","),
    });

    try {
      const res = await fetch(`http://localhost:5000/api/items?${params}`);
      const data = await res.json();

      setItems(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error loading items:", err);
    }
    setLoadingItems(false);
  };

  useEffect(() => {
    fetchItems();
  }, [page, search, maxPrice, sortBy, selectedCategories]);

  const toggleCategory = (cat: string) => {
    setPage(1);
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setMaxPrice(50);
    setSortBy("latest");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* LEFT SIDEBAR */}
      <aside className="w-72 bg-white shadow-md p-5 border-r hidden lg:block">

        <h2 className="text-xl font-bold mb-4">Filters</h2>

        {/* SEARCH */}
        <div className="mb-5">
          <h3 className="font-semibold mb-2">Search</h3>
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* CATEGORY FILTER */}
        <div className="mb-5">
          <h3 className="font-semibold mb-2">Category</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categoriesList.map((cat) => (
              <label key={cat} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.toLowerCase())}
                  onChange={() => toggleCategory(cat.toLowerCase())}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* PRICE RANGE */}
        <div className="mb-5">
          <h3 className="font-semibold mb-2">Max Price: ${maxPrice}</h3>
          <input
            type="range"
            min="5"
            max="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* SORT */}
        <div className="mb-5">
          <h3 className="font-semibold mb-2">Sort By</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="latest">Latest</option>
            <option value="priceLowHigh">Price: Low → High</option>
            <option value="priceHighLow">Price: High → Low</option>
          </select>
        </div>

        {/* CLEAR FILTERS */}
        <button
          onClick={clearFilters}
          className="w-full bg-red-500 text-white py-2 rounded mt-4"
        >
          Clear Filters
        </button>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 p-6">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6">Menu</h1>

        {/* GRID */}
        {loadingItems ? (
          <div className="text-center py-10 text-gray-500">Loading menu...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No items found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-xl overflow-hidden shadow-md border">
                <img src={item.imageURL} className="w-full h-48 object-cover" />

                <div className="p-4">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-gray-600 text-sm">{item.description}</p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold">${item.price}</span>

                    <button
                      onClick={() =>
                        addToCart({
                          menuItemId: item._id,
                          name: item.title,
                          price: item.price,
                          image: item.imageURL,
                          quantity: 1,
                        })
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center mt-8 gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="py-2 px-4 bg-white border rounded">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </main>
    </div>
  );
};

export default Menu;
