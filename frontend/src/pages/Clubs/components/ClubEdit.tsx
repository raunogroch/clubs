import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { findClubById } from "../../../store/clubsThunks";
import { PopUpMessage, NavHeader, Spinner } from "../../../components";
import { ClubForm } from ".";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import type { AppDispatch, RootState } from "../../../store/store";
import type { pageParamProps } from "../../../interfaces";

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
  }, [dispatch, id]);

  const handleSuccess = () => navigate("/clubs");
  const handleCancel = () => navigate("/clubs");

  if (status === "loading") return <Spinner />;
  if (error) toastr.error(error);

  return (
    <>
      <NavHeader name={name} sub={sub} />
      <PopUpMessage />
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
