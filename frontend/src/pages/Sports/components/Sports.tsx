import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavHeader, Spinner } from "../../../components";
import type { pageParamProps } from "../../../interfaces";
import { type AppDispatch } from "../../../store";
import { SportTable } from ".";
import { fetchSports } from "../../../store/sportsThunks";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export const Sports = ({ name }: pageParamProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { sports, error, status } = useSelector((state: any) => state.sports);

  useEffect(() => {
    dispatch(fetchSports());
  }, [dispatch]);

  if (error) toastr.error(error);
  return (
    <>
      <NavHeader name={name} pageCreate="Nueva disciplina" />
      {status === "loading" && <Spinner />}
      {status === "succeeded" && sports.length === 0 && (
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold">No hay disciplinas para mostrar</h3>
            <div className="error-desc">
              Actualmente no tienes informacion en esta seccion.
            </div>
          </div>
        </div>
      )}
      {status === "succeeded" && sports.length > 0 && (
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
                  <SportTable sports={sports} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
