import { NavHeader } from "../../components/NavHeader";
import type { pageParamProps } from "../../interfaces/pageParamProps";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store";
import { useEffect } from "react";
import { fetchUser } from "../../store/coachThunks";
import { Image, Spinner } from "../../components";

export const DashboardAssistant = ({ name }: pageParamProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = JSON.parse(localStorage.getItem("user")).code;
  const { selectedUser, status, error } = useSelector(
    (state: any) => state.coach
  );

  useEffect(() => {
    dispatch(fetchUser({ userId }));
  }, [dispatch]);

  if (status === "loading") <Spinner />;

  if (error) return <div>Error: {error}</div>;

  if (!selectedUser) return <div>No user data available.</div>;

  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content animated fadeInRight">
        {Array.isArray(selectedUser) &&
          selectedUser.map((data) => (
            <div className="row" key={data.club._id}>
              <div className="col-lg-12">
                <div className="ibox">
                  <div className="ibox-title">
                    <strong className="m-l-xs">Club: {data.club.name}</strong>
                    <span className="badge badge-info m-l-sm">
                      {data.groups.length} grupos
                    </span>
                  </div>
                  <div className="ibox-content" style={{ display: "block" }}>
                    <div className="row">
                      <div className="col-md-2 text-center">
                        <Image
                          src={data.club.image}
                          alt={data.club.name}
                          className="rounded-circle"
                          width="70%"
                        />
                        <div>
                          <br />
                          Disciplina: <strong>{data.club.sport.name}</strong>
                        </div>
                      </div>
                      <div className="col-md-10">
                        {data.groups.map((group: any) => (
                          <div className="panel panel-default" key={group._id}>
                            <div
                              className="panel-heading"
                              style={{ cursor: "pointer" }}
                              data-toggle="collapse"
                              data-target={`#grupo-${group._id}`}
                            >
                              <h5 className="m-t-sm">
                                <i className="fa fa-group text-info"></i>
                                &nbsp;
                                {group.name} &nbsp;
                                <span className="badge badge-primary">
                                  {group.athletes.length} atletas
                                </span>
                                <i className="fa fa-chevron-down pull-right"></i>
                              </h5>
                            </div>
                            <div
                              id={`grupo-${group._id}`}
                              className="panel-collapse collapse"
                            >
                              <div className="panel-body">
                                <div className="row">
                                  {group.athletes.map((athlete) => (
                                    <div
                                      className="col-md-4"
                                      key={athlete._id || athlete.id || athlete}
                                    >
                                      <div className="d-flex align-items-center">
                                        <Image
                                          src={
                                            athlete.image ||
                                            "/public/no-image.jpg"
                                          }
                                          alt={athlete.name}
                                          className="rounded-circle mr-2"
                                          width="40px"
                                        />
                                        <span>
                                          {athlete.name} {athlete.lastname}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
