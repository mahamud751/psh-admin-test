import axios from "axios";
import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./SeeOrderDetails.css";
import { Table } from "react-bootstrap";

import ReactToPrint from "react-to-print";

import { BlobProvider, View } from "@react-pdf/renderer";
import DownlaodInvoice from "../Invoice/DownlaodInvoice";
import ImageViewer from "./ImageViewer";

const SeeOrderDetails = ({
  transactions,
  data,
  // totalReceiveAmount,
  // setTotalReceiveAmount,
}) => {
  // console.log(data?.bookingInfo);
  const ref = useRef();

  const [branchs, SetBranchs] = useState([]);
  const [singleBranch, setSingleBranch] = useState({});
  const [shareRoomBranch, setShareRoomBranch] = useState({});

  const findOrderTranstion = transactions?.filter(
    (transaction) => transaction?.orderId === data?._id
  );

  let mytotalReceiveTk = 0;

  let totalTransaction = [];

  for (const item of findOrderTranstion) {
    mytotalReceiveTk += item?.receivedTk;

    totalTransaction.push({
      totalReceive: mytotalReceiveTk,
      dueAmount: data?.bookingInfo?.dueAmount - mytotalReceiveTk,
      _id: item?._id,
    });
    // setTotalReceiveAmount(totalTransaction);
  }

  const reversTransaction = findOrderTranstion?.slice().reverse();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://psh-server-test.onrender.com/api/branch"
        );
        SetBranchs(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    const branch = branchs.find(
      (branch) => branch._id === data?.bookingInfo?.data?.branch
    );
    setSingleBranch(branch);
    const shareRoomBranch = branchs.find(
      (branch) => branch._id === data?.bookingInfo?.branch
    );
    setShareRoomBranch(shareRoomBranch);
  }, [branchs, data?.bookingInfo?.data?.branch, data?.bookingInfo?.branch]);

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
              <div className="d-flex justify-items-center">
                <h3> Booking Info</h3> (
                <h5
                  className=" fw-bold text-right"
                  style={{
                    color: data.paymentStatus === "Paid" ? "green" : "red",
                  }}
                >
                  {data.paymentStatus}
                </h5>
                )
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
                Customer Details
              </h3>

              <div className="row px-5">
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Customer Name
                  </label>
                  <p>{data?.fullName}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Father Name
                  </label>
                  <p>{data?.fatherName}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Mother Name
                  </label>
                  <p>{data?.motherName}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Customer Email
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
                    {/* {data?.validityType} */} Identity Number
                  </label>
                  <p>{data?.validityNumber}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Emergency Contact Name :
                  </label>
                  <p>{data?.emergencyContactName}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Emergency Contact Relationship :
                  </label>
                  <p>{data?.emergencyRelationC}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Emergency Contact Number :
                  </label>
                  <p>{data?.emergencyContact}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    National Id
                  </label>
                  <div
                    style={{
                      marginBottom: "100px",
                    }}
                  >
                    <button
                      type="button"
                      className="bg-transparent"
                      data-bs-toggle="modal"
                      data-bs-target={`#image_view${data?._id}`}
                    >
                      <img
                        src={`https://psh-server-test.onrender.com/${data?.image}`}
                        alt=""
                        style={{ width: "100px" }}
                      />
                    </button>
                  </div>
                </div>

                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Parent National Id
                  </label>
                  <div>
                    <button
                      type="button"
                      className="bg-transparent"
                      data-bs-toggle="modal"
                      data-bs-target={`#image_view${data?._id}`}
                    >
                      <img
                        src={`https://psh-server-test.onrender.com/${data?.gardianImg}`}
                        alt=""
                        style={{ width: "100px" }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Room Details */}
              <h3
                className=" fs-4 mt-3 ps-3 rounded"
                style={{ backgroundColor: "#00bbb4", color: "White" }}
              >
                Room Details
              </h3>
              <div className="row px-5">
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Booking Id
                  </label>
                  <p>#{data._id.slice(19)}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Booking Date & Time
                  </label>
                  <p>{formattedDate}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Branch
                  </label>
                  <p>{data?.bookingInfo?.branch?.name}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Room Type
                  </label>
                  <p> {data?.bookingInfo?.roomType}</p>
                </div>
                {data?.bookingInfo?.roomType === "Shared Room" ? (
                  ""
                ) : (
                  <div className="col-lg-3">
                    <label htmlFor="" className="fw-medium">
                      Room Name
                    </label>
                    <p> {data?.bookingInfo?.data?.name}</p>
                  </div>
                )}
                {data?.bookingInfo?.roomType === "Shared Room" ? (
                  <>
                    <div className="col-lg-3">
                      {" "}
                      <label htmlFor="" className="fw-medium">
                        Seat Number
                      </label>
                      <p> {data?.bookingInfo?.seatBooking?.seatNumber}</p>
                    </div>
                    <div className="col-lg-3">
                      {" "}
                      <label htmlFor="" className="fw-medium">
                        Room Number
                      </label>
                      <p> {data?.bookingInfo?.roomNumber}</p>
                    </div>
                  </>
                ) : (
                  <div className="col-lg-3">
                    {" "}
                    <label htmlFor="" className="fw-medium">
                      Room Number
                    </label>
                    <p> {data?.bookingInfo?.data?.roomNumber}</p>
                  </div>
                )}

                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Check In{" "}
                  </label>
                  <p> {data?.bookingInfo?.rentDate?.bookStartDate}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Check Out{" "}
                  </label>
                  <p> {data?.bookingInfo?.rentDate?.bookEndDate}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    {" "}
                    Total Duraion{" "}
                  </label>
                  <p>
                    {" "}
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
                </div>

                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Future Extend{" "}
                  </label>
                  <p> {data?.bookingExtend === true ? "Yes" : "No"}</p>
                </div>
              </div>

              <h3
                className=" fs-4 mt-3 ps-3 rounded"
                style={{ backgroundColor: "#00bbb4", color: "White" }}
              >
                Payment Details
              </h3>

              <div className="row px-5">
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Payment Status
                  </label>
                  <p
                    className="fw-bold"
                    style={{
                      color: data.paymentStatus === "Paid" ? "green" : "red",
                    }}
                  >
                    {data.paymentStatus}
                  </p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Total Amount
                  </label>
                  <p>Tk {data?.totalAmount?.toLocaleString()}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Discount
                  </label>
                  <p>Tk {data?.discount?.toLocaleString()}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Payable Amount
                  </label>
                  <p>Tk {data?.payableAmount?.toLocaleString()}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Total Payment
                  </label>
                  <p>Tk {data?.totalReceiveTk?.toLocaleString()}</p>
                </div>

                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Due Amount
                  </label>
                  <p> Tk {data?.dueAmount?.toLocaleString()}</p>
                </div>

                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Minimum Payment
                  </label>
                  <p>
                    Tk{" "}
                    {data?.bookingInfo?.minimumPayment
                      ? data?.bookingInfo?.minimumPayment?.toLocaleString()
                      : 0}
                  </p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Admission Fee
                  </label>
                  <p>
                    Tk{" "}
                    {data?.bookingInfo?.addMissionFee
                      ? data?.bookingInfo?.addMissionFee?.toLocaleString()
                      : 0}
                  </p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Security Fee
                  </label>
                  <p>
                    Tk{" "}
                    {data?.bookingInfo?.securityFee
                      ? data?.bookingInfo?.securityFee?.toLocaleString()
                      : 0}
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-end ">
                <ReactToPrint
                  trigger={() => (
                    <button
                      className=" px-3 mr-2 rounded text-white font-medium"
                      style={{ backgroundColor: "#35b0a7" }}
                    >
                      Print
                    </button>
                  )}
                  content={() => ref.current}
                />
                <div className="mt-3">
                  <View>
                    <BlobProvider document={<DownlaodInvoice data={data} />}>
                      {({ url }) => (
                        <a
                          href={url}
                          download="invoice.pdf"
                          style={{
                            backgroundColor: "#399",
                          }}
                          className="  px-3 py-3 rounded text-white font-medium "
                        >
                          Invoice
                        </a>
                      )}
                    </BlobProvider>
                  </View>
                </div>
              </div>
              <div ref={ref} className="mb-4">
                <h3
                  className=" fs-4 mt-3 ps-3 rounded mb-2"
                  style={{ backgroundColor: "#00bbb4", color: "White" }}
                >
                  Transaction
                  {/* <span className="fw-bold"> {data.paymentStatus}</span> */}
                </h3>

                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Booking Id</th>
                      <th>Branch</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Receive Amount</th>
                      <th>Payment Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reversTransaction?.map((transaction) => {
                      // Find Total Receive Payment and Due Amount

                      // const transactionDate = new Date(
                      //   transaction?.createdAt
                      // ).toLocaleString();

                      return (
                        <tr key={transaction._id}>
                          <td>{transaction?.paymentDate.split("T")[0]}</td>

                          <td className="fw-bold">
                            #{transaction?.orderId.slice(19)}
                          </td>
                          <td className="fw-bold">
                            {transaction?.branch?.name}
                          </td>
                          <td className="fw-bold">{transaction?.userName}</td>

                          <td className="fw-bold">{transaction?.userEmail}</td>
                          <td className="fw-bold">{transaction?.userPhone}</td>
                          <td className="fw-bold" style={{ color: "green" }}>
                            Tk {transaction?.receivedTk?.toLocaleString()}
                          </td>
                          <td>
                            {" "}
                            {transaction?.paymentType === "bkash" ||
                            transaction?.paymentType === "nagad" ? (
                              <span>
                                {" "}
                                {transaction?.paymentType},{" "}
                                {transaction?.paymentNumber}, Trx :{" "}
                                {transaction?.transactionId}
                              </span>
                            ) : (
                              transaction?.paymentType
                            )}
                            {transaction?.paymentType === "bank" ? (
                              <span>
                                {" "}
                                {transaction?.paymentType},{" "}
                                {transaction?.bankName},
                                {transaction?.bankHoldingName}
                              </span>
                            ) : (
                              ""
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <div className=" d-flex justify-content-end gap-5 ">
                  <div className="d-flex">
                    <label htmlFor="">Total Amount </label>
                    <p> = Tk {data?.payableAmount?.toLocaleString()}</p>
                  </div>
                  <div className="d-flex">
                    <label htmlFor=""> Total Receive </label>
                    <p> = Tk {data?.totalReceiveTk?.toLocaleString()}</p>
                  </div>
                  <div className="d-flex">
                    <label htmlFor="">Due Amount </label>
                    <p className="text-danger fw-bold">
                      = Tk {data?.dueAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              {data?.isCancel === "Yes" ? (
                <div>
                  <h3
                    className=" fs-5 mt-3 ps-3 rounded mb-2"
                    style={{ backgroundColor: "red", color: "White" }}
                  >
                    Customer Cancel Request
                  </h3>
                  <div className="row px-5">
                    <div className="col-lg-3">
                      <label htmlFor="" className="fw-medium">
                        Cancel Reason
                      </label>
                      <p className="fw-bold">{data.userCancel?.cancelReason}</p>
                    </div>
                    <div className="col-lg-3">
                      <label htmlFor="" className="fw-medium">
                        Cancel Type
                      </label>
                      <p className="fw-bold">{data.userCancel?.cancelType}</p>
                    </div>
                    {data.userCancel?.cancelDate ? (
                      <div className="col-lg-3">
                        <label htmlFor="" className="fw-medium">
                          Cancel Date
                        </label>
                        <p className="fw-bold">
                          {data.userCancel?.cancelDate?.split("T")[0]}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      <ImageViewer data={data} />
    </div>
  );
};

export default SeeOrderDetails;
