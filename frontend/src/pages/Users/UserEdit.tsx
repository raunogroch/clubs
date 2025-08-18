import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { NavHeader, LoadingIndicator, ErrorMessage } from "../../components";
import type { UsersPageProps } from "./types/userTypes";
import { UserForm } from "./components/UserForm";

export const UserEdit = ({ name, sub }: UsersPageProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getById(id!);
        if (response.data) {
          setUser(response.data);
        } else {
          setError("Usuario no encontrado");
        }
      } catch (err) {
        setError("Error al cargar el usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSuccess = () => {
    navigate("/users", {
      state: {
        message: "El usuario fue actualizado exitosamente",
        messageKind: "success",
      },
    });
  };

  const handleCancel = () => {
    navigate("/users");
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <NavHeader name={name} sub={sub} />
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
