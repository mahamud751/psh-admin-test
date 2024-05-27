import React, { useEffect, useState } from "react";

import styles from "./BookingUpdate.module.css";
import DatePicker from "react-datepicker";
import { addDays, addMonths, addYears, subDays } from "date-fns";
import { toast } from "react-toastify";
import axios from "axios";
import UseFetch from "../../hooks/useFetch";
import useExtraCharge from "../../hooks/useExtraCharge";
import usePromo from "../../hooks/usePromo";

const BookingDateUpdate = ({ data, refetch, extraCharge }) => {
  const { room, loading, error } = UseFetch(
    `property/${data?.bookingInfo?.data?._id}`
  );
  // const [extraCharge] = useExtraCharge();

  const [roomBookingDates, setRoomBookingDates] = useState([]);

  const [showMiniumPayment, setShowMinimumPayment] = useState(false);
  const [startDate, setStartDate] = useState(
    data?.bookingInfo?.rentDate?.bookStartDate
  );
  const [endDate, setEndDate] = useState(
    data?.bookingInfo?.rentDate?.bookEndDate
  );
  const [customerRent, setCustomerRent] = useState({});

  // Get Total Days this Year
  function getDaysInCurrentYear() {
    const currentDate = new Date(startDate);
    const currentYear = currentDate.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);
    // Calculate the difference in days
    const differenceInDays = (endOfYear - startOfYear) / (1000 * 60 * 60 * 24);
    return differenceInDays + 1; // Add 1 to include both start and end dates
  }

  // Last Day in current Month
  function getLastDayOfMonth() {
    const today = new Date(startDate);
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months are zero-indexed, so we add 1.
    const lastDay = new Date(year, month, 0).getDate(); // Setting day to 0 gets the last day of the previous month.
    return lastDay;
  }
  const firstDate = new Date(startDate);
  const lastDate = new Date(endDate);
  const timeDifferenceInMs = lastDate - firstDate;
  const daysDifference = timeDifferenceInMs / (1000 * 60 * 60 * 24);

  const years = Math.floor(daysDifference / getDaysInCurrentYear());
  const remainingDays = Math.floor(daysDifference % getDaysInCurrentYear());

  const months = Math.floor(remainingDays / getLastDayOfMonth());
  const days = remainingDays % getLastDayOfMonth();

  // date handle
  const [subTotal, setSubtotal] = useState(data?.bookingInfo?.subTotal);

  const [vatTax, setVatTaxt] = useState(
    (subTotal * extraCharge[0]?.vatTax) / 100
  );

  const [addMissionFee, setAddmissionFee] = useState(0);

  const [securityFee, setSecurityFee] = useState(0);

  const [minimumPayment, setMinimumPayment] = useState(0);

  const [totalRentAmount, setTotalRentAmount] = useState(
    parseInt(data?.bookingInfo?.totalAmount)
  );
  const [payableAmount, setPayableAmount] = useState(0);
  const [promos] = usePromo();
  const [userPromo, setUserPromo] = useState({});
  const [discountTk, setDisCountTk] = useState(0);

  const [isAdjustmen, setIsAdjustment] = useState(false);

  useEffect(() => {
    //  Set Extra Charge
    // setAddmissionFee(extraCharge[0]?.admissionFee);
    // setSecurityFee(extraCharge[0]?.securityFee);
    // If used promo this booking User then find-out promo
    const promo = promos.find(
      (promo) => promo?.promoCode === data?.bookingInfo?.usedPromo?.promo
    );
    setUserPromo(promo);
    setVatTaxt((subTotal * extraCharge[0]?.vatTax) / 100);

    // find Already Booking Dates
    if (room) {
      const roomBookingDates = room?.rentDate?.filter(
        (rent) =>
          rent.bookStartDate !== data?.bookingInfo?.rentDate?.bookStartDate
      );
      setRoomBookingDates(roomBookingDates);
    }

    // Date Calculation Start
    if (years < 1 && months < 1) {
      setCustomerRent({ daysDifference, remainingDays });
    } else if (years < 1 && months > 0) {
      setCustomerRent({ months, days, remainingDays });
    } else if (years === 1) {
      setCustomerRent({ months: 0, days: 0, years, remainingDays });
    } else {
      setCustomerRent({ months, days, years, remainingDays });
    }
    // Date Calculation End

    if (
      customerRent?.remainingDays &&
      data?.bookingInfo?.data?.perDay &&
      customerRent?.months === undefined &&
      customerRent?.years === undefined
    ) {
      setSubtotal(
        () => data?.bookingInfo?.data?.perDay * customerRent?.remainingDays
      );
    } else if (
      customerRent?.months !== undefined &&
      customerRent?.years === undefined
    ) {
      setSubtotal(
        () =>
          data?.bookingInfo?.data?.perMonth * customerRent?.months +
          data?.bookingInfo?.data?.perDay * customerRent?.days
      );
    } else {
      setSubtotal(() => data?.bookingInfo?.data?.perYear * customerRent?.years);
    }
    if (subTotal) {
      const getvatTax = (subTotal * extraCharge[0]?.vatTax) / 100;
      setVatTaxt(parseInt(getvatTax));
    }
    // minimum Payment
    if (
      customerRent.remainingDays > 3 &&
      customerRent?.months === undefined &&
      customerRent?.years === undefined
    ) {
      const minimum = data?.bookingInfo?.data?.perDay * 3;
      setMinimumPayment((minimum * extraCharge[0]?.vatTax) / 100 + minimum);

      setShowMinimumPayment(true);

      setAddmissionFee(0);

      setSecurityFee(0);
    } else if (
      customerRent?.months >= 2 &&
      customerRent?.months < 6 &&
      customerRent?.years === undefined
    ) {
      setMinimumPayment(extraCharge[0]?.securityFee);

      setAddmissionFee(extraCharge[0]?.admissionFee);

      setSecurityFee(extraCharge[0]?.securityFee);

      setShowMinimumPayment(true);
    } else if (customerRent?.months >= 6 && customerRent?.years === undefined) {
      setMinimumPayment(extraCharge[0]?.upto6MonthsSecurityFee);

      setAddmissionFee(extraCharge[0]?.upto6MonthsAdmissionFee);

      setSecurityFee(extraCharge[0]?.upto6MonthsSecurityFee);

      setShowMinimumPayment(true);
    } else if (customerRent?.years !== undefined) {
      setMinimumPayment(extraCharge[0]?.for1YearSecurityFee);

      setAddmissionFee(extraCharge[0]?.for1YearAdmissionFee);

      setSecurityFee(extraCharge[0]?.for1YearSecurityFee);

      setShowMinimumPayment(true);
    } else {
      setMinimumPayment(0);
      setShowMinimumPayment(false);
    }

    // total Amount
    if (customerRent?.months >= 2) {
      const totalAmountForMonths = parseInt(
        subTotal + vatTax + addMissionFee + securityFee
      );
      setTotalRentAmount(parseInt(totalAmountForMonths));

      if (
        userPromo?.minimumDays &&
        customerRent?.remainingDays >= userPromo?.minimumDays
      ) {
        const discount = data?.bookingInfo?.promoCodeDiscount / 100;
        setDisCountTk(
          customerRent?.remainingDays >= userPromo?.minimumDays
            ? totalAmountForMonths * discount
            : data?.adjustmentAmount
        );

        setPayableAmount(
          parseInt(
            customerRent?.remainingDays >= userPromo?.minimumDays
              ? totalAmountForMonths - totalAmountForMonths * discount
              : totalAmountForMonths
          )
        );
      } else {
        setDisCountTk(data?.adjustmentAmount);
        setPayableAmount(
          parseInt(totalAmountForMonths - data?.adjustmentAmount)
        );
        setIsAdjustment(data?.adjustmentAmount > 0 ? true : false);
      }
      // setminimumPayment(addMissionFee);
    } else if (
      customerRent?.months === 0 &&
      customerRent?.years !== undefined
    ) {
      const totalAmountForMonths = parseInt(
        subTotal + vatTax + addMissionFee + securityFee
      );
      setTotalRentAmount(parseInt(totalAmountForMonths));
      if (
        userPromo?.minimumDays &&
        customerRent?.remainingDays >= userPromo?.minimumDays
      ) {
        const discount = data?.bookingInfo?.promoCodeDiscount / 100;
        setDisCountTk(
          customerRent?.remainingDays >= userPromo?.minimumDays
            ? totalAmountForMonths * discount
            : data?.adjustmentAmount
        );

        setPayableAmount(
          parseInt(
            customerRent?.remainingDays >= userPromo?.minimumDays
              ? totalAmountForMonths - totalAmountForMonths * discount
              : totalAmountForMonths
          )
        );
      } else {
        setDisCountTk(data?.adjustmentAmount);
        setPayableAmount(
          parseInt(totalAmountForMonths - data?.adjustmentAmount)
        );
        setIsAdjustment(data?.adjustmentAmount > 0 ? true : false);
      }

      // setminimumPayment(addMissionFee);
    } else {
      const totalAmountForDays = parseInt(subTotal + vatTax);
      setTotalRentAmount(parseInt(totalAmountForDays));

      if (
        userPromo?.minimumDays &&
        customerRent?.remainingDays >= userPromo?.minimumDays
      ) {
        const discount = data?.bookingInfo?.promoCodeDiscount / 100;
        setDisCountTk(
          customerRent?.remainingDays >= userPromo?.minimumDays
            ? totalAmountForDays * discount
            : data?.adjustmentAmount
        );

        setPayableAmount(
          parseInt(
            customerRent?.remainingDays >= userPromo?.minimumDays
              ? totalAmountForDays - totalAmountForDays * discount
              : totalAmountForDays
          )
        );
      } else {
        setDisCountTk(data?.adjustmentAmount);
        setPayableAmount(parseInt(totalAmountForDays - data?.adjustmentAmount));
        setIsAdjustment(data?.adjustmentAmount > 0 ? true : false);
      }
      // setminimumPayment(0);
    }
  }, [
    startDate,
    endDate,
    data?.adjustmentAmount,
    userPromo?.minimumDays,
    promos,
    data?.bookingInfo?.usedPromo?.promo,
    data?.bookingInfo?.promoCodeDiscount,
    customerRent?.remainingDays,
    data?.bookingInfo?.data?.perDay,
    subTotal,
    vatTax,
    days,
    months,
    years,
    daysDifference,
    remainingDays,
    customerRent?.days,
    customerRent?.months,
    customerRent?.years,
    data?.bookingInfo?.data?.perMonth,
    data?.bookingInfo?.data?.perYear,
    data?.bookingInfo?.rentDate?.bookStartDate,
    room,
    addMissionFee,
    securityFee,
    extraCharge,
  ]);

  const bookingData = {
    data: data?.bookingInfo?.data,
    branch: data?.bookingInfo?.branch,
    subTotal: subTotal,
    promoCodeDiscount: data?.bookingInfo?.promoCodeDiscount,
    discount: data?.discount,
    customerType: data?.customerType,
    whichOfMonthPayment: data?.whichOfMonthPayment,
    vatTax: vatTax,
    totalAmount: totalRentAmount,
    payableAmount: payableAmount,
    dueAmount: payableAmount - data?.totalReceiveTk,
    roomName: data?.bookingInfo?.roomName,
    roomNumber: data?.bookingInfo?.roomNumber,
    roomType: data?.bookingInfo?.roomType,
    rentDate: {
      bookStartDate: new Date(startDate).toISOString().split("T")[0],

      bookEndDate: new Date(endDate).toISOString().split("T")[0],
    },

    customerRent: customerRent,
    previousDate: {
      bookStartDate: data?.bookingInfo?.rentDate?.bookStartDate,
      bookEndDate: data?.bookingInfo?.rentDate?.bookEndDate,
    },

    usedPromo: {
      promo: data?.usedPromo?.promo,
      usedDate: data?.usedPromo?.usedDate,
    },
    adjustmentAmount: data?.adjustmentAmount,
  };

  const handleBookingDate = async () => {
    // If show minimum payment and full Payment Option

    let bookingDataUpdate = {};
    if (showMiniumPayment) {
      bookingDataUpdate = {
        ...bookingData,
        addMissionFee: addMissionFee,
        securityFee: securityFee,
        minimumPayment: minimumPayment,
      };
    }

    // Already Booking Handle
    let bookings = roomBookingDates?.map((rent) => new Date(rent?.bookEndDate));
    function validPeriod(startDate, endDate, bookings) {
      let valid = true;

      for (let i = 0; i < bookings.length; i++) {
        const date = bookings[i];
        if (startDate <= date && date <= endDate) {
          valid = false;
          break;
        }
      }

      return valid;
    }

    if (validPeriod(startDate, endDate, bookings)) {
      if (showMiniumPayment) {
        try {
          const response = await axios.patch(
            `https://psh-server-test.onrender.com/api/order/${data._id}`,
            bookingDataUpdate,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          toast.success(response.data.message);
          refetch();
        } catch (error) {
          return toast.error(error.response.data.message);
        }
      } else {
        try {
          const response = await axios.patch(
            `https://psh-server-test.onrender.com/api/order/${data._id}`,
            bookingData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          toast.success(response.data.message);
          refetch();
        } catch (error) {
          return toast.error(error.response.data.message);
        }
      }
    } else {
      toast.error("Sorry ! You Select Already Booking Dates");
    }
  };
  return (
    <div className="">
      <div
        className="modal fade"
        id={`dateUpdate${data._id}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog ">
          <div className="modal-content ">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Booking Update Duration
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body ml-3">
              {" "}
              <div
                style={{
                  width: "430px",
                  // height: "650px",
                  boxShadow:
                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25) ",
                  borderRadius: "3px",
                  backgroundColor: "white",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#35B0A7",
                    width: "430px",
                    height: "55px",
                    borderRadius: "3px 3px 0px 0px",
                  }}
                ></div>
                <div
                  className="px-3 py-2 m-3"
                  style={{
                    boxShadow: "0px 0px 5px 3px #CCC",
                    borderRadius: "5px",
                  }}
                >
                  <h2
                    className="text-left fw-bold"
                    style={{ color: "#212A42" }}
                  >
                    {data?.name}
                  </h2>
                  <div className="d-flex ">
                    <div>{/* <img src={brachLocationIcon} alt="" /> */}</div>
                    <p className="text-black">{data.city}</p>
                  </div>
                  <p
                    className=" d-flex justify-content-start "
                    style={{
                      backgroundColor: "#FCA22A",
                      color: "white",
                      padding: "3px 5px ",
                      borderRadius: "5px",
                    }}
                  >
                    {data?.bookingInfo?.roomType}
                  </p>
                </div>
                <div className="mx-2">
                  <ul className="d-flex justify-content-evenly list-unstyled calcaulation">
                    <li className=" border py-1">
                      <span
                        onClick={() =>
                          setEndDate(addDays(new Date(startDate), 1))
                        }
                        className={` px-5 py-2 ${
                          customerRent.remainingDays < getLastDayOfMonth() &&
                          customerRent.years === undefined
                            ? "dmyActive "
                            : "text-black"
                        }`}
                      >
                        Day
                      </span>
                    </li>
                    <li className=" border py-1">
                      <span
                        onClick={() =>
                          setEndDate(addMonths(new Date(startDate), 1))
                        }
                        className={` px-5 py-2 ${
                          customerRent.remainingDays >= getLastDayOfMonth() &&
                          customerRent.years === undefined
                            ? "dmyActive "
                            : "text-black"
                        }`}
                      >
                        Month
                      </span>
                    </li>
                    <li className=" border py-1">
                      <span
                        onClick={() =>
                          customerRent.years === undefined
                            ? setEndDate(addYears(new Date(endDate), 1))
                            : ""
                        }
                        className={` px-5 py-2 ${
                          customerRent.years >= 1 ? "dmyActive " : "text-black"
                        }`}
                      >
                        Year
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="d-flex justify-content-between gap-3 total-area text-black px-2 mt-3">
                  <div>
                    <p className="text-left font-bold mb-1">Check-In</p>
                    <DatePicker
                      selected={new Date(startDate)}
                      dateFormat="dd/MM/yyyy"
                      onChange={(date) => setStartDate(date)}
                      // showIcon
                      excludeDateIntervals={roomBookingDates?.map((rent) => {
                        return {
                          start: subDays(new Date(rent?.bookStartDate), 1),
                          end: addDays(new Date(rent?.bookEndDate), 0),
                        };
                      })}
                      // minDate={subDays(new Date(), 0)}
                    />
                  </div>
                  <div>
                    <p className="text-left font-bold mb-1">Check-Out</p>
                    <DatePicker
                      selected={new Date(endDate)}
                      dateFormat="dd/MM/yyyy"
                      onChange={(date) => setEndDate(date)}
                      // showIcon
                      excludeDateIntervals={roomBookingDates?.map((rent) => {
                        return {
                          start: subDays(new Date(rent?.bookStartDate), 1),
                          end: addDays(new Date(rent?.bookEndDate), 0),
                        };
                      })}
                      minDate={subDays(new Date(startDate), -1)}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-5 justify-items-center px-5">
                  <p className="text-left fw-bold mb-1 ">Total Duration = </p>
                  <div>
                    <input
                      className="pl-2"
                      type="text"
                      style={{ width: "100%", height: "30px" }}
                      value={`${
                        customerRent?.daysDifference >= 0
                          ? `${customerRent?.daysDifference} days`
                          : "" ||
                            (customerRent?.months &&
                              customerRent?.days >= 0 &&
                              !customerRent?.years)
                          ? `${customerRent?.months} months, ${customerRent?.days} days`
                          : "" ||
                            (customerRent?.years &&
                              customerRent?.months >= 0 &&
                              customerRent?.days >= 0)
                          ? `${customerRent?.years} year`
                          : ""
                      }`}
                      disabled
                    />
                  </div>
                </div>

                <div className="text-black pr-3 mt-3 fw-medium">
                  <div className="d-flex justify-content-between ">
                    <div className="ml-5 ">
                      <p>Rent</p>
                    </div>
                    <p>BDT {subTotal}</p>
                  </div>

                  <div className="d-flex justify-content-between">
                    <div className="ml-5 ">
                      <p>VAT</p>
                    </div>

                    <p> + BDT {vatTax}</p>
                  </div>
                  {customerRent.months >= 1 || customerRent.years ? (
                    <div className="d-flex justify-content-between ">
                      <div className="ml-5 ">
                        <p>Admission Fee</p>
                      </div>
                      <p>
                        BDT{" "}
                        {customerRent.months >= 2 || customerRent.years
                          ? addMissionFee
                          : 0}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  {customerRent.months >= 1 || customerRent.years ? (
                    <div className="d-flex justify-content-between ">
                      <div className="ml-5">
                        <p>Security Fee</p>
                      </div>
                      <p>
                        BDT{" "}
                        {customerRent.months >= 2 || customerRent.years
                          ? securityFee
                          : 0}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}

                  <hr className="mt-3 ml-5 text-black" />
                  <div className="d-flex justify-content-between mt-2">
                    <p className="ml-5">Total Amount</p>
                    <p>BDT {totalRentAmount}</p>
                  </div>

                  <div className="d-flex justify-content-between mt-2">
                    <p className="ml-5">
                      {" "}
                      {isAdjustmen ? "Previous Adjustment" : "Discount"}{" "}
                    </p>
                    <p>-BDT {discountTk}</p>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <p className="ml-5">Payable Amount</p>
                    <p>BDT {payableAmount}</p>
                  </div>
                  {(customerRent?.months >= 1 &&
                    customerRent?.years === undefined) ||
                  (customerRent?.months === 0 &&
                    customerRent?.years !== undefined) ? (
                    <div className="d-flex justify-content-between">
                      <div className="ml-5">
                        <p className="text-danger fw-bold">Advance Payment</p>
                      </div>
                      <p> BDT {minimumPayment}</p>
                    </div>
                  ) : (
                    ""
                  )}

                  <div
                    className={`d-flex justify-content-between ${
                      (customerRent?.months >= 1 &&
                        customerRent?.years === undefined) ||
                      (customerRent?.months === 0 && customerRent?.years >= 1)
                        ? "d-none"
                        : "d-block"
                    }`}
                  >
                    <div className="ml-5 d-flex justify-items-center ">
                      <p className="text-danger fw-bold">Minimum Payment</p>
                    </div>
                    <p> BDT {minimumPayment}</p>
                  </div>
                </div>
                <div
                  className={` d-flex justify-content-center justify-items-center mt-5 `}
                  style={{
                    backgroundColor: "#35B0A7",
                  }}
                >
                  <div>
                    <button
                      className={`fs-5 p-2 text-white bg-transparent `}
                      onClick={handleBookingDate}
                      disabled={
                        data?.endDate === endDate ||
                        data?.endDate > endDate ||
                        data?.endDate > startDate
                          ? true
                          : false
                      }
                    >
                      Update Booking Duration
                    </button>
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
export default BookingDateUpdate;
