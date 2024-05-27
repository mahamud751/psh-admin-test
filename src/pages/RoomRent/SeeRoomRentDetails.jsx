import React from "react";

const SeeRoomRentDetails = ({ data }) => {
  return (
    <div className="">
      <div
        className="modal fade "
        id={`details${data._id}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ maxWidth: "1000px" }}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="d-flex justify-items-center">
                <h3>Housing Rent Details</h3>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body w-100 ">
              <h3
                className=" fs-4 mt-3 ps-3 rounded"
                style={{ backgroundColor: "#00bbb4", color: "White" }}
              >
                Details
              </h3>

              <div className="row px-5">
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Name
                  </label>
                  <p>{data?.firstName}</p>
                </div>

                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Phone Number
                  </label>
                  <p>{data?.phone}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Total Room
                  </label>
                  <p>{data?.totalRoom}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Position
                  </label>
                  <p>{data?.position}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Company
                  </label>
                  <p>{data?.company}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Company Email
                  </label>
                  <p>{data?.companyEmail}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Location
                  </label>
                  <p>{data?.location}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Status
                  </label>
                  <p>{data?.status}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    A vailability For Visit Time
                  </label>
                  <p>{data?.availabilityForVisitTime}</p>
                </div>
              </div>
              {/* Room Details */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeRoomRentDetails;
