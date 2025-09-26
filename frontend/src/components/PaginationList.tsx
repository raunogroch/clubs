import { useDispatch } from "react-redux";
import { setPage } from "../store/filterSlice";

/* 
  En filter tiene que ir el objeto con pafinacion 
  
  const { users, status, error } = useSelector(
    (state: RootState) => state.users
  );

  usar la variable users asi:
  <PaginationList filter={users} />
*/

export const PaginationList = ({ filter }) => {
  const dispatch = useDispatch();

  const totalPages = Math.max(1, Math.ceil(filter.total / filter.limit));

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const getPageNumbers = () => {
    const maxVisible = 5;
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (filter.page > 3) pages.push("...");

      const start = Math.max(2, filter.page - 1);
      const end = Math.min(totalPages - 1, filter.page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (filter.page < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null; // No mostrar paginación si solo hay una página

  return (
    <div className="pagination d-flex justify-content-center mt-3">
      <button
        className="btn btn-white"
        disabled={filter.page === 1}
        onClick={() => handlePageChange(filter.page - 1)}
      >
        <i className="fa fa-angle-left"></i>
      </button>

      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="mx-2 align-self-center">
            ...
          </span>
        ) : (
          <button
            key={`page-${page}-${idx}`} // Key única combinando página e índice
            className={`btn btn-white mx-1 ${
              filter.page === page ? "active" : ""
            }`}
            onClick={() => handlePageChange(Number(page))}
          >
            {page}
          </button>
        )
      )}

      <button
        className="btn btn-white"
        disabled={filter.page === totalPages}
        onClick={() => handlePageChange(filter.page + 1)}
      >
        <i className="fa fa-angle-right"></i>
      </button>
    </div>
  );
};
