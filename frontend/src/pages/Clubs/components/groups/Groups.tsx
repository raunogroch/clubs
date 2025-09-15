import { NavHeader } from "../../../../components";
import type { pageParamProps } from "../../../../interfaces";

export const Groups = ({ name, sub }: pageParamProps) => {
  return (
    <>
      <NavHeader name={name} sub={sub} pageCreate="Nuevo grupo" />

      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Lista de grupos</h5>
              </div>
              <div className="ibox-content"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
