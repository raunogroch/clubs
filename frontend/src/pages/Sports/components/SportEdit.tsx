import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PopUpMessage, NavHeader } from "../../../components";
import { SportForm } from ".";
import type { pageParamProps } from "../../../interfaces";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../../store/messageSlice";
import { findSportById } from "../../../store/sportsThunks";
import type { AppDispatch } from "../../../store/store";

export const SportEdit = ({ name, sub }: pageParamProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const {
    selectedSport: sport,
    error,
    status,
  } = useSelector((state: any) => state.sports);

  useEffect(() => {
    dispatch(findSportById(id)).unwrap();
  }, [dispatch, id]);

  const handleSuccess = () => {
    dispatch(
      setMessage({
        message: "La disciplina fue actualizada exitosamente",
        type: "success",
      })
    );
    navigate("/sports");
  };

  const handleCancel = () => {
    navigate("/sports");
  };

  return (
    <>
      <NavHeader name={name} sub={sub} />
      <PopUpMessage />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row justify-content-center">
          <div className="col-6">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Editar la disciplina</h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-sm-12">
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    {status === "succeeded" && (
                      <SportForm
                        initialData={sport}
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
