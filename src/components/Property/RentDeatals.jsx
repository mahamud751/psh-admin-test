import React from "react";

import { Table } from "react-bootstrap";

const RentDeatals = ({ data }) => {
  const currentDate = new Date().toISOString().split("T")[0];
  return (
    <div className="">
      <div
        className="modal fade "
        id={`rentDetails${data._id}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ maxWidth: "500px" }}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="d-flex justify-items-center">
                <h3>Details</h3>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body w-100 ">
              <p className="text-center fw-bold">Booking Dates</p>
              {data?.category?.name === "Shared Room" ? (
                <Table bordered responsive size="sm">
                  <tbody>
                    {data?.seats?.map((seat) => {
                      return (
                        <tr className="text-center ">
                          <td>{seat?.seatNumber}</td>
                          {seat?.rentDate?.map((rent) =>
                            rent?.bookEndDate >= currentDate ? (
                              <div className="fw-bold" style={{ color: "red" }}>
                                <td>{rent?.bookStartDate}</td>
                                <td>to</td>
                                <td>{rent?.bookEndDate}</td>
                              </div>
                            ) : (
                              ""
                            )
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <Table bordered responsive size="sm">
                  <tbody>
                    {data?.rentDate?.map((rent) => (
                      <tr className="text-center">
                        {rent?.bookEndDate >= currentDate ? (
                          <div className="fw-bold" style={{ color: "red" }}>
                            {" "}
                            <td>{rent?.bookStartDate}</td>
                            <td>to</td>
                            <td>{rent?.bookEndDate}</td>
                          </div>
                        ) : (
                          ""
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentDeatals;
