import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const OrderStatusUpdate = ({ data, refetch, setStatusShow, statusShow }) => {
  const { _id, name, seatNumber, desc, status } = data;

  const [user, setUser] = useState(data);

  const MySwal = withReactContent(Swal);

  const handleOnBlur = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const newInfo = { ...user };
    if (field === "status") {
      newInfo[field] = value;
    }
    newInfo[field] = value;
    setUser(newInfo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === user?.status) {
      return MySwal.fire(`Sorry Already ${user?.status}`);
    }

    const newPost = {
      ...user,
    };
    try {
      const updatedStatus = {
        ...newPost,
      };

      await axios.patch(
        `https://api.psh.com.bd/api/order/${_id}`,
        updatedStatus
      );
      MySwal.fire("Updated", "success");
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
                Status Update
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
                            Status ({status})
                          </label>
                          <br />
                          <select
                            name="status"
                            id="inputState"
                            className="main_form"
                            style={{ width: "450px" }}
                            onBlur={handleOnBlur}
                            defaultValue={user.status}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Approved">Approved</option>
                            <option value="Canceled">Canceled</option>
                          </select>
                        </div>

                        <div className="d-flex justify-content-center ml-5">
                          <button type="submit" style={{ width: 220 }}>
                            Update Status
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

export default OrderStatusUpdate;
