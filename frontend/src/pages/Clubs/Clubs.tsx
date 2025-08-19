import { Link } from "react-router-dom";
import { NavHeader } from "../../components/NavHeader";
import type { pageParamProps } from "../../interfaces/pageParamProps";
import { ErrorMessage, LoadingIndicator } from "../../components";
import { useClubs } from "./hooks/useClubs";
import { ClubTable } from "./components/ClubTable";

export const Clubs = ({ name }: pageParamProps) => {
  const { clubs, loading, error, deleteClub } = useClubs();

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
                <h5>Lista de clubs</h5>
                <div className="ibox-tools">
                  <Link
                    to="/users/create"
                    className="btn btn-rounded btn-outline"
                  >
                    <i className="fa fa-plus"></i> Nuevo club
                  </Link>
                </div>
              </div>
              <div className="ibox-content">
                <ClubTable clubs={clubs} onDelete={deleteClub} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
