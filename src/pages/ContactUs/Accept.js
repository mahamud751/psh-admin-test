import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

const Accept = ({ contact, refetch }) => {
  // Handle Adjustment Request

  // handle Accept Adjustment
  const handleAccept = async (e) => {
    e.preventDefault();
    const contactUsData = {
      status: "Accepted",
      email: contact?.email,
      appointMentDate: e.target.appointMentDate?.value,
      appointMentTime: e.target.appointMentTime?.value,
    };

    try {
      await axios.patch(
        `https://psh-server-test.onrender.com/api/contact/${contact._id}`,
        contactUsData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Accepted");
      refetch();
    } catch (error) {
      return toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="container">
      <div
        className="modal fade"
        id={`accept${contact?._id}`}
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
                Accept Contact us
              </h1>{" "}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAccept}>
                <div>
                  <label htmlFor="" className="fs-5 fw-normal">
                    Appointment Date
                  </label>
                  <br />
                  <input
                    type="date"
                    placeholder="Appointment Data"
                    id=""
                    className="px-2 rounded"
                    style={{ width: "300px", height: "40px" }}
                    name="appointMentDate"
                    defaultValue={contact?.appointMentDate}
                  />{" "}
                  <br />
                </div>
                <div>
                  <label htmlFor="" className="fs-5 fw-normal">
                    Appointment Time
                  </label>
                  <br />
                  <input
                    type="time"
                    placeholder="Appointment Time"
                    id=""
                    className="px-2 rounded"
                    style={{ width: "300px", height: "40px" }}
                    name="appointMentTime"
                    defaultValue={contact?.appointMentTime}
                  />{" "}
                  <br />
                </div>
                <input
                  className="mt-3 p-3"
                  style={{
                    backgroundColor: "#17a2b8",
                    color: "white",
                    border: "none",
                  }}
                  type="submit"
                  value="Accept Contact"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accept;
