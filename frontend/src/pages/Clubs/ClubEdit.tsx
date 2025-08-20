import { useNavigate, useParams } from "react-router-dom";
import type { pageParamProps } from "../../interfaces/pageParamProps";
import { useClubs } from "./hooks/useClub";
import { ClubForm } from "./components/ClubForm";
import { useEffect, useState } from "react";
import { ErrorMessage, LoadingIndicator, NavHeader } from "../../components";
import type { Club } from "./types/clubTypes";

export const ClubEdit = ({ name, sub }: pageParamProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getClubById } = useClubs();

  useEffect(() => {
    setLoading(true);
    getClubById(id)
      .then((data) => {
        setClub(data);
      })
      .catch(() => {
        setError("Error al cargar el club");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSuccess = () => {
    navigate("/clubs", {
      state: {
        message: "El club fue actualizado exitosamente",
        messageKind: "success",
      },
    });
  };

  const handleCancel = () => {
    navigate("/clubs");
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
    </>
  );
};
