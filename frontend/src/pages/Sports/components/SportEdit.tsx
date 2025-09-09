import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Sport } from "../interfaces";
import { useSports } from "../hooks";
import { PopUpMessage, LoadingIndicator, NavHeader } from "../../../components";
import { SportForm } from ".";
import type { pageParamProps } from "../../../interfaces";

import { useDispatch } from "react-redux";
import { setMessage } from "../../../store/messageSlice";

export const SportEdit = ({ name, sub }: pageParamProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sport, setSport] = useState<Sport | null>(null);
  const [loading, setLoading] = useState(true);

  const { getSportById } = useSports();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    getSportById(id)
      .then((data) => setSport(data))
      .catch(() => {
        dispatch(
          setMessage({
            message: "Error al cargar las disciplinas",
            type: "danger",
          })
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

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

  if (loading) return <LoadingIndicator />;

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
                    <SportForm
                      initialData={sport}
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
    </>
  );
};
