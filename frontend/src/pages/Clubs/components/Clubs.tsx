import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PopUpMessage, NavHeader, Spinner } from "../../../components";
import { fetchClubs } from "../../../store/clubsThunks";
import { ClubList } from "./ClubList";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import type { AppDispatch } from "../../../store";
import type { pageParamProps } from "../../../interfaces";

export const Clubs = ({ name }: pageParamProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { clubs, error, status } = useSelector((state: any) => state.clubs);

  useEffect(() => {
    dispatch(fetchClubs());
  }, [dispatch]);

  if (status === "loading") return <Spinner />;
  if (error) toastr.error(error);

  return (
    <>
      <NavHeader name={name} pageCreate="Nuevo club" />
      <PopUpMessage />
      {status === "succeeded" && (
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-12">
              <div className="ibox ">
                <div className="ibox-title">
                  <h5>Lista de clubs</h5>
                </div>
                <div className="ibox-content">
                  <ClubList clubs={clubs} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
