import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEntities } from "../../../store/entitiesThunks";
import { NavHeader, PopUpMessage } from "../../../components";
import { GroupForm } from "./GroupForm";
import type { AppDispatch } from "../../../store";
import type { pageParamProps } from "../../../interfaces";

export const GroupsNew = ({
  name,
  sub,
  sub1,
}: pageParamProps & { sub1?: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { clubId } = useParams();

  useEffect(() => {
    dispatch(fetchEntities());
  }, [dispatch]);

  const handleSuccess = () => navigate(`/clubs/${clubId}/groups`);
  const handleCancel = () => navigate(`/clubs/${clubId}/groups`);

  return (
    <>
      <NavHeader name={name} sub={sub} sub1={sub1} />
      <PopUpMessage />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Crear Nuevo Usuario</h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-sm-12">
                    <GroupForm
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
