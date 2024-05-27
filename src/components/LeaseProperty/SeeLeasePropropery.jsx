import React from "react";

const SeeLeasePropropery = ({ data }) => {
  const formattedDate = new Date(data?.createdAt).toLocaleString();
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
              <h3>Lease Property Details</h3>
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
                Property Owner
              </h3>

              <div className="row px-5">
                <div className="col-lg-3">
                  <label htmlFor="">Date</label>
                  <p>{formattedDate}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="">First Name</label>
                  <p>{data?.firstName}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="">Last Name</label>
                  <p>{data?.lastName}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="">Phone Number</label>
                  <p>{data?.phoneNumber}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="">Email</label>
                  <p>{data?.email}</p>
                </div>
              </div>
              {/* Room Details */}
              <h3
                className=" fs-4 mt-3 ps-3 rounded"
                style={{ backgroundColor: "#00bbb4", color: "White" }}
              >
                Property Details
              </h3>
              <div className="row px-5">
                <div className="col-lg-3">
                  <label htmlFor="">Property Name</label>
                  <p>{data?.propertyName}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="">Property Type</label>
                  <p>{data?.propertyType}</p>
                </div>

                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="">Total Room</label>
                  <p> {data?.totalRooms}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="">Visiting Date</label>
                  <p> {data?.availabilityForVisit?.split("T")[0]}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="">Visiting Time</label>
                  <p> {data?.availabilityForVisitTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeLeasePropropery;
