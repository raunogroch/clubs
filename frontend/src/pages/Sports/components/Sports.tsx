import { Link } from "react-router-dom";
import type { pageParamProps } from "../../../interfaces";
import { useSports } from "../hooks";
import { ErrorMessage, LoadingIndicator, NavHeader } from "../../../components";
import { SportTable } from "./SportTable";

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
