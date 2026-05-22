import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function Donor(props) {
  const navigate = useNavigate();

  const {
    categories = ["All"],
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    currentProducts = [],
    currentPage,
    totalPages,
    paginate,
  } = props;

  return (
    <div className="home-page">

      <section className="category-section container mt-5" style={{ marginTop: "100px" }}>
        <h2 className="category-heading mb-4">Explore by Category</h2>

        <div className="category-bar d-flex flex-wrap gap-3 justify-content-start">
          <div
            className={`cat-pill ${selectedCategory === "All" ? "active" : ""}`}
            onClick={() => setSelectedCategory("All")}
          >
            <div className="cat-label">All</div>
          </div>

          {categories
            .filter((c) => c && c !== "All")
            .slice(0, 7)
            .map((cat) => (
              <div
                key={cat}
                className={`cat-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <div className="cat-label">{cat}</div>
              </div>
            ))}

          {categories.length > 7 && (
            <select
              className="form-select more-cats"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="products-grid container mt-5">
        <div className="row g-4 justify-content-start">
          {currentProducts.length > 0 ? (
            currentProducts.map((item, i) => (
              <div
                key={`${item.receiverId}-${i}`}
                className="col-6 col-sm-6 col-md-4 col-lg-3 d-flex"
              >
                <div
                  className="card shadow-sm border-0 p-2 product-card w-100"
                  onClick={() => navigate(item.seoURL)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={item.ImageResolved || "/images/default.png"}
                    alt={item.name}
                    className="img-fluid rounded-3 mb-2 product-thumb"
                    loading="lazy"
                    onError={(e) => {
                      if (!e.target.src.endsWith("/images/default.png"))
                        e.target.src = "/images/default.png";
                    }}
                  />

                  <p className="fw-bold product-title">{item.name}</p>

                  <div className="product-tags">
                    {item.category && <span className="badge small me-1">{item.category}</span>}
                    {item.helpType && <span className="badge small">{item.helpType}</span>}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted mt-4 text-center">
              No records found matching your search.
            </p>
          )}
        </div>
      </section>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 my-5 flex-wrap container">
          <button
            className="btn btn-outline-gold"
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`btn ${
                currentPage === i + 1 ? "btn-gold text-white" : "btn-outline-gold"
              }`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-outline-gold"
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
