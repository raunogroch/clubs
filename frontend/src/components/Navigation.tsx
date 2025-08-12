import type { ReactNode } from "react";
import { Input, Image, Footer, SideNav, TopNav } from ".";

interface NavigationProps {
  children: ReactNode;
}

export const Navigation = ({ children }: NavigationProps) => {
  return (
    <div id="wrapper">
      <SideNav />

      <div id="page-wrapper" className="gray-bg dashbard-1">
        <TopNav />
        <div>{children}</div>

        <Footer />
      </div>
      <div className="small-chat-box fadeInRight animated">
        <div className="heading" draggable="true">
          <small className="chat-date float-right">02.19.2015</small>
          Small chat
        </div>

        <div className="content">
          <div className="left">
            <div className="author-name">
              Monica Jackson <small className="chat-date">10:02 am</small>
            </div>
            <div className="chat-message active">
              Lorem Ipsum is simply dummy text input.
            </div>
          </div>
          <div className="right">
            <div className="author-name">
              Mick Smith
              <small className="chat-date">11:24 am</small>
            </div>
            <div className="chat-message">Lorem Ipsum is simpl.</div>
          </div>
          <div className="left">
            <div className="author-name">
              Alice Novak
              <small className="chat-date">08:45 pm</small>
            </div>
            <div className="chat-message active">Check this stock char.</div>
          </div>
          <div className="right">
            <div className="author-name">
              Anna Lamson
              <small className="chat-date">11:24 am</small>
            </div>
            <div className="chat-message">
              The standard chunk of Lorem Ipsum
            </div>
          </div>
          <div className="left">
            <div className="author-name">
              Mick Lane
              <small className="chat-date">08:45 pm</small>
            </div>
            <div className="chat-message active">
              I belive that. Lorem Ipsum is simply dummy text.
            </div>
          </div>
        </div>
        <div className="form-chat">
          <div className="input-group input-group-sm">
            <Input type="text" className="form-control" />
            <span className="input-group-btn">
              {" "}
              <button className="btn btn-primary" type="button">
                Send
              </button>{" "}
            </span>
          </div>
        </div>
      </div>
      <div id="small-chat">
        <span className="badge badge-warning float-right">5</span>
        <a className="open-small-chat" href="">
          <i className="fa fa-comments"></i>
        </a>
      </div>
      <div id="right-sidebar" className="animated">
        <div className="sidebar-container">
          <ul className="nav nav-tabs navs-3">
            <li>
              <a className="nav-link active" data-toggle="tab" href="#tab-1">
                {" "}
                Notes{" "}
              </a>
            </li>
            <li>
              <a className="nav-link" data-toggle="tab" href="#tab-2">
                {" "}
                Projects{" "}
              </a>
            </li>
            <li>
              <a className="nav-link" data-toggle="tab" href="#tab-3">
                {" "}
                <i className="fa fa-gear"></i>{" "}
              </a>
            </li>
          </ul>

          <div className="tab-content">
            <div id="tab-1" className="tab-pane active">
              <div className="sidebar-title">
                <h3>
                  {" "}
                  <i className="fa fa-comments-o"></i> Latest Notes
                </h3>
                <small>
                  <i className="fa fa-tim"></i> You have 10 new message.
                </small>
              </div>

              <div>
                <div className="sidebar-message">
                  <a href="#">
                    <div className="float-left text-center">
                      <Image
                        alt="image"
                        className="rounded-circle message-avatar"
                        src="/src/assets/img/a1.jpg"
                      />

                      <div className="m-t-xs">
                        <i className="fa fa-star text-warning"></i>
                        <i className="fa fa-star text-warning"></i>
                      </div>
                    </div>
                    <div className="media-body">
                      There are many variations of passages of Lorem Ipsum
                      available.
                      <br />
                      <small className="text-muted">Today 4:21 pm</small>
                    </div>
                  </a>
                </div>
                <div className="sidebar-message">
                  <a href="#">
                    <div className="float-left text-center">
                      <Image
                        alt="image"
                        className="rounded-circle message-avatar"
                        src="/src/assets/img/a2.jpg"
                      />
                    </div>
                    <div className="media-body">
                      The point of using Lorem Ipsum is that it has a
                      more-or-less normal.
                      <br />
                      <small className="text-muted">Yesterday 2:45 pm</small>
                    </div>
                  </a>
                </div>
                <div className="sidebar-message">
                  <a href="#">
                    <div className="float-left text-center">
                      <Image
                        alt="image"
                        className="rounded-circle message-avatar"
                        src="/src/assets/img/a3.jpg"
                      />
                      <div className="m-t-xs">
                        <i className="fa fa-star text-warning"></i>
                        <i className="fa fa-star text-warning"></i>
                        <i className="fa fa-star text-warning"></i>
                      </div>
                    </div>
                    <div className="media-body">
                      Mevolved over the years, sometimes by accident, sometimes
                      on purpose (injected humour and the like).
                      <br />
                      <small className="text-muted">Yesterday 1:10 pm</small>
                    </div>
                  </a>
                </div>
                <div className="sidebar-message">
                  <a href="#">
                    <div className="float-left text-center">
                      <Image
                        alt="image"
                        className="rounded-circle message-avatar"
                        src="/src/assets/img/a4.jpg"
                      />
                    </div>

                    <div className="media-body">
                      Lorem Ipsum, you need to be sure there isn't anything
                      embarrassing hidden in the
                      <br />
                      <small className="text-muted">Monday 8:37 pm</small>
                    </div>
                  </a>
                </div>
                <div className="sidebar-message">
                  <a href="#">
                    <div className="float-left text-center">
                      <Image
                        alt="image"
                        className="rounded-circle message-avatar"
                        src="/src/assets/img/a5.jpg"
                      />
                    </div>
                    <div className="media-body">
                      All the Lorem Ipsum generators on the Internet tend to
                      repeat.
                      <br />
                      <small className="text-muted">Today 4:21 pm</small>
                    </div>
                  </a>
                </div>
                <div className="sidebar-message">
                  <a href="#">
                    <div className="float-left text-center">
                      <Image
                        alt="image"
                        className="rounded-circle message-avatar"
                        src="/src/assets/img/a7.jpg"
                      />
                    </div>
                    <div className="media-body">
                      Renaissance. The first line of Lorem Ipsum, "Lorem ipsum
                      dolor sit amet..", comes from a line in section 1.10.32.
                      <br />
                      <small className="text-muted">Yesterday 2:45 pm</small>
                    </div>
                  </a>
                </div>
                <div className="sidebar-message">
                  <a href="#">
                    <div className="float-left text-center">
                      <Image
                        alt="image"
                        className="rounded-circle message-avatar"
                        src="/src/assets/img/a3.jpg"
                      />
                      <div className="m-t-xs">
                        <i className="fa fa-star text-warning"></i>
                        <i className="fa fa-star text-warning"></i>
                        <i className="fa fa-star text-warning"></i>
                      </div>
                    </div>
                    <div className="media-body">
                      The standard chunk of Lorem Ipsum used since the 1500s is
                      reproduced below.
                      <br />
                      <small className="text-muted">Yesterday 1:10 pm</small>
                    </div>
                  </a>
                </div>
                <div className="sidebar-message">
                  <a href="#">
                    <div className="float-left text-center">
                      <Image
                        alt="image"
                        className="rounded-circle message-avatar"
                        src="/src/assets/img/a4.jpg"
                      />
                    </div>
                    <div className="media-body">
                      Uncover many web sites still in their infancy. Various
                      versions have.
                      <br />
                      <small className="text-muted">Monday 8:37 pm</small>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div id="tab-2" className="tab-pane">
              <div className="sidebar-title">
                <h3>
                  {" "}
                  <i className="fa fa-cube"></i> Latest projects
                </h3>
                <small>
                  <i className="fa fa-tim"></i> You have 14 projects. 10 not
                  completed.
                </small>
              </div>

              <ul className="sidebar-list">
                <li>
                  <a href="#">
                    <div className="small float-right m-t-xs">9 hours ago</div>
                    <h4>Business valuation</h4>
                    It is a long established fact that a reader will be
                    distracted.
                    <div className="small">Completion with: 22%</div>
                    <div className="progress progress-mini">
                      <div
                        style={{ width: "22%" }}
                        className="progress-bar progress-bar-warning"
                      ></div>
                    </div>
                    <div className="small text-muted m-t-xs">
                      Project end: 4:00 pm - 12.06.2014
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <div className="small float-right m-t-xs">9 hours ago</div>
                    <h4>Contract with Company </h4>
                    Many desktop publishing packages and web page editors.
                    <div className="small">Completion with: 48%</div>
                    <div className="progress progress-mini">
                      <div
                        style={{ width: "48%" }}
                        className="progress-bar"
                      ></div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <div className="small float-right m-t-xs">9 hours ago</div>
                    <h4>Meeting</h4>
                    By the readable content of a page when looking at its
                    layout.
                    <div className="small">Completion with: 14%</div>
                    <div className="progress progress-mini">
                      <div
                        style={{ width: "14%" }}
                        className="progress-bar progress-bar-info"
                      ></div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="label label-primary float-right">NEW</span>
                    <h4>The generated</h4>
                    There are many variations of passages of Lorem Ipsum
                    available.
                    <div className="small">Completion with: 22%</div>
                    <div className="small text-muted m-t-xs">
                      Project end: 4:00 pm - 12.06.2014
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <div className="small float-right m-t-xs">9 hours ago</div>
                    <h4>Business valuation</h4>
                    It is a long established fact that a reader will be
                    distracted.
                    <div className="small">Completion with: 22%</div>
                    <div className="progress progress-mini">
                      <div
                        style={{ width: "22%" }}
                        className="progress-bar progress-bar-warning"
                      ></div>
                    </div>
                    <div className="small text-muted m-t-xs">
                      Project end: 4:00 pm - 12.06.2014
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <div className="small float-right m-t-xs">9 hours ago</div>
                    <h4>Contract with Company </h4>
                    Many desktop publishing packages and web page editors.
                    <div className="small">Completion with: 48%</div>
                    <div className="progress progress-mini">
                      <div
                        style={{ width: "48%" }}
                        className="progress-bar"
                      ></div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <div className="small float-right m-t-xs">9 hours ago</div>
                    <h4>Meeting</h4>
                    By the readable content of a page when looking at its
                    layout.
                    <div className="small">Completion with: 14%</div>
                    <div className="progress progress-mini">
                      <div
                        style={{ width: "14%" }}
                        className="progress-bar progress-bar-info"
                      ></div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="label label-primary float-right">NEW</span>
                    <h4>The generated</h4>
                    There are many variations of passages of Lorem Ipsum
                    available.
                    <div className="small">Completion with: 22%</div>
                    <div className="small text-muted m-t-xs">
                      Project end: 4:00 pm - 12.06.2014
                    </div>
                  </a>
                </li>
              </ul>
            </div>

            <div id="tab-3" className="tab-pane">
              <div className="sidebar-title">
                <h3>
                  <i className="fa fa-gears"></i> Settings
                </h3>
                <small>
                  <i className="fa fa-tim"></i> You have 14 projects. 10 not
                  completed.
                </small>
              </div>

              <div className="setings-item">
                <span>Show notifications</span>
                <div className="switch">
                  <div className="onoffswitch">
                    <Input
                      type="checkbox"
                      name="collapsemenu"
                      className="onoffswitch-checkbox"
                      id="example"
                    />
                    <label className="onoffswitch-label" htmlFor="example">
                      <span className="onoffswitch-inner"></span>
                      <span className="onoffswitch-switch"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="setings-item">
                <span>Disable Chat</span>
                <div className="switch">
                  <div className="onoffswitch">
                    <Input
                      type="checkbox"
                      name="collapsemenu"
                      checked
                      className="onoffswitch-checkbox"
                      id="example2"
                    />
                    <label className="onoffswitch-label" htmlFor="example2">
                      <span className="onoffswitch-inner"></span>
                      <span className="onoffswitch-switch"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="setings-item">
                <span>Enable history</span>
                <div className="switch">
                  <div className="onoffswitch">
                    <Input
                      type="checkbox"
                      name="collapsemenu"
                      className="onoffswitch-checkbox"
                      id="example3"
                    />
                    <label className="onoffswitch-label" htmlFor="example3">
                      <span className="onoffswitch-inner"></span>
                      <span className="onoffswitch-switch"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="setings-item">
                <span>Show charts</span>
                <div className="switch">
                  <div className="onoffswitch">
                    <Input
                      type="checkbox"
                      name="collapsemenu"
                      className="onoffswitch-checkbox"
                      id="example4"
                    />
                    <label className="onoffswitch-label" htmlFor="example4">
                      <span className="onoffswitch-inner"></span>
                      <span className="onoffswitch-switch"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="setings-item">
                <span>Offline users</span>
                <div className="switch">
                  <div className="onoffswitch">
                    <Input
                      type="checkbox"
                      name="collapsemenu"
                      className="onoffswitch-checkbox"
                      id="example5"
                    />
                    <label className="onoffswitch-label" htmlFor="example5">
                      <span className="onoffswitch-inner"></span>
                      <span className="onoffswitch-switch"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="setings-item">
                <span>Global search</span>
                <div className="switch">
                  <div className="onoffswitch">
                    <Input
                      type="checkbox"
                      checked
                      name="collapsemenu"
                      className="onoffswitch-checkbox"
                      id="example6"
                    />
                    <label className="onoffswitch-label" htmlFor="example6">
                      <span className="onoffswitch-inner"></span>
                      <span className="onoffswitch-switch"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="setings-item">
                <span>Update everyday</span>
                <div className="switch">
                  <div className="onoffswitch">
                    <Input
                      type="checkbox"
                      name="collapsemenu"
                      className="onoffswitch-checkbox"
                      id="example7"
                    />
                    <label className="onoffswitch-label" htmlFor="example7">
                      <span className="onoffswitch-inner"></span>
                      <span className="onoffswitch-switch"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="sidebar-content">
                <h4>Settings</h4>
                <div className="small">
                  I belive that. Lorem Ipsum is simply dummy text of the
                  printing and typesetting industry. And typesetting industry.
                  Lorem Ipsum has been the industry's standard dummy text ever
                  since the 1500s. Over the years, sometimes by accident,
                  sometimes on purpose (injected humour and the like).
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
