import { useNavigate, useParams } from "react-router-dom";
import { GroupForm } from "./GroupForm";
import { NavHeader } from "../../../components";
import type { pageParamProps } from "../../../interfaces";
import "toastr/build/toastr.min.css";

export const GroupEdit = ({ name, sub, sub1 }: pageParamProps) => {
  const navigate = useNavigate();
  const { clubId, groupId } = useParams<{ clubId: string; groupId: string }>();

  const handleSuccess = () => navigate(`/clubs/${clubId}/groups`);
  const handleCancel = () => navigate(`/clubs/${clubId}/groups`);

  return (
    <>
      <NavHeader name={name} sub={sub} sub1={sub1} />

      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Editar Grupo</h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-sm-12">
                    <GroupForm
                      clubId={clubId}
                      groupId={groupId}
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
