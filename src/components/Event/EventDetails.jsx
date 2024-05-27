import React from "react";

const EventDetails = ({ data }) => {
  return (
    <div className="">
      <div
        className="modal fade "
        id={`propertyDetails${data._id}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ maxWidth: "1000px" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title fs-4" id="staticBackdropLabel">
                Event Details
              </h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body w-100 ps-5">
              <div className="row gap-3">
                {data?.photos &&
                  data.photos?.map((photo, index) => (
                    <div className="col-lg-2" key={index}>
                      <img
                        src={photo}
                        alt=""
                        style={{ width: "150px", height: "150px" }}
                      />
                    </div>
                  ))}
              </div>

              <div className="row ps-5 ">
                <div className="col-lg-12 mt-2">
                  {" "}
                  <label htmlFor="">Event Name</label>
                  <p>{data?.name}</p>
                </div>
                <h4
                  className="mt-4 px-3 rounded"
                  style={{ backgroundColor: "#00bbb4", color: "White" }}
                >
                  Details
                </h4>
                <div className="col-md-12">
                  <div
                    dangerouslySetInnerHTML={{ __html: data?.desc }}
                    key={data._id}
                    style={{ maxWidth: "80%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
