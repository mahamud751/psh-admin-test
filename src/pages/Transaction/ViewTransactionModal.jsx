import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const ViewTransactionModal = ({ data, bookings }) => {
  // console.log(data?.bookingInfo);

  const [branchs, SetBranchs] = useState([]);
  const [singleBranch, setSingleBranch] = useState({});
  const [shareRoomBranch, setShareRoomBranch] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.psh.com.bd/api/branch");
        SetBranchs(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    const branch = branchs.find((branch) => branch._id === data?.branch);
    setSingleBranch(branch);

    const shareRoomBranch = branchs.find(
      (branch) => branch._id === data?.branch
    );
    setShareRoomBranch(shareRoomBranch);
  }, [branchs, data?.branch]);

  const findBookig = bookings?.find(
    (booking) => booking?._id === data?.orderId
  );

  const formattedDate = new Date(data?.createdAt).toLocaleString();

  // Find Total Receive Amount
  // const findTotalReceive = totalReceiveAmount.find(
  //   (receive) => receive._id === data?._id
  // );

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
              <h3>Transaction Details</h3>
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
                  <p>{data?.userName}</p>
                </div>
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Customer Email
                  </label>
                  <p>{data?.userEmail}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Phone Number
                  </label>
                  <p>{data?.userPhone}</p>
                </div>
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Branch
                  </label>
                  <p>{data?.branch?.name}</p>
                </div>
              </div>
              {/* Room Details */}

              <h3
                className=" fs-4 mt-3 ps-3 rounded"
                style={{ backgroundColor: "#00bbb4", color: "White" }}
              >
                Payment Details
              </h3>

              <div className="row px-5">
                <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Payment Date & Time
                  </label>
                  <p>{formattedDate}</p>
                </div>
                {/* <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Payment Status
                  </label>
                  <p
                    className="fw-bold"
                    style={{
                      color:
                        findBookig?.paymentStatus === "Paid" ? "green" : "red",
                    }}
                  >
                    {" "}
                    {findBookig?.paymentStatus}
                  </p>
                </div> */}

                {/* <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Total Amount
                  </label>
                  <p>Tk {data?.totalAmount}</p>
                </div> */}
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Recieve Amount
                  </label>
                  <p>Tk {data?.receivedTk?.toLocaleString()}</p>
                </div>
                {/* <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Total Receive Amount
                  </label>
                  <p>Tk {data?.totalReceive}</p>
                </div> */}

                {/* <div className="col-lg-3">
                  <label htmlFor="" className="fw-medium">
                    Due Amount
                  </label>
            
                </div> */}
                <div className="col-lg-3">
                  {" "}
                  <label htmlFor="" className="fw-medium">
                    Payment info
                  </label>
                  <div>
                    {data?.paymentType === "bkash" ||
                    data?.paymentType === "nagad" ? (
                      <span className="fw-bold">
                        {" "}
                        {data?.paymentType}, {data?.paymentNumber}, Trx :{" "}
                        {data?.transactionId}
                      </span>
                    ) : (
                      data?.paymentType
                    )}
                    {data?.paymentType === "bank" ? (
                      <span>
                        {" "}
                        {data?.paymentType}, {data?.bankName},
                        {data?.bankHoldingName}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTransactionModal;
