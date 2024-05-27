import React, { useState } from "react";

import img3 from "../../img/college/Icon feather-edit.png";
import { AiOutlineFieldTime } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";

import SeeOrderDetails from "./SeeOrderDetails";
import OrderStatusUpdate from "../../pages/edit/OrderStatusUpdate";
import BookingDateUpdate from "../../pages/edit/BookingDateUpdate";
import BookingDateSetUpdate from "../../pages/edit/BookingDateSetUpdate";
import Payment from "../../pages/edit/Payment";

import "./OrderTable.css";

const OrderTable = ({ refetch, order }) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [statusShow, setStatusShow] = useState(false);
  const handleShowStatus = () => setStatusShow(true);
  const [updateDateShow, setUpdateShow] = useState(false);
  const handleUpdateShowDate = () => setUpdateShow(true);
  const [paymentShow, setPaymentShow] = useState(false);
  const handlePaymentShow = () => setPaymentShow(true);

  return (
    <tr>
      <td>{order._id.slice(15)}</td>
      <td>{order?.firstName}</td>
      <td>{order?.phone}</td>
      <td>
        {order?.bookingInfo?.roomType === "Shared Room"
          ? order?.bookingInfo?.seatBooking?.seatNumber
          : order?.bookingInfo?.data?.roomNumber}
      </td>
      <td className="text-center">
        {order?.bookingInfo?.rentDate?.bookStartDate}
      </td>
      <td className="text-center">
        {order?.bookingInfo?.rentDate?.bookEndDate}
      </td>

      <td className="text-center">Tk {order?.bookingInfo?.totalAmount}</td>
      <td className="text-center text-danger fw-bold">Unpaid</td>
      <td className="text-center">Tk {order?.dueAmount}</td>
      <td className="text-center">{order?.totalReceiveTk}</td>
      <td>
        <div className="d-flex">
          <div>
            <h6
              className={`${
                order?.status === "Approved"
                  ? "order-status"
                  : "text-danger fw-bold"
              }`}
            >
              {order?.status}
            </h6>
          </div>
          <div className="ms-5">
            <div className="d-flex justify-content-center order-status">
              <img src={img3} alt="" onClick={handleShowStatus} />
            </div>
            {/* Modal Order Status Update */}
            <div>
              <OrderStatusUpdate
                data={order}
                refetch={refetch}
                setStatusShow={setStatusShow}
                statusShow={statusShow}
              />
            </div>
          </div>
        </div>
      </td>
      <td className="text-center">
        <div>
          <button
            className=""
            onClick={handleShow}
            style={{ backgroundColor: "#00BBB4" }}
          >
            <span>
              <AiOutlineEye />
            </span>
          </button>
          {/* Modal Order Details */}
          <SeeOrderDetails order={order} setShow={setShow} show={show} />
        </div>
      </td>
      <td>
        <div className="d-flex justify-content-center">
          <div className="update-date" onClick={handleUpdateShowDate}>
            <AiOutlineFieldTime style={{ width: "30px", height: "30px" }} />
          </div>
        </div>
        {/* Modal order Date Update */}
        {order?.bookingInfo?.roomType === "Shared Room" ? (
          <div>
            <BookingDateSetUpdate
              data={order}
              refetch={refetch}
              setUpdateShow={setUpdateShow}
              updateDateShow={updateDateShow}
            />
          </div>
        ) : (
          <div>
            <BookingDateUpdate
              data={order}
              refetch={refetch}
              setUpdateShow={setUpdateShow}
              updateDateShow={updateDateShow}
            />
          </div>
        )}
      </td>
      <td>
        <div className="d-flex gap-2 fw-bold">
          <button
            style={{ backgroundColor: "#00BBB4" }}
            onClick={handlePaymentShow}
          >
            Payment
          </button>

          <button className="bg-danger">End</button>
        </div>
        <Payment
          paymentShow={paymentShow}
          setPaymentShow={setPaymentShow}
          data={order}
          refetch={refetch}
        />
      </td>
    </tr>
  );
};

export default OrderTable;
