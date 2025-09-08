import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { userService } from "../../../services/userService";
import { LoadingIndicator, NavHeader, PopUpMessage } from "../../../components";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../store/messageSlice";
import type { UsersPageProps } from "../interfaces/userTypes";
import { UserForm } from "./UserForm";

export const UserEdit = ({ name, sub }: UsersPageProps) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getById(id!);
        if (response.data) {
          setUser(response.data);
        } else {
          dispatch(
            setMessage({
              message: "Usuario no encontrado",
              type: "warning",
            })
          );
          navigate("/users");
        }
      } catch (err) {
        dispatch(
          setMessage({
            message: "Error al cargar al usuario",
            type: "danger",
          })
        );
        navigate("/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSuccess = () => {
    navigate("/users");
  };

  const handleCancel = () => {
    navigate("/users");
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
                <h5>Editar Usuario</h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-sm-12">
                    <UserForm
                      initialData={user}
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
