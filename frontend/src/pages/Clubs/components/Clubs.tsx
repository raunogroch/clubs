import type { pageParamProps } from "../../../interfaces";
import {
  PopUpMessage,
  NavHeader,
  Spinner,
  StaticMessage,
} from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchClubs } from "../../../store/clubsThunks";
import type { AppDispatch } from "../../../store/store";
import { ClubList } from "./ClubList";

export const Clubs = ({ name }: pageParamProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { clubs, error, status } = useSelector((state: any) => state.clubs);

  useEffect(() => {
    dispatch(fetchClubs());
  }, [dispatch]);

  return (
    <>
      <NavHeader name={name} pageCreate="Nuevo club" />
      <PopUpMessage />
      {status === "loading" && <Spinner />}
      {error && <StaticMessage message={error} type="danger" />}

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
