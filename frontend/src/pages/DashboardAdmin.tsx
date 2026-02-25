import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";
import { DashboardContent } from "./DashboardAdmin/DashboardContent";
import { UnassignedMessage } from "./DashboardAdmin/UnassignedMessage";
import useAssignmentStatus from "../customHooks/useAssignmentStatus";

export const DashboardAdmin = ({ name }: pageParamProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { checking, forbidden } = useAssignmentStatus(user);

  console.log("DashboardAdmin render - assignment status:", {
    user,
    checking,
    forbidden,
  });

  if (!user) return null;

  if (checking) {
    return (
      <>
        <NavHeader name={name} />
        <div className="middle-box text-center animated fadeInRightBig">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </>
    );
  }

  if (forbidden) {
    return (
      <>
        <NavHeader name={name} />
        <UnassignedMessage />
      </>
    );
  }

  // status === 'ok' or 'error' — en caso de 'error' permitimos renderizar el dashboard
  return (
    <>
      <NavHeader name={name} />
      <DashboardContent user={user} />
    </>
  );
};
