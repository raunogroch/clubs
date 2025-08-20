import { Link } from "react-router-dom";
import { NavHeader } from "../../components/NavHeader";
import type { pageParamProps } from "../../interfaces/pageParamProps";
import { ErrorMessage, LoadingIndicator } from "../../components";
import { useSports } from "./hooks/useSports";
import { SportTable } from "./components/SportTable";

export const Sports = ({ name }: pageParamProps) => {
  const { sports, loading, error, deleteSport } = useSports();

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Lista de disciplinas</h5>
                <div className="ibox-tools">
                  <Link
                    to="/sports/create"
                    className="btn btn-rounded btn-outline"
                  >
                    <i className="fa fa-plus"></i> Nueva disciplina
                  </Link>
                </div>
              </div>
              <div className="ibox-content">
                <SportTable sports={sports} onDelete={deleteSport} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
