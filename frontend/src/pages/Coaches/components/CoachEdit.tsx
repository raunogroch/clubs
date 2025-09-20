import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { NavHeader, PopUpMessage } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import type { User, UsersPageProps } from "../interfaces/userTypes";
import { CoachForm } from "./CoachForm";
import { findUserById } from "../../../store/usersThunks";
import type { AppDispatch, RootState } from "../../../store";

export const CoachEdit = ({ name: namePage, sub }: UsersPageProps) => {
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
    navigate("/users/coaches");
  };

  const handleCancel = () => {
    navigate("/users/coaches");
  };

  return (
    <>
      <NavHeader name={namePage} sub={sub} />
      <PopUpMessage />
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
                    {status === "loading" && (
                      <div className="text-center">
                        <div className="spinner-border" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    )}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {status === "succeeded" && (
                      <CoachForm
                        user={user as User}
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
