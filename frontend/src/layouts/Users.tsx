// Users.tsx
import { useEffect, useState } from "react";
import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";
import api from "../services/api";

interface User {
  _id: string;
  ci: string;
  name: string;
  lastname: string;
  birth_date: string;
  roles: string[];
}

export const Users = ({ name }: pageParamProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Obtener los usuarios de la API
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users"); // Ajusta la ruta según tu API
        console.log(response.data);

        setUsers(response.data);
      } catch (err) {
        setError("Error al cargar los usuarios");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      <NavHeader name={name} />

      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Lista de Usuarios</h5>
              </div>
              <div className="ibox-content">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Usuario</th>
                      <th>Roles</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((user) => !user.roles.includes("superadmin"))
                      .map((user) => (
                        <tr key={user._id}>
                          <td>{user.ci}</td>
                          <td>{user.name}</td>
                          <td>{user.lastname}</td>
                          <td>{user.birth_date}</td>
                          <td>{user.roles.join(", ")}</td>
                          <td>
                            <button
                              className="btn btn-success btn-circle"
                              type="button"
                            >
                              <i className="fa fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-danger btn-circle"
                              type="button"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
