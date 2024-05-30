import React, { useState } from "react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./Signin.css";

import { AuthContext } from "../contexts/UserProvider";
const SignIn = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [loginError, setLoginError] = useState("");
  const { loginUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const onSubmit = async (data) => {
    const { email, password } = data;

    await loginUser(email, password);
    navigate("/");
  };
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  return (
    <div>
      <div className="sign_in_all">
        <div className="content-wrapper" style={{ background: "unset" }}>
          <div className="sign_main">
            <div>
              {/* /.card-header */}
              <div className="sign_in_card p-5 card">
                <div>
                  <div className="text-center my-5">
                    <img
                      src={"https://i.ibb.co/GpqY8tQ/PSH-web-logo-1.png"}
                      alt=""
                      className="img-fluid"
                      style={{ width: 190 }}
                    />
                  </div>
                  <div className="registration_div">
                    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                      <div className="col-md-12 form2">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter Username"
                          {...register("email", {
                            required: true,
                          })}
                        />
                        {errors.email && (
                          <p className="text-red-500">{errors.email.message}</p>
                        )}
                      </div>
                      <div className="col-md-12 form2 d-flex">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Enter Password"
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be 6 characters long",
                            },
                            pattern: {
                              value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/,
                              message:
                                "Password must have uppercase, number and special characters",
                            },
                          })}
                        />
                        <button
                          type="button"
                          onClick={toggleShowPassword}
                          style={{
                            border: "none",
                            marginLeft: -40,
                            width: 40,
                            height: 60,
                          }}
                        >
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                          {/* <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                          /> */}
                        </button>
                        {errors.password && (
                          <p className="text-red-500">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                      {loginError && (
                        <p style={{ color: "red" }}>
                          Something wrong! Please try again
                        </p>
                      )}

                      <div className="mb-5">
                        <button type="submit" className="form2_btn">
                          Enter Password
                        </button>
                      </div>
                      {/* <h6 style={{ color: "#939198" }}>
                        Forgot your password?
                      </h6> */}
                    </form>
                  </div>
                </div>
                {
                  <div className="mt-5">
                    <p>username: mama@gmail.com</p>
                    <p>password: 123456Pt!1</p>
                  </div>
                }
              </div>

              {/* /.card-body */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
