import { Link } from "react-router-dom";
import { NavHeader } from "../../components/NavHeader";
import type { pageParamProps } from "../../interfaces/pageParamProps";
import { useUserClubs } from "./hooks";
import { PopUpMessage, Image, LoadingIndicator } from "../../components";

export const DashboardAthlete = ({ name }: pageParamProps) => {
  const { clubs, loading, error } = useUserClubs();
  if (loading) return <LoadingIndicator />;
  if (error) return <PopUpMessage />;

  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row ">
          {clubs?.map((club) => (
            <div key={club._id} className="col-lg-4">
              <div className="contact-box">
                <Link className="row" to="profile.html">
                  <div className="col-4">
                    <div className="text-center">
                      {club.image ? (
                        <Image
                          src={club.image}
                          alt={club._id}
                          className="img-fluid rounded-circle"
                          style={{ width: "100%" }}
                        />
                      ) : (
                        "Sin logo"
                      )}

                      <div className="m-t-xs font-bold">
                        {club.discipline.name.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="col-8">
                    <h3>
                      <strong>Club&nbsp;{club.name}</strong>
                    </h3>
                    <p>
                      <i className="fa fa-map-marker"></i> {club.place}
                      <br />
                      <i className="fa fa-clock-o"></i>
                      {club.schedule.startTime} Hrs - {club.schedule.endTime}
                      Hrs
                    </p>
                    <div>
                      <strong>Entrenador</strong>
                      <br />
                      {club.coaches
                        .map((coach: any) => `${coach.name} ${coach.lastname}`)
                        .join(", ")}
                      <br />
                      {/*San Francisco, CA 94107*/}
                      <br />
                      <abbr title="Phone">
                        <i className="fa fa-phone"></i>
                      </abbr>
                      &nbsp; (591) 456-7890
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
