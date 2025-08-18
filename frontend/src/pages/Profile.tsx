import { Image } from "../components";
import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";

export const Profile = ({ name }: pageParamProps) => {
  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row m-b-lg m-t-lg">
          <div className="col-md-6">
            <div className="profile-image">
              <Image
                src="img/a4.jpg"
                className="rounded-circle circle-border m-b-md"
                alt="profile"
              />
            </div>
            <div className="profile-info">
              <div className="">
                <div>
                  <h2 className="no-margins">Alex Smith</h2>
                  <h4>Founder of Groupeq</h4>
                  <small>
                    There are many variations of passages of Lorem Ipsum
                    available, but the majority have suffered alteration in some
                    form Ipsum available.
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <table className="table small m-b-xs">
              <tbody>
                <tr>
                  <td>
                    <strong>142</strong> Projects
                  </td>
                  <td>
                    <strong>22</strong> Followers
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>61</strong> Comments
                  </td>
                  <td>
                    <strong>54</strong> Articles
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>154</strong> Tags
                  </td>
                  <td>
                    <strong>32</strong> Friends
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-3">
            <small>Sales in last 24h</small>
            <h2 className="no-margins">206 480</h2>
            <div id="sparkline1"></div>
          </div>
        </div>
      </div>
    </>
  );
};
