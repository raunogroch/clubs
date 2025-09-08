import type { pageParamProps } from "../../../interfaces";
import { useClubs } from "../hooks";
import { PopUpMessage, LoadingIndicator, NavHeader } from "../../../components";
import { ClubTable } from ".";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../store/messageSlice";

export const Clubs = ({ name }: pageParamProps) => {
  const { clubs, error, loading, deleteClub } = useClubs();
  const dispatch = useDispatch();

  if (loading) return <LoadingIndicator />;
  if (error) return dispatch(setMessage({ message: error, type: "danger" }));

  return (
    <>
      <NavHeader name={name} pageCreate="Nuevo club" />
      <PopUpMessage />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Lista de clubs</h5>
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
