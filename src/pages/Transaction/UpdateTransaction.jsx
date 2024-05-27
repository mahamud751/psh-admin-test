import React, { useEffect, useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import useBooking from "../../hooks/useBooking";

const UpdateTransaction = ({
  data,
  refetch,
  isLoadin,
  transactions,
  // bookings,
  setUserAllBooking,
}) => {
  const [paymentType, setPaymentType] = useState(data?.paymentType);
  // const [discount, setDiscount] = useState(0);
  const [bookings] = useBooking();
  const [customerType, setCustomerType] = useState(data?.customerType);
  const paymentOption = ["Receive"];
  const [paymentOptionValue, setPaymentOptionValue] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [receivedTk, setReciveTk] = useState(0);
  const findBookig = bookings?.find(
    (booking) => booking?._id === data?.orderId
  );

  useEffect(() => {
    setPaymentType(data?.paymentType);
    setCustomerType(data?.customerType);
    refetch();

    const findBookings = bookings?.filter(
      (booking) =>
        booking?.email === data?.userEmail && booking.paymentStatus !== "Paid"
    );
    setUserAllBooking(findBookings);
    // const findOrderTranstion = transactions?.filter(
    //   (transaction) => transaction?.orderId === data?.orderId
    // );
    // let mytotalReceiveTk = 0;
    // let dueAmount = 0;
    // let totalTransaction = [];
    // for (const item of findOrderTranstion) {
    //   mytotalReceiveTk += item.receivedTk;

    //   for (let i = findOrderTranstion.length - 1; i >= 0; i--) {
    //     dueAmount += findOrderTranstion[i].receivedTk;
    //   }
    //   totalTransaction.push({
    //     totalReceive: mytotalReceiveTk,

    //     dueAmount: findBookig?.bookingInfo?.totalAmount - dueAmount,
    //     _id: item?._id,
    //   });
    //   setUserAllBooking(totalTransaction);
    // }
  }, [
    data?.paymentType,
    data?.customerType,
    data?.userEmail,
    bookings,
    data?.totalAmount,
    data?.payableAmount,
    data?.totalReceiveTk,
    refetch,
    findBookig?.dueAmount,
    data?.receivedTk,
    data?.orderId,
    findBookig?.bookingInfo?.dueAmount,
    findBookig?.bookingInfo?.totalAmount,
    setUserAllBooking,
    transactions,
  ]);

  // find Total Receive Amount

  // const findOrderTranstion = transactions?.filter(
  //   (transaction) => transaction?.orderId === data?.orderId
  // );

  // for (const item of findOrderTranstion) {
  //   mytotalReceiveTk += item.receivedTk;

  //   totalTransaction.push({
  //     totalReceive: mytotalReceiveTk,
  //     dueAmount: findBookig?.bookingInfo?.dueAmount - mytotalReceiveTk,
  //     _id: item?._id,
  //   });
  //   setTotalReceiveAmount(totalTransaction);
  // }

  // End Find Total Receive Amount

  const handlePayment = async (e) => {
    e.preventDefault();

    // const due =
    //   findBookig?.bookingInfo?.totalAmount -
    //   (findBookig?.totalReceiveTk + Number(receivedTk));

    if (paymentType === "Payment Type") {
      return toast.warn("Please Select Payment Type");
    }
    if (customerType === "Customer Type") {
      return toast.warn("Please Select Customer Type");
    }
    // const dueAmount = data?.totalAmount - Number(receivedTk);

    if (findBookig?.dueAmount + data?.receivedTk < Number(receivedTk)) {
      return toast.warn(`Sorry ! Your Now Due ${findBookig?.dueAmount}`);
    }

    if (data?.totalAmount < Number(receivedTk)) {
      return toast.warn(`Sorry Your Total Tk ${data?.totalAmount}`);
    }

    // const finalTotalReciveAmount = mytotalReceiveTk + Number(receivedTk);
    const receivedPayment = {
      paymentDate: e.target?.paymentDate?.value,

      customerType: customerType,
      whichOfMonthPayment: e.target?.whichOfMonthPayment?.value,

      totalAmount: findBookig?.bookingInfo?.totalAmount,
      payableAmount: findBookig?.payableAmount,

      receivedTk: Number(receivedTk),

      paymentType: paymentType,
      paymentStatus: "Unpaid",
      paymentNumber:
        e.target?.paymentNumber?.value === undefined
          ? ""
          : e.target?.paymentNumber?.value,
      transactionId:
        e.target?.transactionId?.value === undefined
          ? ""
          : e.target?.transactionId?.value,
      bankName:
        e.target?.bankName?.value === undefined
          ? ""
          : e.target?.bankName?.value,
      bankHoldingName:
        e.target?.bankHoldingName?.value === undefined
          ? ""
          : e.target?.bankHoldingName?.value,
      receiverName: e.target?.receiverName?.value,
    };

    try {
      await axios.patch(
        `https://psh-server-test.onrender.com/api/transaction/${data?._id}`,
        receivedPayment,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      refetch();
      toast.success("Transaction Updated");
    } catch (error) {
      return toast.error(error.response.data.message);
    }
    e.target.reset();
  };

  return (
    <div className="container">
      <div
        class="modal fade"
        id={`transaction${data?._id}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">
                Transaction Update
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="d-flex gap-3">
                <p
                  style={{
                    backgroundColor: "#00BBB4",
                    color: "white",
                    padding: "5px",
                  }}
                  className="fs-5  rounded"
                >
                  Payment
                </p>
              </div>

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
                      // defaultValue={new Date(data?.paymentDate)}
                      required
                    />{" "}
                  </div>

                  <div className="">
                    <label htmlFor="" className="fw-normal">
                      Payment Method
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
                      <option disabled>Payment Type</option>
                      <option>Bkash</option>
                      <option>Nagad</option>
                      <option>dutch-bangla</option>
                      <option>Cash</option>
                      <option>Bank</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="" className="fs-5 fw-normal">
                    Received Amount
                  </label>
                  <br />
                  <input
                    type="number"
                    onChange={(e) => setReciveTk(e.target.value)}
                    placeholder="Received Amount"
                    id=""
                    className="px-2 rounded"
                    style={{ width: "300px", height: "40px" }}
                    name="receivedTk"
                    defaultValue={data?.receivedTk}
                    required
                  />{" "}
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
                <div>
                  {paymentType === "Payment Type" ? (
                    ""
                  ) : (
                    <>
                      {paymentType !== "Cash" && paymentType !== "Bank" ? (
                        <>
                          <label htmlFor="" className="fs-5 fw-normal">
                            Payment Number
                          </label>
                          <br />
                          <input
                            type="number"
                            placeholder="Type Payment Number "
                            id=""
                            className="px-2 rounded "
                            style={{ width: "300px", height: "40px" }}
                            name="paymentNumber"
                            required
                            defaultValue={data?.paymentNumber}
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
                            className="px-2 rounded "
                            style={{ width: "300px", height: "40px" }}
                            name="transactionId"
                            required
                            defaultValue={data?.transactionId}
                          />
                          <br />
                        </>
                      ) : (
                        ""
                      )}

                      {paymentType === "Bank" ? (
                        <>
                          <label htmlFor="" className="fs-5 fw-normal">
                            Bank Name
                          </label>
                          <br />
                          <input
                            type="text"
                            placeholder="Type Bank Name"
                            id=""
                            className="px-2 rounded "
                            style={{ width: "300px", height: "40px" }}
                            name="bankName"
                            required
                            defaultValue={data?.bankName}
                          />
                          <br />
                          <label htmlFor="" className="fs-5 fw-normal">
                            Bank Holding Name
                          </label>
                          <br />
                          <input
                            type="text"
                            placeholder="Type Holding Name"
                            id=""
                            className="px-2 rounded"
                            style={{ width: "300px", height: "40px" }}
                            name="bankHoldingName"
                            required
                            defaultValue={data?.bankHoldingName}
                          />
                          <br />
                        </>
                      ) : (
                        ""
                      )}

                      <label htmlFor="" className="fs-5 fw-normal">
                        Recevier Name
                      </label>
                      <br />
                      <input
                        type="text"
                        placeholder="Receiver Name"
                        id=""
                        className="px-2 rounded "
                        style={{ width: "300px", height: "40px" }}
                        name="receiverName"
                        required
                        defaultValue={data?.receiverName}
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
                    backgroundColor: "#00BBB4",
                    border: "none",
                  }}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTransaction;
