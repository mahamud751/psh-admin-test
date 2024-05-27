import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

import { useLocation } from "react-router-dom";

import logo from "../../img/home/logo.png";
// import useBranch from "../../hooks/useBranch";
// import InvoiceModal from "./InvoiceModal";
import "./Invoice.css";
import ReactToPrint from "react-to-print";

const Invoice = ({ data }) => {
  const ref = useRef();
  const pdfRef = useRef();
  const currentDate = new Date().toISOString().split("T")[0];
  const location = useLocation();

  const [branch, SetBranch] = useState([]);
  const [bookingBranch, SetBookingBranch] = useState({});

  const [size, setSize] = useState(null);

  const handleOpen = (value) => setSize(value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.psh.com.bd/api/branch");
        SetBranch(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const findOrderBranch = branch.find(
      (branch) => branch?._id === data?.bookingInfo?.branch
    );
    SetBookingBranch(findOrderBranch);
    fetchData();
  }, [data?.bookingInfo?.branch, branch]);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div ref={ref} id="invoice" className="mx-5">
      <div ref={pdfRef} className="">
        <div
          className=" payment-info border "
          style={{
            padding: "40px",
          }}
        >
          <div className="d-flex justify-content-between  gx-0  ">
            <div>
              <img src={logo} alt="" />
            </div>
            <div className="text-right">
              <h2
                className=""
                style={{
                  fontSize: "28px",
                  fontWeight: 500,
                  color: "#35B0A7",
                }}
              >
                INVOICE
              </h2>
              <p
                className=""
                style={{
                  fontSize: "1rem",
                  color: "#35B0A7",
                }}
              >
                #{data?.phone?.slice(1)}
              </p>
              <div
                className="d-flex justify-content-between "
                style={{
                  marginTop: "20px",
                }}
              >
                <p>Date:</p> <p>{currentDate}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p
                  style={{
                    marginLeft: "-49px",
                  }}
                >
                  Payment Method:
                </p>{" "}
                <p className="">{data?.paymentType}</p>
              </div>
            </div>
          </div>
          {/* Booking Location */}
          <div
            className="d-flex justify-content-between text-left"
            style={{
              marginTop: "40px",
            }}
          >
            <div>
              <p
                className="fw-bold"
                style={{
                  color: "#35B0A7",
                }}
              >
                Booking Location,
              </p>
              <p>
                <span className="fw-bold">Branch :</span> {data?.branch?.name}
              </p>
              <p>
                <span className="fw-bold">Address :</span>

                {data?.branch?.branchAddress}
              </p>
              <p>
                <span className="fw-bold">Mobile :</span>{" "}
                {data?.branch?.branchMobileNumber}
              </p>
              <p>
                <span className="fw-bold">Email :</span>{" "}
                {data?.branch?.branchEmail}
              </p>
            </div>
            <div>
              <div className="text-left ">
                <p
                  className=" fw-bold "
                  style={{
                    color: "#35B0A7",
                  }}
                >
                  Bill To,
                </p>
                <p className="">
                  <span className="fw-bold">Name :</span> {data?.fullName}
                </p>
                <p
                  className="w-[180px]"
                  style={{
                    width: "180px",
                  }}
                >
                  <span className="fw-bold">Address :</span> {data?.address}
                </p>
                <p className="">
                  <span className="fw-bold">Mobile :</span> {data?.phone}
                </p>
                <p>
                  <span className="fw-bold">Email :</span> {data?.email}
                </p>

                <div
                  className=""
                  style={{
                    marginTop: "10px",
                  }}
                >
                  <p>
                    Check in Time : {data?.bookingInfo?.rentDate?.bookStartDate}
                  </p>
                  <p>
                    Check Out Time : {data?.bookingInfo?.rentDate?.bookEndDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Booking Table */}

          <div>
            <div
              className=" booking-table text-white"
              style={{ backgroundColor: "#35B0A7" }}
            >
              <div className="row py-1.5 px-3">
                <div className="d-flex col-lg-6 col-md-6  fw-medium">
                  <p>No</p>
                  <p
                    style={{
                      marginLeft: "40px",
                    }}
                  >
                    Service Name
                  </p>
                </div>
                <div className="d-flex justify-content-between col-lg-6">
                  <p>Total Duration</p>
                  <p>Amount</p>
                </div>
              </div>
            </div>
            <div
              className=" booking-table"
              style={{
                backgroundColor: "rgba(53, 176, 167, 0.10)",
              }}
            >
              <div className="row py-1.5 px-3">
                <div className="d-flex col-lg-6 col-md-6  fw-medium">
                  <p>01.</p>
                  {data?.bookingInfo?.roomType === "Shared Room" ? (
                    <p style={{ marginLeft: "40px" }}>
                      {data?.bookingInfo?.roomName +
                        ", Room Number : " +
                        data?.bookingInfo?.roomNumber +
                        ", Seat Number : " +
                        data?.bookingInfo?.seatBooking?.seatNumber}
                    </p>
                  ) : (
                    <p style={{ marginLeft: "40px" }}>
                      {data?.bookingInfo?.data?.name +
                        ", Room Number : " +
                        data?.bookingInfo?.data?.roomNumber}
                    </p>
                  )}
                </div>
                <div className="d-flex  justify-content-between col-lg-6 col-md-6">
                  <p>
                    {data?.bookingInfo?.customerRent?.daysDifference >= 0
                      ? `${data?.bookingInfo?.customerRent?.daysDifference} days`
                      : "" ||
                        (data?.bookingInfo?.customerRent?.months &&
                          data?.bookingInfo?.customerRent?.days >= 0 &&
                          !data?.bookingInfo?.customerRent?.years)
                      ? `${data?.bookingInfo?.customerRent?.months} months, ${data?.bookingInfo?.customerRent?.days} days`
                      : "" ||
                        (data?.bookingInfo?.customerRent?.years &&
                          data?.bookingInfo?.customerRent?.months >= 0 &&
                          data?.bookingInfo?.customerRent?.days >= 0)
                      ? `${data?.bookingInfo?.customerRent?.years} year`
                      : ""}
                  </p>
                  <p>BDT {data?.payableAmount}</p>
                </div>
              </div>
            </div>
            <div
              className=" booking-table "
              style={{
                height: "30px",
              }}
            >
              <div className="row py-1.5 px-3">
                <div className="d-flex col-lg-6 col-md-6 fw-medium"></div>
                <div className="d-flex  justify-content-between"></div>
              </div>
            </div>
            <div
              className=" booking-table "
              style={{
                backgroundColor: "rgba(53, 176, 167, 0.10)",
                height: "30px",
              }}
            >
              <div className="row py-1.5 px-3">
                <div className="d-flex col-lg-6 col-md-6 fw-medium"></div>
                <div className="d-flex justify-content-between"></div>
              </div>
            </div>
            <div
              className=" booking-table "
              style={{
                height: "30px",
              }}
            >
              <div className="row py-1.5 px-3">
                <div className="d-flex col-lg-6 col-md-6 fw-medium"></div>
                <div className="d-flex justify-content-between"></div>
              </div>
            </div>
            <div
              className=" booking-table "
              style={{
                backgroundColor: "rgba(53, 176, 167, 0.10)",
                height: "30px",
              }}
            >
              <div className="row py-1.5 px-3">
                <div className="d-flex col-lg-6 col-md-6 fw-medium"></div>
                <div className="d-flex justify-content-between"></div>
              </div>
            </div>
            <div
              className=" booking-table"
              style={{
                height: "30px",
              }}
            >
              <div className="row py-1.5 px-3">
                <div className="d-flex col-lg-6 col-md-6  fw-medium"></div>
                <div className="d-flex  justify-content-between"></div>
              </div>
            </div>
            <div
              className=" booking-table "
              style={{
                backgroundColor: "rgba(53, 176, 167, 0.10)",
                height: "30px",
              }}
            >
              <div className="row py-1.5 px-3">
                <div className="d-flex col-lg-6 col-md-6  fw-medium"></div>
                <div className="d-flex justify-content-between"></div>
              </div>
            </div>
            {/* Booking Total Tk */}

            <div
              className="d-flex justify-content-between text-left"
              style={{
                marginTop: "40px",
              }}
            >
              <div className="total-amount-left">
                <p className="text-white fw-bold mb-2 ">
                  <span
                    className="p-1 rounded"
                    style={{
                      backgroundColor: "#35B0A7",
                    }}
                  >
                    Payment Received By
                  </span>
                </p>
                <p>
                  <span className="fw-bold mr-3">Payment Method : </span>{" "}
                  {data?.paymentType}
                </p>
                <p>
                  <span className="fw-bold mr-3">Account Number :</span>{" "}
                  {data?.paymentNumber}
                </p>

                <p>
                  <span className="fw-bold mr-3">
                    Transaction ID{" "}
                    <span
                      className="ml-[10px]"
                      style={{
                        marginLeft: "10px",
                      }}
                    >
                      :
                    </span>
                  </span>{" "}
                  {data?.transactionId}
                </p>
              </div>
              <div>
                <div
                  className="text-right total-amount-right "
                  style={{
                    fontWeight: 600,
                  }}
                >
                  <div className="d-flex justify-content-between">
                    <p className="fw-bold">Subtotal</p>{" "}
                    <p
                      style={{
                        marginLeft: "55px",
                      }}
                    >
                      :
                    </p>{" "}
                    <p className="">
                      BDT {data?.bookingInfo?.subTotal?.toLocaleString()}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between">
                    <p className="fw-bold">VAT </p>{" "}
                    <p className="ml-[70px]">:</p>
                    <p className="">
                      BDT {data?.bookingInfo?.vatTax?.toLocaleString()}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="fw-bold">Addmission Fee</p>
                    <p className="mx-5">:</p>
                    <p className="">
                      BDT{" "}
                      {data?.bookingInfo?.addMissionFee > 0
                        ? data?.bookingInfo?.addMissionFee?.toLocaleString()
                        : 0}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="fw-bold">Security Fee </p>{" "}
                    <p className="ms-4">:</p>
                    <p className="">
                      BDT{" "}
                      {data?.bookingInfo?.securityFee > 0
                        ? data?.bookingInfo?.securityFee?.toLocaleString()
                        : 0}
                    </p>
                  </div>
                  <hr style={{ marginTop: "4px" }} />
                  <div className="d-flex justify-content-between">
                    <p className="fw-bold">Total </p>
                    <p style={{ marginLeft: "68px" }}>:</p>
                    <p className="">
                      BDT {data?.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="fw-bold">Discount</p>
                    <p
                      style={{
                        marginLeft: "32px",
                      }}
                    >
                      :
                    </p>
                    <p className="">
                      BDT {data?.bookingInfo?.discount?.toLocaleString()}
                    </p>
                  </div>
                  <hr style={{ marginTop: "4px" }} />
                  <div className="paid-amount d-flex justify-content-between">
                    <p
                      className="fw-bold "
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Payable
                    </p>{" "}
                    <p
                      style={{
                        marginLeft: "55px",
                      }}
                    >
                      :
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      BDT {data?.payableAmount?.toLocaleString()}
                    </p>
                  </div>
                  <hr style={{ marginTop: "4px" }} />
                  <div className="paid-amount d-flex justify-content-between">
                    <p
                      className="fw-bold"
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Paid
                    </p>{" "}
                    <p
                      style={{
                        marginLeft: "55px",
                      }}
                    >
                      :
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      BDT {data?.totalReceiveTk?.toLocaleString()}
                    </p>
                  </div>
                  <hr style={{ marginTop: "4px" }} />
                  <div className="paid-amount d-flex justify-content-between">
                    <p
                      className="fw-bold "
                      style={{
                        color: data?.dueAmount > 0 ? "red" : "",
                        fontSize: "12px",
                      }}
                    >
                      Due
                    </p>
                    <p
                      style={{
                        marginLeft: "75px",
                      }}
                    >
                      :
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      BDT {data?.dueAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Note */}
            <div className="d-flex justify-content-between justify-items-center">
              <div className="note-area">
                <label
                  className="text-left"
                  style={{
                    color: "#35b0a7",
                  }}
                >
                  Note:
                </label>
                <textarea
                  name=""
                  id=""
                  cols="50"
                  rows="3"
                  className="rounded pl-2"
                  style={{ width: "100%" }}
                  disabled
                ></textarea>
              </div>
              <div
                className="pr-5 signature"
                style={{
                  marginTop: "50px",
                  fontWeight: 500,
                }}
              >
                <p>Authorized Signature</p>
                <hr style={{ width: "200px", marginTop: "24px" }} />
              </div>
            </div>
            {/* Term and Condition */}
            <div className="text-left ">
              <p>Terms:</p>
              <p className="font-medium">
                Please Read All Terms and Conditions
              </p>
            </div>
          </div>
        </div>
        {/* Invoice Footer */}
        <div
          className="d-flex justify-content-between py-2 text-white invoice-footer "
          style={{
            backgroundColor: "#35B0A7",
            padding: "0 40px",
          }}
        >
          <p>Head Office : House-23, Road-03, Dhanmondi, Dhaka</p>
          <p>Mobile: +880123456789</p>
          <p>www.psh.com.bd</p>
        </div>
        <h3 className="text-xl px-5 py-2" style={{ marginTop: "50px" }}>
          Terms And Condition
        </h3>
        <div
          className=" px-5 w-auto sm:w-[952px]"
          style={{ marginTop: "12px" }}
        >
          <p>
            1.Booking and Reservation: All bookings are subject to availability.
          </p>
          <p>
            2.Cancellation Policy: Cancellations made [X days/hours] prior to
            the check-in date will receive a full refund.
          </p>
          <p>
            3.Check-In and Check-Out: Check-in time is at 3:00 PM, and check-out
            time is at 11:00 AM.
          </p>
          <p>
            4.Room Occupancy: Each room is designed to accommodate a specific
            number of guests.
          </p>
          <p>
            5.Payment and Fees: Payment can be made through [accepted payment
            methods].
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
