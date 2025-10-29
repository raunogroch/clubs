import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { findGroupById } from "../../../store/groupsThunks";
import { GroupForm } from "./GroupForm";
import { GroupAthletes } from "./GroupAthletes";
import { NavHeader, Spinner } from "../../../components";
import type { AppDispatch, RootState } from "../../../store";
import type { pageParamProps } from "../../../interfaces";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

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
  }, [dispatch, clubId, groupId]);

  const handleSuccess = () => navigate(`/clubs/${clubId}/groups`);
  const handleCancel = () => navigate(`/clubs/${clubId}/groups`);

  if (error) toastr.error(error);

  return (
    <>
      <NavHeader name={name} sub={sub} sub1={sub1} />
      {status === "loading" && <Spinner />}
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
                      <GroupForm
                        initialData={group}
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                      />
                      <div className="m-t-md">
                        <GroupAthletes name="Administrar atletas" />
                      </div>
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
