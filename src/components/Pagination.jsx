import React from "react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  pageSize = 10,
  onPageSizeChange = () => {},
  pageSizeOptions = [10, 20, 50],
  maxVisiblePages = 5,
}) => {
  const handleClick = (page, e) => {
    e.preventDefault();
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  // Generate smart page numbers with ellipsis
  const getPages = () => {
    const pages = [];

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      end = Math.min(totalPages, maxVisiblePages);
    }

    if (currentPage + half >= totalPages) {
      start = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // First page + ellipsis
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    // Middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Last page + ellipsis
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
      {/* Pagination */}
      <nav aria-label="Pagination">
        <ul className="pagination mb-0">
          {/* First */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <a
              href="#"
              className="page-link"
              onClick={(e) => handleClick(1, e)}
            >
              First
            </a>
          </li>

          {/* Previous */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <a
              href="#"
              className="page-link"
              onClick={(e) => handleClick(currentPage - 1, e)}
            >
              Previous
            </a>
          </li>

          {/* Page Numbers */}
          {pages.map((page, index) =>
            page === "..." ? (
              <li key={index} className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            ) : (
              <li
                key={index}
                className={`page-item ${page === currentPage ? "active" : ""}`}
              >
                <a
                  href="#"
                  className="page-link"
                  onClick={(e) => handleClick(page, e)}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </a>
              </li>
            ),
          )}

          {/* Next */}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <a
              href="#"
              className="page-link"
              onClick={(e) => handleClick(currentPage + 1, e)}
            >
              Next
            </a>
          </li>

          {/* Last */}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <a
              href="#"
              className="page-link"
              onClick={(e) => handleClick(totalPages, e)}
            >
              Last
            </a>
          </li>
        </ul>
      </nav>

      {/* Page Size Selector */}
      <div className="d-flex align-items-center">
        <label className="me-2 mb-0">Rows per page:</label>
        <select
          className="form-select form-select-sm w-auto"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
