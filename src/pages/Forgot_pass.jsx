import React from "react";
import img from "../img/home/Rectangle 999.png";
import "./Signin.css";
const Forgot_pass = () => {
  return (
    <div>
      <div className="wrapper">
        <div
          className="content-wrapper"
          style={{ background: "unset", height: 600 }}
        >
          <div className="sign_main">
            <div>
              <div>
                {/* /.card-header */}
                <div className="card-body">
                  <div>
                    <h2 className="sign_h2">FORGET PASSWORD</h2>
                    <div className="registration_div">
                      <form className="row g-3">
                        <div className="col-md-12 form2">
                          <input
                            type="email"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Enter Email Adress"
                          />
                        </div>

                        <div className="mb-5">
                          <button type="submit" className="form2_btn">
                            SUBMIT
                          </button>
                        </div>
                        <h6 style={{ color: "#939198" }}>
                          You Remember Password?{" "}
                          <span color="#0F0C1A">Sign In</span>
                        </h6>
                      </form>
                    </div>
                  </div>
                </div>
                {/* /.card-body */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot_pass;
