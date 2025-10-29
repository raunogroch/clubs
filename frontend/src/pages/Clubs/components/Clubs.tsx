import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavHeader, Spinner } from "../../../components";
import { fetchClubs } from "../../../store/clubsThunks";
import { ClubList } from "./ClubList";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import type { AppDispatch } from "../../../store";

interface ClubsProps {
  name?: string;
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
}

export const Clubs = ({
  name,
  create,
  edit,
  delete: canDelete,
}: ClubsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { clubs, error, status } = useSelector((state: any) => state.clubs);

  useEffect(() => {
    dispatch(fetchClubs());
  }, [dispatch]);

  if (error) toastr.error(error);

  return (
    <>
      <NavHeader name={name} pageCreate={create ? "Nuevo club" : undefined} />
      {status === "loading" && <Spinner />}
      {status === "succeeded" && clubs.length === 0 && (
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold">No hay clubes para mostrar</h3>
            <div className="error-desc">
              Actualmente no tienes informacion en esta seccion.
            </div>
          </div>
        </div>
      )}
      {status === "succeeded" && clubs.length > 0 && (
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-12">
              <div className="ibox ">
                <div className="ibox-title">
                  <h5>Lista de clubs</h5>
                </div>
                <div className="ibox-content">
                  <ClubList clubs={clubs} edit={edit} delete={canDelete} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
