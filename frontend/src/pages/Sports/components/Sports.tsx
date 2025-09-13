import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavHeader, PopUpMessage } from "../../../components";
import type { pageParamProps } from "../../../interfaces";
import { type AppDispatch } from "../../../store";
import { SportTable } from ".";
import { fetchSports } from "../../../store/sportsThunks";

export const Sports = ({ name }: pageParamProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { sports, error, status } = useSelector((state: any) => state.sports);

  useEffect(() => {
    dispatch(fetchSports());
  }, [dispatch]);

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
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                {status === "succeeded" && <SportTable sports={sports} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
