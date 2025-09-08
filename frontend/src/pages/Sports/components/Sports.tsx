import type { pageParamProps } from "../../../interfaces";
import { useSports } from "../hooks";
import {
  Input,
  LoadingIndicator,
  NavHeader,
  PopUpMessage,
} from "../../../components";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../store/messageSlice";
import { SportTable } from "./SportTable";

export const Sports = ({ name }: pageParamProps) => {
  const {
    sports,
    loading,
    error,
    deleteSport,
    name: filterName,
    handleNameChange,
    page,
    handlePageChange,
    limit,
    handleLimitChange,
  } = useSports();
  const dispatch = useDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    handleNameChange(value);
  };

  useEffect(() => {
    if (error) {
      dispatch(setMessage({ message: error, type: "warning" }));
    }
  }, [error, dispatch]);

  if (loading) return <LoadingIndicator />;

  const totalPages = Math.ceil(sports.total / sports.limit);

  return (
    <>
      <NavHeader name={name} pageCreate="Nueva disciplina" />
      <PopUpMessage />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Lista de disciplinas</h5>
              </div>
              <div className="ibox-content">
                <div style={{ maxWidth: 300, marginBottom: 16 }}>
                  <Input
                    type="text"
                    placeholder="Buscar en la lista..."
                    className="form-control"
                    value={filterName}
                    onChange={handleInputChange}
                  />
                </div>
                <SportTable sports={sports.data} onDelete={deleteSport} />
                {/* Controles de paginación y límite */}
                <div
                  className="pagination-controls"
                  style={{
                    marginTop: 20,
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <button
                    className="btn btn-outline btn-primary"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    <i className="fa fa-arrow-left"></i>
                  </button>
                  <span style={{ alignSelf: "center" }}>
                    Página {page} de {totalPages}
                  </span>
                  <button
                    className="btn btn-outline btn-primary"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                  >
                    <i className="fa fa-arrow-right"></i>
                  </button>
                  <select
                    value={limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="form-control"
                    style={{ width: 80 }}
                  >
                    <option value={1}>1</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
