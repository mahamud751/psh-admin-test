import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import UseFetch from "../../hooks/useFetch";

const PropertyDetails = ({ show, setShow, data }) => {
  const { data3, loading3, error3, refetch3 } = UseFetch("facilityCategory");
  const formattedDate = new Date(data?.createdAt).toLocaleString();
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
                Propery Details
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
              <h4
                className="mt-4 px-3 rounded"
                style={{ backgroundColor: "#00bbb4", color: "White" }}
              >
                Key Details
              </h4>
              <div className="row ps-5 ">
                <div className="col-lg-3 mt-2">
                  {" "}
                  <label htmlFor="">Property Type</label>
                  <p>{data?.category?.name}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="">Branch</label>
                  <p>{data?.branch?.name}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="">Floor Number</label>
                  <p> {data?.floor}</p>
                </div>
                {data?.category?.name === "Apartment" ? (
                  ""
                ) : (
                  <div className="col-lg-3">
                    <label htmlFor="">Room Number</label>
                    <p> {data?.roomNumber}</p>
                  </div>
                )}

                {data?.category?.name === "Shared Room " ? (
                  ""
                ) : (
                  <>
                    <div className="col-lg-3">
                      {" "}
                      <label htmlFor="">Per Day</label>
                      <p> {data?.perDay?.toLocaleString()}</p>
                    </div>
                    <div className="col-lg-3">
                      {" "}
                      <label htmlFor="">Per Month</label>
                      <p> {data?.perMonth?.toLocaleString()}</p>
                    </div>
                    <div className="col-lg-3">
                      {" "}
                      <label htmlFor="">Per Year</label>
                      <p> {data?.perYear?.toLocaleString()}</p>
                    </div>
                  </>
                )}
                {data?.category?.name === "Apartment" ? (
                  ""
                ) : (
                  <div className="col-lg-3">
                    <label htmlFor="">Room Size</label>
                    <p> {data?.area} Square feet</p>
                  </div>
                )}
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="">Furnishing</label>
                  <p>{data.furnitured}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="">Balcony</label>
                  <p> {data.balcony}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="">Bed Room</label>
                  <p> {data.bedroom}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="">Wifi</label>
                  <p> {data.WiFi}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="">CCTV</label>
                  <p>{data.CCTV} </p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="">Meal</label>
                  <p>{data.meal} Times a day</p>
                </div>
              </div>
              {data3?.slice(0, 3).map((pd) => (
                <div style={{ width: "100%" }} key={pd._id}>
                  <div className="facility_h1 p-2">
                    <h4
                      id={pd?.name}
                      style={{ backgroundColor: "#00bbb4", color: "White" }}
                      className="ps-3 rounded"
                    >
                      {pd.name}
                    </h4>
                  </div>
                  <div className="row p-5">
                    {data.facility
                      ? data.facility
                          .filter((item) => item.facilityCategory === pd._id)
                          .map((item) => (
                            <React.Fragment key={item._id}>
                              <div className="d-flex flex-column col-lg-2">
                                <img
                                  src={item.photos[0]}
                                  alt=""
                                  style={{ maxWidth: "none", width: "40px" }}
                                />
                                <p className="mt-3 ">
                                  {item.name ? item.name : ""}
                                </p>
                              </div>
                            </React.Fragment>
                          ))
                      : ""}
                  </div>
                </div>
              ))}
              {data?.seats?.length !== 0 ? (
                <h4
                  className="mt-4 mb-4 ps-3 rounded"
                  style={{ backgroundColor: "#00bbb4", color: "White" }}
                >
                  Seats
                </h4>
              ) : (
                ""
              )}

              <div className="mb-5 gap-5">
                {data.seats &&
                  data.seats.map((item) => {
                    return (
                      <div className=" mt-2">
                        <div className=" ">
                          <div className="  ">
                            <div className="d-flex gap-3">
                              <img
                                src={item.photos ? item.photos[0] : ""}
                                alt=""
                                style={{ width: "400px", height: "160px" }}
                                className="rounded"
                              />
                              <div>
                                <div className=" ">
                                  <label htmlFor=""> Seat No : </label>
                                  <span> {item.seatNumber}</span>
                                </div>

                                <div className=" ">
                                  <label htmlFor=""> Per Day : </label>
                                  <span>
                                    {" "}
                                    {item.perDay?.toLocaleString()} Tk
                                  </span>
                                </div>
                                <div className=" ">
                                  <label htmlFor=""> Per Monnth : </label>
                                  <span>
                                    {" "}
                                    {item.perMonth?.toLocaleString()} Tk
                                  </span>
                                </div>
                                <div className=" ">
                                  <label htmlFor=""> Per Year : </label>
                                  <span>
                                    {" "}
                                    {item?.perYear?.toLocaleString()} Tk
                                  </span>
                                </div>
                                <div className=" ">
                                  <label htmlFor=""> Booked Dates : </label>
                                  {item?.rentDate?.map((rent) => (
                                    <span>
                                      {rent?.bookStartDate}to{" "}
                                      {rent?.bookEndDate}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
