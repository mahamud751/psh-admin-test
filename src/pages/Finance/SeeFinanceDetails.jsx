import React from "react";

const SeeFinanceDetails = ({ data }) => {
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
                <h3> Finance Client Info</h3>
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
                  <p>{data?.name}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Email
                  </label>
                  <p>{data?.email}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Phone Number
                  </label>
                  <p>{data?.phone}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Brith Day
                  </label>
                  <p>{data?.birthDate}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Profession
                  </label>
                  <p>{data?.profession}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Matrial Status
                  </label>
                  <p>{data?.maritalStatus}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Investor Income
                  </label>
                  <p>{data?.investorIncome}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Invest Amount
                  </label>
                  <p>{data?.investAmount}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Invest Time
                  </label>
                  <p>{data?.investTime}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Return Time
                  </label>
                  <p>{data?.returnTime}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Know About
                  </label>
                  <p>{data?.knowAbout}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Reference
                  </label>
                  <p>{data?.reference}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Address
                  </label>
                  <p>{data?.address}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Visiting Card
                  </label>
                  <div>
                    <img
                      src={`https://psh-server-test.onrender.com/${data?.image}`}
                      alt=""
                      style={{ width: "100px" }}
                    />
                  </div>
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
              {/* Room Details */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeFinanceDetails;
