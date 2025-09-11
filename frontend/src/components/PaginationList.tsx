import { useDispatch } from "react-redux";
import { setPage } from "../store/filterSlice";

export const PaginationList = ({ filter }) => {
  const dispatch = useDispatch();

  console.log("Filter in PaginationList:", filter.total, filter.limit); // Depuración
  const totalPages = Math.ceil(filter.total / filter.limit);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };
  const getPageNumbers = () => {
    const maxVisible = 5; // Máximo de botones visibles
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      // Si hay pocas páginas, muestro todas
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Siempre muestro primera página
      pages.push(1);

      // Si la página actual está lejos del inicio, muestro "..."
      if (filter.page > 3) pages.push("...");

      // Páginas alrededor de la actual
      const start = Math.max(2, filter.page - 1);
      const end = Math.min(totalPages - 1, filter.page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      // Si la página actual está lejos del final, muestro "..."
      if (filter.page < totalPages - 2) pages.push("...");

      // Siempre muestro última página
      pages.push(totalPages);
    }

    return pages;
  };
  return (
    <div className="pagination d-flex justify-content-center mt-3">
      <button
        className="btn btn-white"
        disabled={filter.page === 1}
        onClick={() => handlePageChange(filter.page - 1)}
      >
        Anterior
      </button>

      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="mx-2 align-self-center">
            ...
          </span>
        ) : (
          <button
            key={page}
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
        Siguiente
      </button>
    </div>
  );
};
