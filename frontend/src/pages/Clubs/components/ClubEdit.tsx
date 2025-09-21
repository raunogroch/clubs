import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  PopUpMessage,
  NavHeader,
  Spinner,
  StaticMessage,
} from "../../../components";
import { ClubForm } from ".";
import type { pageParamProps } from "../../../interfaces";
import { findClubById } from "../../../store/clubsThunks";
import type { AppDispatch, RootState } from "../../../store/store";

export const ClubEdit = ({ name, sub }: pageParamProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const {
    selectedClub: club,
    error,
    status,
  } = useSelector((state: RootState) => state.clubs);

  useEffect(() => {
    dispatch(findClubById(id));
  }, [id, dispatch]);

  const handleSuccess = () => {
    navigate("/clubs");
  };

  const handleCancel = () => {
    navigate("/clubs");
  };

  return (
    <>
      <NavHeader name={name} sub={sub} />
      <PopUpMessage />
      {status === "loading" && <Spinner />}
      {error && <StaticMessage message={error} type="danger" />}
      {status === "succeeded" && (
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-12">
              <div className="ibox ">
                <div className="ibox-title">
                  <h5>Editar Club</h5>
                </div>
                <div className="ibox-content">
                  <div className="row">
                    <div className="col-sm-12">
                      <ClubForm
                        initialData={club}
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
