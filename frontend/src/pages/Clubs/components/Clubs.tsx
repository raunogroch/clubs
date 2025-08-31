import { Link } from "react-router-dom";
import type { pageParamProps } from "../../../interfaces";
import { useClubs } from "../hooks";
import { ErrorMessage, LoadingIndicator, NavHeader } from "../../../components";
import { ClubTable } from ".";

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
                    to="/clubs/create"
                    className="btn btn-rounded btn-outline"
                  >
                    <i className="fa fa-plus"></i> Nuevo club
                  </Link>
                </div>
              </div>
              <div className="ibox-content">
                <ClubTable
                  clubs={clubs.map((club) => ({
                    ...club,
                    schedule:
                      typeof club.schedule === "string"
                        ? { _id: "", startTime: club.schedule, endTime: "" }
                        : club.schedule,
                    discipline:
                      typeof club.discipline === "string"
                        ? { _id: "", name: club.discipline }
                        : club.discipline,
                  }))}
                  onDelete={deleteClub}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
