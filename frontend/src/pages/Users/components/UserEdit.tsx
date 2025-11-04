import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { NavHeader, Spinner } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { UserForm } from "./UserForm";
import { findUserById } from "../../../store/usersThunks";
import type { AppDispatch, RootState } from "../../../store";
import type { User, UsersPageProps } from "../../../interfaces";

export const UserEdit = ({ name: namePage, sub }: UsersPageProps) => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedUser: user,
    error,
    status,
  } = useSelector((state: RootState) => state.users);

  const navigate = useNavigate();
  const location = useLocation();
  const roleLocation = location.pathname.split("/")[2];

  useEffect(() => {
    dispatch(findUserById(id));
  }, [dispatch, id]);

  const handleSuccess = () => {
    navigate(`/users/${roleLocation}`);
  };

  const handleCancel = () => {
    navigate(`/users/${roleLocation}`);
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
                      <UserForm
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
