import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useClubs } from "../hooks";
import { PopUpMessage, LoadingIndicator, NavHeader } from "../../../components";
import { ClubForm } from ".";
import { setMessage } from "../../../store";
import type { pageParamProps } from "../../../interfaces";
import type { Club } from "../interfaces";

export const ClubEdit = ({ name, sub }: pageParamProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const { getClubById } = useClubs();

  useEffect(() => {
    setLoading(true);
    getClubById(id)
      .then((data) => {
        setClub(data);
      })
      .catch(() => {
        dispatch(
          setMessage({
            message: "Error al cargar el club",
            type: "danger",
          })
        );
        //
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

  return (
    <>
      <NavHeader name={name} sub={sub} />
      <PopUpMessage />
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
