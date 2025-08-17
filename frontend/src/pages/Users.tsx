import { Link, useLocation } from "react-router-dom";
import { useUsers } from "../hooks/useUsers.ts";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { NavHeader } from "../components/NavHeader.tsx";
import { UsersTable } from "../components/UsersTable.tsx";
import { LoadingIndicator } from "../components/LoadingIndicator.tsx";
import { CustomMessage } from "../components/CustomMessage.tsx";
import { useEffect, useState } from "react";

interface UsersPageProps {
  name: string;
}

interface NavigationState {
  message?: string;
  messageKind?: "success" | "error" | "warning" | "info";
}

export const Users = ({ name }: UsersPageProps) => {
  const { users, loading, error } = useUsers();
  const location = useLocation();
  const [message, setMessage] = useState<{
    text: string;
    kind: "success" | "error" | "warning" | "info";
  } | null>(null);

  useEffect(() => {
    if (location.state) {
      const state = location.state as NavigationState;
      if (state.message && state.messageKind) {
        setMessage({
          text: state.message,
          kind: state.messageKind,
        });

        window.history.replaceState({}, document.title);

        const timer = setTimeout(() => {
          setMessage(null);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [location.state]);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <NavHeader name={name} />

      {message && (
        <div className="container my-1">
          <CustomMessage message={message.text} kind={message.kind} />
        </div>
      )}

      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Basic Table</h5>
                <div className="ibox-tools">
                  <Link
                    to="/users/create"
                    className=" btn btn-rounded btn-outline"
                  >
                    <i className="fa fa-plus"></i> Nuevo Usuario
                  </Link>
                </div>
              </div>
              <div className="ibox-content">
                <UsersTable users={users} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
