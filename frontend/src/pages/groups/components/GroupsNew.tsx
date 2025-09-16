import { useNavigate } from "react-router-dom";
import { NavHeader, PopUpMessage } from "../../../components";
import { GroupForm } from "./GroupForm";
import type { pageParamProps } from "../../../interfaces";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchEntities } from "../../../store/entitiesThunks";
import type { AppDispatch } from "../../../store/store";

export const GroupsNew = ({
  name,
  sub,
  sub1,
}: pageParamProps & { sub1?: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/clubs");
  };

  const handleCancel = () => {
    navigate("/clubs");
  };

  useEffect(() => {
    dispatch(fetchEntities());
  }, [dispatch]);

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
