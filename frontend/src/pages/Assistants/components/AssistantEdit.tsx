import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { NavHeader, Spinner } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { findUserById } from "../../../store/usersThunks";
import type { AppDispatch, RootState } from "../../../store";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import type { User, UsersPageProps } from "../../../interfaces";
import AssistantForm from "./AssistantForm";

export const AssistantEdit = ({ name: namePage, sub }: UsersPageProps) => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedUser: user,
    error,
    status,
  } = useSelector((state: RootState) => state.users);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(findUserById(id));
  }, [dispatch, id]);

  const handleSuccess = () => {
    navigate("/users/assistants");
  };

  const handleCancel = () => {
    navigate("/users/assistants");
  };

  if (error) toastr.error(error);
  return (
    <>
      <NavHeader name={namePage} sub={sub} />
      {status === "loading" && <Spinner />}
      {status === "succeeded" && (
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-12">
              <div className="ibox ">
                <div className="ibox-title">
                  <h5>Editar Usuario</h5>
                </div>
                <div className="ibox-content">
                  <div className="row">
                    <div className="col-sm-12">
                      <AssistantForm
                        user={user as User}
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
      )}
    </>
  );
};
