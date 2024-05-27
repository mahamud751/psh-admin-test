import React from "react";

import "./SeeOrderDetails.css";

const ImageViewer = ({ data }) => {
  return (
    <div className="">
      <div
        className="modal fade "
        id={`image_view${data?._id}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ maxWidth: "500px" }}>
          <div className="modal-content" style={{ overflow: "scroll" }}>
            <div className="modal-header">
              <div className="d-flex justify-items-center">
                <h3>Viewer</h3>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body w-100 ">
              <div className="col-lg-3 mb-3">
                <div>
                  <img
                    src={`https://psh-server-test.onrender.com/${data?.image}`}
                    alt=""
                    style={{ width: "400px" }}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div>
                  <img
                    src={`https://psh-server-test.onrender.com/${data?.gardianImg}`}
                    alt=""
                    style={{ width: "400px" }}
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

export default ImageViewer;
