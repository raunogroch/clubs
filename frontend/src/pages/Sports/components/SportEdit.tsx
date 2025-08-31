import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { pageParamProps } from "../../../interfaces";
import type { Sport } from "../interfaces";
import { useSports } from "../hooks";
import { ErrorMessage, LoadingIndicator, NavHeader } from "../../../components";
import { SportForm } from ".";

export const SportEdit = ({ name, sub }: pageParamProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sport, setSport] = useState<Sport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getSportById } = useSports();

  useEffect(() => {
    setLoading(true);
    getSportById(id)
      .then((data) => {
        setSport(data);
      })
      .catch(() => {
        setError("Error al cargar las disciplinas");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSuccess = () => {
    navigate("/sports", {
      state: {
        message: "La disciplina fue actualizado exitosamente",
        messageKind: "success",
      },
    });
  };

  const handleCancel = () => {
    navigate("/sports");
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <NavHeader name={name} sub={sub} />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
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
