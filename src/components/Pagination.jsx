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
  const safeTotalPages = Math.max(1, Number.isFinite(totalPages) ? Number(totalPages) : 1);
  const safeCurrentPage = Math.min(Math.max(1, Number.isFinite(currentPage) ? Number(currentPage) : 1), safeTotalPages);

  const handleClick = (page, e) => {
    e.preventDefault();
    if (page < 1 || page > safeTotalPages || page === safeCurrentPage) return;
    onPageChange(page);
  };

  const getPages = () => {
    const pages = [];
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, safeCurrentPage - half);
    let end = Math.min(safeTotalPages, safeCurrentPage + half);

    if (safeCurrentPage <= half) {
      end = Math.min(safeTotalPages, maxVisiblePages);
    }

    if (safeCurrentPage + half >= safeTotalPages) {
      start = Math.max(1, safeTotalPages - maxVisiblePages + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    if (end < safeTotalPages) {
      if (end < safeTotalPages - 1) pages.push("...");
      pages.push(safeTotalPages);
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
      <nav aria-label="Pagination">
        <ul className="pagination mb-0">
          <li className={`page-item ${safeCurrentPage === 1 ? "disabled" : ""}`}>
            <a href="#" className="page-link" onClick={(e) => handleClick(1, e)}>
              First
            </a>
          </li>

          <li className={`page-item ${safeCurrentPage === 1 ? "disabled" : ""}`}>
            <a href="#" className="page-link" onClick={(e) => handleClick(safeCurrentPage - 1, e)}>
              Previous
            </a>
          </li>

          {pages.map((page, index) =>
            page === "..." ? (
              <li key={`${page}-${index}`} className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            ) : (
              <li key={`${page}-${index}`} className={`page-item ${page === safeCurrentPage ? "active" : ""}`}>
                <a
                  href="#"
                  className="page-link"
                  onClick={(e) => handleClick(page, e)}
                  aria-current={page === safeCurrentPage ? "page" : undefined}
                >
                  {page}
                </a>
              </li>
            ),
          )}

          <li className={`page-item ${safeCurrentPage === safeTotalPages ? "disabled" : ""}`}>
            <a href="#" className="page-link" onClick={(e) => handleClick(safeCurrentPage + 1, e)}>
              Next
            </a>
          </li>

          <li className={`page-item ${safeCurrentPage === safeTotalPages ? "disabled" : ""}`}>
            <a href="#" className="page-link" onClick={(e) => handleClick(safeTotalPages, e)}>
              Last
            </a>
          </li>
        </ul>
      </nav>

      <div className="d-flex align-items-center">
        <label className="me-2 mb-0 text-secondary small">Rows per page:</label>
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
