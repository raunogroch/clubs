import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { UserAdmin } from "../interfaces/user";
import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";
import { DashboardContent } from "./DashboardAdmin/DashboardContent";
import { UnassignedMessage } from "./DashboardAdmin/UnassignedMessage";

export const DashboardAdmin = ({ name }: pageParamProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const hasAssignment =
    user?.role === "admin"
      ? (user as UserAdmin).assignment_id !== null &&
        (user as UserAdmin).assignment_id !== undefined
      : true;

  if (user?.role === "admin" && !hasAssignment) {
    return (
      <>
        <NavHeader name={name} />
        <UnassignedMessage />
      </>
    );
  }

  return (
    <>
      <NavHeader name={name} />
      <DashboardContent user={user} />
    </>
  );
};
