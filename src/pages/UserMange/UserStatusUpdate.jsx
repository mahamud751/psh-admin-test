import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Modal } from "react-bootstrap";

const UserStatusUpdate = ({ data, refetch }) => {
  const { _id, status } = data;

  const MySwal = withReactContent(Swal);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const status = e.target?.userStatus?.value;

    if (status === data?.userStatus) {
      return MySwal.fire(`Sorry Already ${data?.userStatus}`);
    }

    const updatedStatus = {
      userStatus: status,
    };

    try {
      await axios.patch(
        `https://api.psh.com.bd/api/users/${_id}`,

        updatedStatus
      );
      MySwal.fire("Good job!", "successfully edited", "success");
      refetch();
    } catch (err) {
      console.log(err);
      MySwal.fire("Something Error Found.", "warning");
    }
  };
  return (
    <div className="container">
      <div
        className="modal fade"
        id={`status${data._id}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                User Status Update
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div>
                      <div className="">
                        <div className="col-md-12 mb-3">
                          <label htmlFor="inputState" className="">
                            Status ({data?.userStatus})
                          </label>
                          <br />
                          <select
                            name="userStatus"
                            id="inputState"
                            className="main_form"
                            style={{ width: "450px" }}
                            defaultValue={data.userStatus}
                          >
                            <option value="Active">Active</option>
                            <option value="Deactive">Deactive</option>
                            <option value="Blocked">Blocked</option>
                          </select>
                        </div>

                        <div className="d-flex justify-content-center ml-5">
                          <button type="submit" style={{ width: 220 }}>
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Toaster
                    containerStyle={{ top: 300 }}
                    toastOptions={{ position: "top-center" }}
                  ></Toaster>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatusUpdate;
