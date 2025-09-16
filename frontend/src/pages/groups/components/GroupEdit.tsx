import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PopUpMessage, NavHeader } from "../../../components";
import type { pageParamProps } from "../../../interfaces";
import type { AppDispatch, RootState } from "../../../store/store";
import { GroupForm } from "./GroupForm";
import { findGroupById } from "../../../store/groupsThunks";

export const GroupEdit = ({ name, sub, sub1 }: pageParamProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { clubId, groupId } = useParams<{ clubId: string; groupId: string }>();
  const {
    selectedGroup: group,
    error,
    status,
  } = useSelector((state: RootState) => state.groups);

  useEffect(() => {
    dispatch(findGroupById({ clubId, groupId }));
  }, [groupId, dispatch]);

  const handleSuccess = () => {
    navigate(`/clubs/${clubId}/groups`);
  };

  const handleCancel = () => {
    navigate(`/clubs/${clubId}/groups`);
  };

  return (
    <>
      <NavHeader name={name} sub={sub} sub1={sub1} />
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
                    {error && <div className="alert alert-danger">{error}</div>}
                    {status === "succeeded" && (
                      <GroupForm
                        initialData={group}
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
