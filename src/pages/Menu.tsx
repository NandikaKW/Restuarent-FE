import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import ReviewModal from "../components/ReviewModal";
import '../components/componentStyles/Menu.css';

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageURL: string;
  category?: string;
}

const categoriesList = ["Pizza", "Burger", "Dessert", "Drinks", "Pasta", "Snacks"];

const MenuPage: React.FC = () => {
  const { addToCart, loading } = useCart();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
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
    <div className="menu-page-container">
      {/* Hero Section */}
      <section className="menu-page-hero">
        <div className="menu-page-container-inner">
          <div className="menu-hero-content">
            <div className="menu-hero-text">
              <h1>Our Delicious Menu</h1>
              <p>Discover a world of flavors crafted just for you</p>
            </div>
          </div>
        </div>
      </section>

      <div className="menu-page-wrapper">
        {/* LEFT SIDEBAR */}
        <aside className="menu-page-sidebar">
          <div className="menu-sidebar-header">
            <i className="fa-solid fa-sliders"></i>
            <h2>Filters</h2>
          </div>

          {/* SEARCH */}
          <div className="menu-filter-section">
            <h3><i className="fa-solid fa-magnifying-glass"></i> Search</h3>
            <div className="menu-search-wrapper">
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="menu-page-search"
              />
              <i className="fa-solid fa-search menu-search-icon"></i>
            </div>
          </div>

          {/* CATEGORY FILTER */}
          <div className="menu-filter-section">
            <h3><i className="fa-solid fa-tags"></i> Category</h3>
            <div className="menu-category-grid">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat.toLowerCase())}
                  className={`menu-category-chip ${selectedCategories.includes(cat.toLowerCase()) ? 'menu-category-active' : ''}`}
                >
                  {cat}
                  {selectedCategories.includes(cat.toLowerCase()) && 
                    <i className="fa-solid fa-check"></i>
                  }
                </button>
              ))}
            </div>
          </div>

          {/* PRICE RANGE */}
          <div className="menu-filter-section">
            <h3><i className="fa-solid fa-dollar-sign"></i> Price Range</h3>
            <div className="menu-price-container">
              <div className="menu-price-header">
                <span>Max Price:</span>
                <span className="menu-price-value">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="menu-price-slider"
              />
              <div className="menu-price-labels">
                <span>$5</span>
                <span>$100</span>
              </div>
            </div>
          </div>

          {/* SORT */}
          <div className="menu-filter-section">
            <h3><i className="fa-solid fa-arrow-up-wide-short"></i> Sort By</h3>
            <div className="menu-sort-options">
              <button 
                onClick={() => setSortBy("latest")}
                className={`menu-sort-btn ${sortBy === "latest" ? 'menu-sort-active' : ''}`}
              >
                <i className="fa-solid fa-clock"></i>
                Latest
              </button>
              <button 
                onClick={() => setSortBy("priceLowHigh")}
                className={`menu-sort-btn ${sortBy === "priceLowHigh" ? 'menu-sort-active' : ''}`}
              >
                <i className="fa-solid fa-arrow-up"></i>
                Price: Low → High
              </button>
              <button 
                onClick={() => setSortBy("priceHighLow")}
                className={`menu-sort-btn ${sortBy === "priceHighLow" ? 'menu-sort-active' : ''}`}
              >
                <i className="fa-solid fa-arrow-down"></i>
                Price: High → Low
              </button>
            </div>
          </div>

          {/* CLEAR FILTERS */}
          <button
            onClick={clearFilters}
            className="menu-clear-filters"
          >
            <i className="fa-solid fa-broom"></i>
            Clear All Filters
          </button>

          {/* STATS */}
          <div className="menu-page-stats">
            <div className="menu-stat-item">
              <i className="fa-solid fa-utensils"></i>
              <div>
                <h3>{items.length}</h3>
                <p>Items Found</p>
              </div>
            </div>
            <div className="menu-stat-item">
              <i className="fa-solid fa-filter"></i>
              <div>
                <h3>{selectedCategories.length}</h3>
                <p>Active Filters</p>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="menu-page-main">
          {/* HEADER */}
          <div className="menu-page-header">
            <div className="menu-heading-two">
              <h2>Explore Our Collection</h2>
              <div className="menu-line"></div>
            </div>
            <div className="menu-page-meta">
              <span className="menu-page-info">
                Page {page} of {totalPages}
              </span>
            </div>
          </div>

          {/* GRID */}
          {loadingItems ? (
            <div className="menu-page-loading">
              <div className="menu-loading-spinner">
                <i className="fa-solid fa-utensils fa-spin"></i>
              </div>
              <p>Loading delicious items...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="menu-page-empty">
              <i className="fa-solid fa-plate-wheat"></i>
              <h3>No items found</h3>
              <p>Try adjusting your filters to discover more options</p>
              <button onClick={clearFilters} className="menu-page-button">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="menu-page-grid">
              {items.map((item) => (
                <div key={item._id} className="menu-page-card">
                  <div className="menu-card-image-container">
                    <img src={item.imageURL} alt={item.title} className="menu-card-image" />
                    <div className="menu-card-badge">
                      <i className="fa-solid fa-tag"></i>
                      {item.category || "Special"}
                    </div>
                    <div className="menu-card-overlay">
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="menu-overlay-btn"
                      >
                        <i className="fa-solid fa-eye"></i>
                        Quick View
                      </button>
                    </div>
                  </div>
                  
                  <div className="menu-card-content">
                    <div className="menu-card-header">
                      <h3>{item.title}</h3>
                      <span className="menu-price-tag">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    
                    <p className="menu-card-description">
                      {item.description}
                    </p>
                    
                    <div className="menu-card-rating">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                      <span>(4.5)</span>
                    </div>
                    
                    <div className="menu-card-actions">
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
                        disabled={loading}
                        className="menu-add-to-cart"
                      >
                        <i className="fa-solid fa-cart-plus"></i>
                        {loading ? "Adding..." : "Add to Cart"}
                      </button>
                      
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="menu-reviews-btn"
                      >
                        <i className="fa-solid fa-comment"></i>
                        Reviews
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {items.length > 0 && (
            <div className="menu-page-pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="menu-pagination-btn menu-prev-btn"
              >
                <i className="fa-solid fa-chevron-left"></i>
                Previous
              </button>
              
              <div className="menu-page-numbers">
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
                      className={`menu-page-btn ${page === pageNum ? 'menu-page-active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="menu-pagination-btn menu-next-btn"
              >
                Next
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* REVIEW MODAL */}
      {selectedItem && (
        <ReviewModal
          menuItem={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default MenuPage;