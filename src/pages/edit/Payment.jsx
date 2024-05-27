import { Modal } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import "./Payment.css";

const Payment = ({ data, refetch, isLoading }) => {
  const [paymentType, setPaymentType] = useState("Payment Type");
  const [customerType, setCustomerType] = useState("Customer Type");
  const paymentOption = ["Receive", "Adjustment"];
  const [paymentOptionValue, setPaymentOptionValue] = useState(0);
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);
  const [receivedTk, setReciveTk] = useState(0);
  const [loading, setLoading] = useState(false);
  const closeButtonRef = useRef(null);
  const handleClickCloseButton = () => {
    // Check if the closeButtonRef exists
    if (closeButtonRef.current) {
      // Trigger the click event on the close button
      closeButtonRef.current.click();
    }
  };
  // for Update Payment Status
  useEffect(() => {
    refetch();
  }, [data?.payableAmount, data?.totalReceiveTk, refetch]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (paymentType === "Payment Type") {
      return toast.warn("Please Select Payment Type");
    }
    if (customerType === "Customer Type") {
      return toast.warn("Please Select Customer Type");
    }
    if (Number(receivedTk) === 0) {
      return toast.warn(`Sorry ! 0 Tk Receive Not Acceptable`);
    }
    // const receivedTk = e.target.receivedTk.value;
    // const dueAmount =
    //   data?.payableAmount -
    //   Number(discount) -
    //   (data?.totalReceiveTk + Number(receivedTk));
    const dueAmount =
      data?.payableAmount - (data?.totalReceiveTk + Number(receivedTk));

    if (data?.dueAmount < Number(receivedTk)) {
      return toast.warn(`Sorry ! Your Due ${data?.dueAmount}`);
    }

    if (data?.payableAmount === data?.totalReceiveTk) {
      return toast.warn(`Sorry ! This Order Payment Already Paid`);
    }
    if (data?.payableAmount < Number(receivedTk)) {
      return toast.warn(`Sorry Your Total Tk ${data?.payableAmount}`);
    }
    setLoading(true);
    const receivedPayment = {
      paymentDate: e.target?.paymentDate?.value,
      customerType: customerType,
      whichOfMonthPayment: e.target?.whichOfMonthPayment?.value,
      totalAmount: data?.bookingInfo?.totalAmount,
      payableAmount: data?.payableAmount,
      // discount: data?.discount,
      receivedTk: Number(receivedTk),
      dueAmount: dueAmount,
      totalReceiveTk: data?.totalReceiveTk + Number(receivedTk),
      paymentType: paymentType,
      // paymentStatus: "Unpaid",
      paymentNumber: e.target?.paymentNumber?.value,
      transactionId: e.target?.transactionId?.value,
      bankName: e.target?.bankName?.value,
      bankHoldingName: e.target?.bankHoldingName?.value,
      receiverName: e.target?.receiverName?.value,
      acceptableStatus: paymentType === "cash" ? "Accepted" : "Pending",
      // unReceivedTk: 0,
    };
    handleClickCloseButton();
    try {
      await axios.patch(
        `https://psh-server-test.onrender.com/api/order/${data?._id}`,
        receivedPayment,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      e.target.reset();
      setLoading(false);
      refetch();
      toast.success("Payment Successfully Done");
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  };

  // Handle Adjustment Request

  const handleAdjustment = async (e) => {
    e.preventDefault();

    //If Discount Amount <= 0
    if (Number(adjustmentAmount) <= 0) {
      return toast.warn(`Sorry ! 0 Tk Adjustment Not Acceptable`);
    }

    // Validation for Due Amount
    if (data?.dueAmount < Number(adjustmentAmount)) {
      return toast.warn(`Sorry ! Your Due ${data?.dueAmount}`);
    }

    //If Discount Amount > payable Amount
    if (data?.payableAmount < Number(adjustmentAmount)) {
      return toast.warn(
        `Sorry ! Your Payable Amount ${
          data?.payableAmount
        } But you give have discount ${Number(adjustmentAmount)}`
      );
    }
    setLoading(true);
    const adjustment = {
      adjustment: adjustmentAmount,
    };
    handleClickCloseButton();
    try {
      await axios.patch(
        `https://psh-server-test.onrender.com/api/order/${data._id}`,
        adjustment,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Success");
      setLoading(false);
      refetch();
    } catch (error) {
      return toast.error(error.response.data.message);
    }
    e.target.reset();
  };
  // Handle Reduce Payment

  const handleReducePayment = async (e) => {
    e.preventDefault();
    const unReceivedTk = e.target.unReceivedTk.value;

    if (Number(unReceivedTk) > data?.totalReceiveTk) {
      return toast.warn(
        `Sorry ! You Total Received Tk ${data?.totalReceiveTk}`
      );
    }

    const dueAmount =
      data.bookingInfo.totalAmount -
      (data?.totalReceiveTk - Number(unReceivedTk));

    const reducePayment = {
      paymentDate: e.target?.paymentDate?.value,

      totalAmount: data.bookingInfo.totalAmount,
      receivedTk: 0,
      unReceivedTk: Number(unReceivedTk),
      dueAmount: dueAmount,
      totalReceiveTk: data?.totalReceiveTk - Number(unReceivedTk),
      paymentType: paymentType,
      paymentStatus: "Unpaid",
      paymentNumber: e.target?.paymentNumber?.value,
      transactionId: e.target?.transactionId?.value,
      bankName: e.target?.bankName?.value,
      bankHoldingName: e.target?.bankHoldingName?.value,
      receiverName: e.target?.receiverName?.value,
    };

    try {
      await axios.patch(
        `https://psh-server-test.onrender.com/api/order/${data._id}`,
        reducePayment,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      e.target.reset();
      toast.success("Success");
      refetch();
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  };

  return (
    <div className="container">
      <div
        className="modal fade"
        id={`payment${data?._id}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Payment
              </h1>{" "}
              <button
                type="button"
                ref={closeButtonRef}
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleClickCloseButton}
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex gx-5">
                {paymentOption?.map((option, index) => (
                  <p
                    key={index}
                    style={{
                      // cursor: "pointer",
                      backgroundColor:
                        paymentOptionValue === index ? "#00BBB4" : "",
                      color: paymentOptionValue === index ? "white" : "",
                      cursor: "pointer",
                      padding: "5px",
                    }}
                    className="fs-5 rounded"
                    onClick={() => setPaymentOptionValue(index)}
                  >
                    {option}
                  </p>
                ))}
              </div>
              {paymentOptionValue === 0 ? (
                <form onSubmit={handlePayment}>
                  <div className="d-flex gap-3 justify-items-center">
                    <div>
                      <label htmlFor="" className="fs-5 fw-normal">
                        Payment Date
                      </label>
                      <br />
                      <input
                        type="date"
                        placeholder="Payment Date"
                        id=""
                        className="px-2 rounded"
                        style={{ width: "300px", height: "40px" }}
                        name="paymentDate"
                        min={new Date()}
                        required
                      />{" "}
                    </div>

                    <div className="">
                      <label htmlFor="">Payment Method</label>
                      <br />
                      <select
                        name="paymentType"
                        id=""
                        className="rounded"
                        style={{
                          width: "150px",
                          height: "40px",
                          marginTop: "5px",
                        }}
                        required
                        onChange={(e) => setPaymentType(e.target.value)}
                        defaultValue={paymentType}
                      >
                        <option disabled>Payment Type</option>
                        <option value="bkash">Bkash</option>
                        <option value="nagad">Nagad</option>
                        <option value="dutch">dutch-bangla</option>
                        <option value="cash">Cash</option>
                        <option value="bank">Bank</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <div>
                      <label htmlFor="" className="fs-5 fw-normal">
                        Received Amount
                      </label>
                      <br />
                      <input
                        onChange={(e) => setReciveTk(e.target.value)}
                        type="number"
                        placeholder="Type Received Tk 
                "
                        id=""
                        className="px-2 rounded"
                        style={{ width: "300px", height: "40px" }}
                        name="receivedTk"
                        required
                      />{" "}
                      <br />
                    </div>

                    <div>
                      <label htmlFor="" className="fs-5 fw-normal">
                        Customer Type
                      </label>
                      <br />
                      <select
                        style={{ width: "300px", height: "40px" }}
                        required
                        onChange={(e) => setCustomerType(e.target.value)}
                        defaultValue={customerType}
                      >
                        <option disabled>Customer Type</option>
                        <option value="Working Days">Working Days</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>
                    {customerType === "Monthly" || customerType === "Yearly" ? (
                      <div>
                        <label htmlFor="" className="fs-5 fw-normal">
                          Which of Month Payment
                        </label>
                        <br />
                        <select
                          style={{ width: "300px", height: "40px" }}
                          required
                          name="whichOfMonthPayment"
                        >
                          <option disabled>Which of Month Payment</option>
                          <option value="January">January</option>
                          <option value="February">February</option>
                          <option value="March">March</option>
                          <option value="April">April</option>
                          <option value="May">May</option>
                          <option value="Jun">Jun</option>
                          <option value="July">July</option>
                          <option value="Agust">Agust</option>
                          <option value="October">October</option>
                          <option value="November">November</option>
                          <option value="December">December</option>
                        </select>
                      </div>
                    ) : (
                      ""
                    )}

                    {paymentType === "Payment Type" ? (
                      ""
                    ) : (
                      <>
                        {paymentType !== "cash" && paymentType !== "bank" ? (
                          <>
                            <label htmlFor="" className="fs-5 fw-normal">
                              Payment Number
                            </label>
                            <br />
                            <input
                              type="text"
                              placeholder="Type Payment Number "
                              id=""
                              className="px-2 rounded mt-2"
                              style={{ width: "300px", height: "40px" }}
                              name="paymentNumber"
                              required
                            />
                            <br />
                            <label htmlFor="" className="fs-5 fw-normal">
                              Transaction Id
                            </label>
                            <br />
                            <input
                              type="text"
                              placeholder="Type Transaction Id"
                              id=""
                              className="px-2 rounded mt-2"
                              style={{ width: "300px", height: "40px" }}
                              name="transactionId"
                              required
                            />
                            <br />
                          </>
                        ) : (
                          ""
                        )}

                        {paymentType === "bank" ? (
                          <>
                            <label htmlFor="" className="fs-5 fw-normal">
                              Bank Name
                            </label>
                            <br />
                            <input
                              type="text"
                              placeholder="Type Bank Name 
                                                        "
                              id=""
                              className="px-2 rounded mt-2"
                              style={{ width: "300px", height: "40px" }}
                              name="bankName"
                              required
                            />
                            <br />
                            <label htmlFor="" className="fs-5 fw-normal">
                              Bank Holding Name
                            </label>
                            <br />
                            <input
                              type="text"
                              placeholder="Type Holding Name
                                                              "
                              id=""
                              className="px-2 rounded mt-2"
                              style={{ width: "300px", height: "40px" }}
                              name="bankHoldingName"
                              required
                            />
                            <br />
                          </>
                        ) : (
                          ""
                        )}
                        <label htmlFor="" className="fs-5 fw-normal">
                          Receiver Name
                        </label>
                        <br />
                        <input
                          type="text"
                          placeholder="Receiver Name"
                          id=""
                          className="px-2 rounded mt-2"
                          style={{ width: "300px", height: "40px" }}
                          name="receiverName"
                          required
                        />
                        <br />
                      </>
                    )}
                  </div>
                  <div className="mt-3">
                    {/* <div className="text-right total-amount-right font-[600] ">
                      <div className="d-flex ">
                        <p className="fw-bold">Total :</p>

                        <p className="ms-5">{data?.totalAmount} Tk</p>
                      </div>
                      <div className="d-flex ">
                        <p className="fw-bold">Discount :</p>

                        <p className=" ms-5">{data?.discount} Tk</p>
                      </div>
                      <div className="d-flex ">
                        <p className="fw-bold">Payable :</p>

                        <p className=" ms-5">{data?.payableAmount} Tk</p>
                      </div>

                      <div className="paid-amount d-flex ">
                        <p className="fw-bold ">Recieve :</p>
                        <p className=" ms-5">
                          {" "}
                          {data?.totalReceiveTk + Number(receivedTk)} Tk
                        </p>
                      </div>

                      <div className="paid-amount d-flex ">
                        <p
                          className="fw-bold "
                          style={{
                            color: data?.dueAmount > 0 ? "red" : "",
                          }}
                        >
                          Due :
                        </p>

                        <p className=" text-[12px] ms-5">
                          {data?.dueAmount - Number(receivedTk)} Tk
                        </p>
                      </div>
                    </div> */}
                  </div>
                  <input
                    type="submit"
                    className="mt-2 px-4 py-1 rounded text-white"
                    id=""
                    style={{
                      fontSize: "18px",
                      backgroundColor:
                        data?.totalReceiveTk === data?.payableAmount
                          ? "rgb(170 221 220)"
                          : "#00BBB4",
                      border: "none",
                    }}
                    disabled={
                      loading
                        ? true
                        : false || data?.totalReceiveTk === data?.payableAmount
                        ? true
                        : false
                    }
                  />
                </form>
              ) : (
                ""
              )}

              {paymentOptionValue === 1 ? (
                <form onSubmit={handleAdjustment}>
                  <div>
                    <label htmlFor="" className="fs-5 fw-normal">
                      Adjustment Amount
                    </label>
                    <br />
                    <input
                      type="number"
                      placeholder="Adjustment Amount"
                      id=""
                      className="px-2 rounded"
                      style={{ width: "300px", height: "40px" }}
                      name="discount"
                      onChange={(e) => setAdjustmentAmount(e.target.value)}
                    />{" "}
                    <br />
                  </div>
                  <div className="mt-3">
                    <div className="text-right total-amount-right font-[600] ">
                      <div className="d-flex ">
                        <p className="fw-bold">Total :</p>

                        <p className="ms-5">{data?.totalAmount} Tk</p>
                      </div>
                      <div className="d-flex ">
                        <p className="fw-bold">Already Discount :</p>

                        <p className=" ms-5">{data?.discount} Tk</p>
                      </div>
                      <div className="d-flex ">
                        <p className="fw-bold">Payable :</p>

                        <p className=" ms-5">{data?.payableAmount} Tk</p>
                      </div>

                      <div className="paid-amount d-flex ">
                        <p className="fw-bold ">Recieve :</p>
                        <p className=" ms-5"> {data?.totalReceiveTk} Tk</p>
                      </div>

                      <div className="paid-amount d-flex ">
                        <p
                          className="fw-bold "
                          style={{
                            color: data?.dueAmount > 0 ? "red" : "",
                          }}
                        >
                          Due :
                        </p>

                        <p className=" text-[12px] ms-5">
                          {data?.dueAmount} Tk
                        </p>
                      </div>
                    </div>
                  </div>
                  <input
                    type="submit"
                    className="mt-2 px-4 py-1 rounded text-white"
                    id=""
                    style={{
                      fontSize: "18px",
                      backgroundColor:
                        data?.totalReceiveTk === data?.payableAmount
                          ? "rgb(170 221 220)"
                          : "#00BBB4",
                      border: "none",
                    }}
                    value="Adjustment Request"
                    disabled={
                      loading
                        ? true
                        : false || data?.totalReceiveTk === data?.payableAmount
                        ? true
                        : false
                    }
                  />
                </form>
              ) : (
                ""
              )}

              {/* {paymentOptionValue === 1 ? (
                <form onSubmit={handleReducePayment}>
                  <div className="d-flex gap-3 justify-items-center">
                    <div>
                      <label htmlFor="" className="fs-5 fw-normal">
                        Which Payment Date
                      </label>
                      <br />
                      <input
                        type="date"
                        placeholder="Payment Date"
                        id=""
                        className="px-2 rounded"
                        style={{ width: "300px", height: "40px" }}
                        name="paymentDate"
                        min={new Date()}
                        required
                      />{" "}
                    </div>

                    <div className="">
                      <label htmlFor="" className="fw-normal">
                        {" "}
                        Which Payment Method
                      </label>
                      <br />
                      <select
                        name="paymentType"
                        id=""
                        className="rounded"
                        style={{
                          width: "150px",
                          height: "40px",
                          marginTop: "5px",
                        }}
                        required
                        onChange={(e) => setPaymentType(e.target.value)}
                        defaultValue={paymentType}
                      >
                        <option disabled> Which Payment Type</option>
                        <option>Bkash</option>
                        <option>Nagad</option>
                        <option>dutch-bangla</option>
                        <option>Cash</option>
                        <option>Bank</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <div>
                      <label htmlFor="" className="fs-5 fw-normal">
                        Reduce Amount
                      </label>
                      <br />
                      <input
                        type="number"
                        placeholder="Type Received Tk 
               "
                        id=""
                        className="px-2 rounded"
                        style={{ width: "300px", height: "40px" }}
                        name="unReceivedTk"
                        required
                      />{" "}
                      <br />
                    </div>
                    {paymentType === "Payment Type" ? (
                      ""
                    ) : (
                      <>
                        {paymentType !== "Cash" && paymentType !== "Bank" ? (
                          <>
                            <label htmlFor="" className="fs-5 fw-normal">
                              Which Payment Number
                            </label>
                            <br />
                            <input
                              type="number"
                              placeholder="Type Payment Number "
                              id=""
                              className="px-2 rounded mt-2"
                              style={{ width: "300px", height: "40px" }}
                              name="paymentNumber"
                              required
                            />
                            <br />
                            <label htmlFor="" className="fs-5 fw-normal">
                              Which Transaction Id
                            </label>
                            <br />
                            <input
                              type="text"
                              placeholder="Type Transaction Id"
                              id=""
                              className="px-2 rounded mt-2"
                              style={{ width: "300px", height: "40px" }}
                              name="transactionId"
                              required
                            />
                            <br />
                          </>
                        ) : (
                          ""
                        )}

                        {paymentType === "Bank" ? (
                          <>
                            <label htmlFor="" className="fs-5 fw-normal">
                              Which Bank Name
                            </label>
                            <br />
                            <input
                              type="text"
                              placeholder="Type Bank Name 
               "
                              id=""
                              className="px-2 rounded mt-2"
                              style={{ width: "300px", height: "40px" }}
                              name="bankName"
                              required
                            />
                            <br />
                            <label htmlFor="" className="fs-5 fw-normal">
                              Which Bank Holding Name
                            </label>
                            <br />
                            <input
                              type="text"
                              placeholder="Type Holding Name
               "
                              id=""
                              className="px-2 rounded mt-2"
                              style={{ width: "300px", height: "40px" }}
                              name="bankHoldingName"
                              required
                            />
                            <br />
                          </>
                        ) : (
                          ""
                        )}
                        <label htmlFor="" className="fs-5 fw-normal">
                          Which Receiver Name
                        </label>
                        <br />
                        <input
                          type="text"
                          placeholder="Receiver Name
               "
                          id=""
                          className="px-2 rounded mt-2"
                          style={{ width: "300px", height: "40px" }}
                          name="receiverName"
                          required
                        />
                        <br />
                      </>
                    )}
                  </div>
                  <input
                    type="submit"
                    className="mt-2 px-4 py-1 rounded text-white"
                    id=""
                    style={{
                      fontSize: "18px",
                      backgroundColor:
                        data?.totalReceiveTk === data.bookingInfo.totalAmount
                          ? "rgb(170 221 220)"
                          : "#00BBB4",
                      border: "none",
                    }}
                    disabled={
                      data?.totalReceiveTk === data.bookingInfo.totalAmount
                        ? true
                        : false
                    }
                  />
                </form>
              ) : (
                ""
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
