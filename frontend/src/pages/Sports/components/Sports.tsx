import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { LoadingIndicator, NavHeader, PopUpMessage } from "../../../components";
import type { pageParamProps } from "../../../interfaces";
import { setMessage } from "../../../store";
import { useSports } from "../hooks";
import { SportTable } from ".";

export const Sports = ({ name }: pageParamProps) => {
  const { sports, loading, error, deleteSport } = useSports();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      dispatch(setMessage({ message: error, type: "warning" }));
    }
  }, [error, dispatch]);

  if (loading) return <LoadingIndicator />;

  return (
    <>
      <NavHeader name={name} pageCreate="Nueva disciplina" />
      <PopUpMessage />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row justify-content-center">
          <div className="col-6">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Lista de disciplinas</h5>
              </div>
              <div className="ibox-content">
                <SportTable sports={sports.data} onDelete={deleteSport} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
