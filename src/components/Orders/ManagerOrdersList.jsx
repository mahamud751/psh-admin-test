import React, { useContext, useEffect, useState } from "react";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";

import OrderStatusUpdate from "../../pages/edit/OrderStatusUpdate";
import { AiOutlineEye, AiOutlineFieldTime } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import SeeOrderDetails from "./SeeOrderDetails";
import BookingDateSetUpdate from "../../pages/edit/BookingDateSetUpdate";
import BookingDateUpdate from "../../pages/edit/BookingDateUpdate";
import { useQuery } from "react-query";
import Payment from "../../pages/edit/Payment";
import { ToastContainer, toast } from "react-toastify";
import useTransaction from "../../hooks/useTransaction";
import { AuthContext } from "../../contexts/UserProvider";
import useExtraCharge from "../../hooks/useExtraCharge";
import useBranch from "../../hooks/useBranch";
import { useLocation } from "react-router-dom";
import img from "../../img/new/style.png";
import { Spinner } from "react-bootstrap";

const ManagerOrdersList = () => {
  const MySwal = withReactContent(Swal);
  const [transactions] = useTransaction();
  const { user } = useContext(AuthContext);
  const userBranch = user?.branch?._id;
  const { pathname } = useLocation();
  const [extraCharge] = useExtraCharge();

  const [isLoading, setIsLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [error, setError] = useState(null);

  const [filterData, setFilterData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  let orderId = "All";

  let bookingUserId = "All";
  const [bookingId, setBookingId] = useState("");
  const [userId, setUserId] = useState("");
  const branch = "All";
  const [paymentStatus, setPaymentStaus] = useState("All");
  const [bookingStatus, setBookingStatus] = useState("All");
  const [status, setStatus] = useState("Approved");
  //sub stream
  const [data, setData] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allBranch, setAllBranch] = useState([]);
  // const [totalReceiveAmount, setTotalReceiveAmount] = useState([]);

  // Get All Branch
  useEffect(() => {
    fetch(`https://psh-server-test.onrender.com/api/branch`)
      .then((res) => res.json())
      .then((data) => setAllBranch(data));
  }, []);

  const findManagerBranch = allBranch?.find(
    (branch) => branch?._id === userBranch
  );

  // Get all Bookings
  const { refetch } = useQuery(
    [data, extraCharge, findManagerBranch?._id, allBranch?.length],
    async () => {
      try {
        const response = await fetch(
          `https://psh-server-test.onrender.com/api/order?branch=${findManagerBranch?._id}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Network Error");
        }

        const data = await response.json();
        setData(data?.orders);
        setAllBookings(data?.orders);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    }
  );

  const handlePaymentStatus = (e) => {
    setPaymentStaus(e.target.value);
  };
  const handleBookingStatus = (e) => {
    setBookingStatus(e.target.value);
  };

  const handleSearch = async () => {
    setStatus(bookingStatus);
    const withIdBooking = data?.find(
      (booking) => booking?._id?.slice(-5) === bookingId
    );
    const withUserIdBooking = data?.filter(
      (booking) => booking?.userId?.slice(-5) === userId
    );

    if (bookingId && !withIdBooking) {
      return toast.error("Sorry! Wrong Id ");
    }
    // if (userId && !withUserIdBooking) {
    //   return toast.error("Sorry! Wrong Id ");
    // }

    setIsLoading(true);
    setIsFilter(true);
    orderId = withIdBooking?._id ? withIdBooking?._id : "All";
    bookingUserId = withUserIdBooking[0]?.userId
      ? withUserIdBooking[0]?.userId
      : "All";

    try {
      const response = await fetch(
        `https://psh-server-test.onrender.com/api/order?orderId=${orderId}&userId=${bookingUserId}&fromDate=${fromDate}&toDate=${toDate}&branch=${findManagerBranch?._id}&paymentStatus=${paymentStatus}&status=${bookingStatus}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setFilterData(data?.orders);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Find Total Booking Amount Branch Or All Booking By Filtering
  let totalBookingAmount = 0;

  for (const item of isFilter ? filterData : allBookings) {
    totalBookingAmount += item.payableAmount;
  }
  // Find Total Booking Amount Branch Or All Booking By Filtering
  let totalReceiveAmountFilter = 0;

  for (const item of isFilter ? filterData : allBookings) {
    totalReceiveAmountFilter += item.totalReceiveTk;
  }

  let totalDueAmount = 0;

  for (const item of isFilter ? filterData : allBookings) {
    totalDueAmount += item.dueAmount;
  }

  const columns = [
    {
      text: "Date",
      formatter: (cellContent, row, index) => {
        const formattedDate = new Date(row?.createdAt).toLocaleString();
        return (
          <>
            {" "}
            <p>{formattedDate?.split(",")[0]}</p>
          </>
        );
      },
    },

    {
      text: <span>Booking Id</span>,
      formatter: (cellContent, row, index) => {
        return (
          <>
            {" "}
            <p>#{row?._id?.slice(-5)}</p>
          </>
        );
      },
    },
    {
      text: <span>User Id</span>,
      formatter: (cellContent, row, index) => {
        return (
          <>
            {" "}
            <p>#{row?.userId?.slice(-5)}</p>
          </>
        );
      },
    },
    {
      text: <span>Room / Seat No</span>,
      formatter: (cellContent, row, index) => {
        return (
          <>
            {row?.bookingInfo?.roomType === "Shared Room"
              ? row?.bookingInfo?.seatBooking?.seatNumber
              : row?.bookingInfo?.data?.roomNumber}
          </>
        );
      },
    },

    {
      text: "Total Tk",
      formatter: (cellContent, row, index) => {
        return (
          <>
            {" "}
            <p className="fw-bold">Tk {row?.totalAmount?.toLocaleString()}</p>
          </>
        );
      },
    },
    {
      text: "Discount",
      formatter: (cellContent, row, index) => {
        return (
          <>
            {" "}
            <p className="fw-bold">Tk {row?.discount?.toLocaleString()}</p>
          </>
        );
      },
    },
    {
      text: "Payable Tk",
      formatter: (cellContent, row, index) => {
        return (
          <>
            {" "}
            <p className="fw-bold">Tk {row?.payableAmount?.toLocaleString()}</p>
          </>
        );
      },
    },

    {
      text: "Payment Status",
      formatter: (cellContent, row, index) => {
        return (
          <span
            className=" fw-bold "
            style={{ color: row?.paymentStatus === "Paid" ? "green" : "red" }}
          >
            {" "}
            {row?.paymentStatus}
          </span>
        );
      },
    },
    {
      text: "Due Amount",
      formatter: (cellContent, row, index) => {
        return (
          <span
            className=" fw-bold"
            style={{ color: row?.paymentStatus === "Paid" ? "green" : "red" }}
          >
            {" "}
            Tk {row?.dueAmount?.toLocaleString()}
          </span>
        );
      },
    },
    {
      text: "Total Receive",
      formatter: (cellContent, row, index) => {
        return (
          <p className="fw-bold">Tk {row?.totalReceiveTk?.toLocaleString()}</p>
        );
      },
    },
    {
      text: "Status",
      formatter: (cellContent, row, index) => {
        return (
          <>
            <div className=" d-flex ">
              <div>
                <p
                  className="fw-bold"
                  style={{
                    color: row?.status === "Approved" ? "#27b3b1" : "red",
                  }}
                >
                  {row?.status}
                </p>
              </div>
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target={`#status${row._id}`}
                className="d-flex  bg-white p-0"
              >
                <BiSolidEdit style={{ width: "24px", height: "24px" }} />
              </button>
              {/* Modal Order Status Update */}
            </div>
            <div>
              <OrderStatusUpdate data={row} refetch={refetch} />
            </div>
          </>
        );
      },
    },
    {
      text: "Details",
      formatter: (cellContent, row, index) => {
        return (
          <div>
            <button
              type="button"
              className="bg-white"
              data-bs-toggle="modal"
              data-bs-target={`#details${row._id}`}
            >
              <span>
                <AiOutlineEye style={{ width: "24px", height: "24px" }} />
              </span>
            </button>

            {/* Modal Order Details */}
            <SeeOrderDetails data={row} transactions={transactions} />
          </div>
        );
      },
    },
    {
      text: "Update Duration",
      formatter: (cellContent, row, index) => {
        return (
          <>
            <div className="d-flex justify-content-center">
              <button
                title={`${
                  row?.status === "Approved"
                    ? "Sorry ! Your Booking Already Approved"
                    : ""
                }`}
                type="button"
                className={`rounded ${
                  row?.status === "Approved" ? "bg-white" : ""
                }`}
                style={{
                  backgroundColor:
                    row?.status === "Approved" ? "white" : "#35b0a7",
                }}
                data-bs-toggle="modal"
                data-bs-target={`#dateUpdate${row._id}`}
                disabled={row?.status === "Approved" ? true : false}
              >
                <AiOutlineFieldTime style={{ width: "24px", height: "24px" }} />
              </button>
            </div>
            {/* Modal order Date Update */}
            {row?.bookingInfo?.roomType === "Shared Room" ? (
              <div>
                <BookingDateSetUpdate
                  data={row}
                  refetch={refetch}
                  extraCharge={extraCharge}
                />
              </div>
            ) : (
              <div>
                <BookingDateUpdate
                  data={row}
                  refetch={refetch}
                  extraCharge={extraCharge}
                />
              </div>
            )}
          </>
        );
      },
    },

    {
      text: "Action",
      formatter: (cellContent, row) => {
        return (
          <>
            <div className="d-flex gap-2 fw-bold">
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target={`#payment${row._id}`}
                style={{ backgroundColor: "#00BBB4" }}
              >
                Payment
              </button>
              {/* 
              <button className="bg-danger">End</button> */}
            </div>
            <Payment data={row} refetch={refetch} isLoading={isLoading} />
          </>
        );
      },
    },
    {
      text: "RQ",
      formatter: (cellContent, row, index) => {
        return (
          <>
            {" "}
            <p className=" fw-bold" style={{ color: "red" }}>
              {row?.isCancel === "Yes" ? (
                "Cancel Request"
              ) : (
                <span className="text-black">No Request</span>
              )}
            </p>
          </>
        );
      },
    },
  ];
  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 10,
    style: { width: 60 },
    lastPageText: "Last",
    firstPageText: "First",
    nextPageText: "Next",
    prePageText: "Previous",
    showTotal: true,
    alwaysShowAllBtns: true,
    onPageChange: function (page, sizePerPage) {
      console.log("page", page);
      console.log("sizePerPage", sizePerPage);
    },
    onSizePerPageChange: function (page, sizePerPage) {
      console.log("page", page);
      console.log("sizePerPage", sizePerPage);
    },
  });

  //delete
  const [bookings, setBookings] = useState(data);
  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you Sure?");
    if (confirmation) {
      const url = `https://psh-server-test.onrender.com/api/order/${id}`;
      fetch(url, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          MySwal.fire("Good job!", "successfully deleted", "success");
          if (data.deletedCount === 1) {
            const remainItem = bookings.filter((item) => item._id !== id);
            setBookings(remainItem);
          }
        });
    }
  };
  return (
    <div className="wrapper">
      <div>
        <div className="wrapper">
          {/* Content Wrapper. Contains page content */}
          <div className="content-wrapper h-0" style={{ background: "unset" }}>
            <div className="row customize mx-lg-5">
              <div className="col-md-3 home_card_m">
                <div className="card_1">
                  <div className="d-flex p-3">
                    <div className="d-flex justify-content-center align-items-center">
                      <img src={img} alt="" className="img1" />
                    </div>
                    <div className="ms-3 ">
                      <p className="fw-bold">
                        <span className="text-white">{status}</span> (Bookings)
                      </p>
                      <p className="fw-bold text-white">
                        {isFilter ? filterData?.length : allBookings?.length}{" "}
                        Booking
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 home_card_m">
                <div className="card_2">
                  <div className="d-flex p-3">
                    <div className="d-flex justify-content-center align-items-center">
                      <img src={img} alt="" className="img2" />
                    </div>
                    <div className="ms-3 text-white">
                      <p className="">Total Booking Amount</p>
                      <p className="fw-bold">
                        Tk {totalBookingAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card_3">
                  <div className="d-flex p-3">
                    <div className="d-flex justify-content-center align-items-center">
                      <img src={img} alt="" className="img3" />
                    </div>
                    <div className="ms-3 text-white">
                      <p>Total Cash Amount</p>
                      <p className="fw-bold">
                        Tk {totalReceiveAmountFilter?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card_4">
                  <div className="d-flex p-3">
                    <div className="d-flex justify-content-center align-items-center">
                      <img src={img} alt="" className="img3" />
                    </div>
                    <div className="ms-3 text-white">
                      <p>Total Due Amount</p>
                      <p className="fw-bold">
                        Tk {totalDueAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-wrapper" style={{ background: "unset" }}>
        <section className="content customize_list">
          <div className="container-fluid">
            <div className=" d-lg-flex gap-4 ">
              <div className="">
                <label htmlFor="">From Date </label>
                <br />
                <div>
                  <input
                    type="date"
                    onChange={(e) => setFromDate(e.target.value)}
                    name=""
                    id=""
                  />
                </div>
              </div>
              <div className="">
                <label htmlFor="">To Date </label> <br />
                <div>
                  <input
                    type="date"
                    name=""
                    id=""
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>

              <div className=" d-flex gap-5 ">
                <div>
                  <label htmlFor="">Branch </label> <br />
                  <select
                    className="rounded"
                    style={{ height: "30px" }}
                    disabled
                  >
                    <option value={findManagerBranch?._id}>
                      {findManagerBranch?.name}
                    </option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="">Payment Status </label> <br />
                <select
                  className="rounded"
                  style={{ height: "30px", width: "120px" }}
                  onChange={handlePaymentStatus}
                >
                  <option>All</option>

                  <option>Paid</option>
                  <option>Unpaid</option>
                </select>
              </div>
              <div>
                <label htmlFor="">Booking Status </label> <br />
                <select
                  className="rounded"
                  style={{ height: "30px", width: "120px" }}
                  onChange={handleBookingStatus}
                >
                  <option>All</option>

                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Canceled</option>
                  <option>Processing</option>
                </select>
              </div>
              <div>
                <label htmlFor="">User Id </label> <br />
                <input
                  type="text"
                  list="userId"
                  placeholder="Type User Id"
                  onChange={(e) => setUserId(e.target.value)}
                  style={{
                    width: "160px",
                  }}
                />
                <datalist id="userId">
                  {data?.map((booking) => {
                    return (
                      <option key={booking._id}>
                        {booking?.userId?.slice(-5)}
                      </option>
                    );
                  })}
                </datalist>
              </div>
              <div className=" ">
                <label htmlFor="">Booking Id </label> <br />
                <input
                  type="text"
                  list="bookingId"
                  placeholder="Type Booking Id"
                  onChange={(e) => setBookingId(e.target.value)}
                  style={{
                    width: "160px",
                  }}
                />
                <datalist id="bookingId">
                  {data?.map((booking) => {
                    return (
                      <option key={booking._id} style={{ display: "none" }}>
                        {booking?._id?.slice(-5)}
                      </option>
                    );
                  })}
                </datalist>
                <button
                  onClick={handleSearch}
                  className="btn text-white"
                  style={{
                    backgroundColor: "#35b0a7",
                    height: "32px",
                    padding: "0 10px",
                  }}
                >
                  Search
                </button>
              </div>
            </div>

            <hr style={{ height: "1px", background: "rgb(191 173 173)" }} />
            {isLoading ? (
              <p
                style={{ margin: "150px 0" }}
                className="text-center text-danger fw-bold"
              >
                Please Wait... <Spinner size="sm" animation="grow" />
              </p>
            ) : data?.length > 0 || filterData?.length > 0 ? (
              <div className="card">
                <div className="card-body card_body_sm">
                  <>
                    <ToolkitProvider
                      bootstrap4
                      keyField="_id"
                      columns={columns}
                      data={isFilter ? filterData : data}
                      pagination={pagination}
                    >
                      {(props) => (
                        <React.Fragment>
                          <BootstrapTable
                            bootstrap4
                            keyField="_id"
                            columns={columns}
                            data={isFilter ? filterData : data}
                            pagination={pagination}
                            {...props.baseProps}
                          />
                          <ToastContainer
                            className="toast-position"
                            position="top-center"
                          />
                        </React.Fragment>
                      )}
                    </ToolkitProvider>
                  </>
                </div>
              </div>
            ) : (
              <p className="text-center text-danger fw-bold">
                Find Bookings... <Spinner size="sm" animation="grow" />
              </p>
            )}
          </div>
        </section>
      </div>
      {/* /.content-wrapper */}

      {/* Control Sidebar */}
    </div>
  );
};

export default ManagerOrdersList;
