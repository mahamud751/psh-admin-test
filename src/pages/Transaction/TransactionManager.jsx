import React, { useContext, useEffect, useRef, useState } from "react";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";

import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";

import { useQuery } from "react-query";

import { ToastContainer, toast } from "react-toastify";

import ViewTransactionModal from "./ViewTransactionModal";
import UpdateTransaction from "./UpdateTransaction";
import useBooking from "../../hooks/useBooking";

import ReactToPrint from "react-to-print";
import { Spinner, Table } from "react-bootstrap";
import TransactionPrint from "./TransactionPrint";
import { AuthContext } from "../../contexts/UserProvider";
import img from "../../img/new/style.png";
const TransactionManager = () => {
  const ref = useRef();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [allBranch, setAllBranch] = useState([]);
  const userBranch = user?.branch?._id;
  const MySwal = withReactContent(Swal);
  const [bookings] = useBooking();
  const [filterData, setFilterData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [error, setError] = useState(null);
  // const [transactions, refetch] = useTransaction();
  const [userEmail, setUserEmail] = useState("All");
  // Find Manager Branch

  // const [branch, setBranch] = useState("All");
  const branch = "All";
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  let orderId = "All";
  let bookingUserId = "All";
  const [bookingId, setBookingId] = useState("");
  const [userId, setUserId] = useState("");
  const [userAllBooking, setUserAllBooking] = useState([]);
  const [transactionId, setTransactionId] = useState("All");
  const [payementType, setPaymentType] = useState("All");
  // find branch Bookings
  const branchBooking = bookings?.filter(
    (branchBooking) => branchBooking?.branch._id === userBranch
  );

  // Find User Booking By Filtering
  let totalBookingAmount = 0;

  if (isFilter) {
    const filterBookings = branchBooking.filter((booking) =>
      filterData?.map((data) => data?.orderId).includes(booking?._id)
    );

    for (const item of filterBookings) {
      totalBookingAmount += item.payableAmount;
    }
  } else {
    const filterBookings = branchBooking.filter((booking) =>
      data?.map((data) => data?.orderId).includes(booking?._id)
    );

    for (const item of filterBookings) {
      totalBookingAmount += item.payableAmount;
    }
  }
  const findManagerBranch = allBranch?.find(
    (branch) => branch?._id === userBranch
  );

  // Get All Branch
  useEffect(() => {
    fetch(`https://api.psh.com.bd/api/branch`)
      .then((res) => res.json())
      .then((data) => setAllBranch(data));
  }, []);

  // Get All Transactions
  const { refetch } = useQuery(
    [data, findManagerBranch?._id, allBranch?.length],
    async () => {
      try {
        const response = await fetch(
          `https://api.psh.com.bd/api/transaction?branch=${findManagerBranch?._id}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Network Error");
        }

        const data = await response.json();
        setData(data?.transaction);
        // Assuming setAllBookings is defined
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    }
  );

  const handlePaymentType = (e) => {
    setPaymentType(e.target.value);
  };

  // find Total Receive Amount
  const handleSearch = async () => {
    const withIdBooking = bookings?.find(
      (data) => data?._id?.slice(-5) === bookingId
    );
    const withUserIdBooking = bookings?.filter(
      (data) => data?.userId?.slice(-5) === userId
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
        `https://api.psh.com.bd/api/transaction?orderId=${orderId}&userId=${bookingUserId}&fromDate=${fromDate}&toDate=${toDate}&branch=${branch}&paymentType=${payementType}&transactionId=${transactionId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setFilterData(data?.transaction);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Find Manager Transaction
  // const managerTransaction = data.filter(
  //   (transaction) => transaction?.branch?._id === userBranch
  // );

  // find Total Receive Amount
  let mytotalReceiveTk = 0;

  // for (const item of managerTransaction) {
  //   mytotalReceiveTk += item.receivedTk;
  // }

  const columns = [
    {
      text: "Date",
      formatter: (cellContent, row, index) => {
        const formattedDate = new Date(row?.paymentDate)
          .toISOString()
          .split("T")[0];
        return (
          <>
            {" "}
            <p>{formattedDate}</p>
          </>
        );
      },
    },
    {
      text: "Booking Id",
      formatter: (cellContent, row, index) => {
        return (
          <>
            <p> #{row?.orderId.slice(19)}</p>
          </>
        );
      },
    },
    {
      dataField: `userName`,
      text: "Full Name",
    },
    {
      text: "User Id",
      formatter: (cellContent, row, index) => {
        return (
          <>
            <p> #{row?.userId?.slice(-5)}</p>
          </>
        );
      },
    },
    {
      dataField: `userPhone`,
      text: "Phone",
    },

    {
      text: "Branch",
      formatter: (cellContent, row, index) => {
        return <p>{row?.branch?.name}</p>;
      },
    },

    {
      text: "Receive Amount",
      formatter: (cellContent, row, index) => {
        return (
          <span className=" fw-bold" style={{ color: "green" }}>
            {" "}
            Tk {row?.receivedTk?.toLocaleString()}
          </span>
        );
      },
    },

    {
      text: "Payment info",
      formatter: (cellContent, row) => {
        return (
          <>
            <div>
              {row?.paymentType === "bkash" || row?.paymentType === "nagad" ? (
                <span className="fw-bold">
                  {" "}
                  {row?.paymentType}, {row?.paymentNumber}, Trx :{" "}
                  {row?.transactionId}
                </span>
              ) : (
                row?.paymentType
              )}
              {row?.paymentType === "bank" ? (
                <span>
                  {" "}
                  {row?.paymentType}, {row?.bankName},{row?.bankHoldingName}
                </span>
              ) : (
                ""
              )}
            </div>
          </>
        );
      },
    },

    {
      text: "Status",
      formatter: (cellContent, row) => {
        return (
          <>
            <div className="d-flex justify-content-center gap-3">
              <p
                style={{
                  color:
                    row?.acceptableStatus === "Accepted" ? "#35b0a7" : "red",
                  fontWeight: 700,
                }}
              >
                {row?.acceptableStatus}
              </p>
            </div>
          </>
        );
      },
    },
    {
      text: "Action",
      formatter: (cellContent, row) => {
        return (
          <>
            <div className="d-flex justify-content-center gap-3">
              {user?.role === "SuperAdmin" ? (
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target={`#transaction${row._id}`}
                  className="d-flex bg-white mt-2"
                >
                  <BiSolidEdit style={{ width: "30px", height: "30px" }} />
                </button>
              ) : (
                ""
              )}

              <button
                type="button"
                className="bg-white"
                data-bs-toggle="modal"
                data-bs-target={`#details${row._id}`}
              >
                <span>
                  <AiOutlineEye style={{ width: "30px", height: "30px" }} />
                </span>
              </button>

              {user?.role === "SuperAdmin" ? (
                <div>
                  <AiOutlineDelete
                    onClick={() => handleDelete(row._id)}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginTop: "10px",
                      cursor: "pointer",
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </div>

            <UpdateTransaction
              data={row}
              refetch={refetch}
              // transactions={managerTransaction}
              bookings={bookings}
              setUserAllBooking={setUserAllBooking}
            />
            {/* Modal Transaction Details */}
            <ViewTransactionModal
              data={row}
              bookings={bookings}
              userAllBooking={userAllBooking}
            />
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
  const [products, setProducts] = useState(data);
  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you Sure?");
    if (confirmation) {
      const url = `https://api.psh.com.bd/api/transaction/${id}`;
      fetch(url, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          MySwal.fire("Good job!", "successfully deleted", "success");
          refetch();
          if (data.deletedCount === 1) {
            const remainItem = products.filter((item) => item._id !== id);
            setProducts(remainItem);
          }
        });
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="content-wrapper h-0" style={{ background: "unset" }}>
          <div className="row customize">
            {/* <div className="col-md-4 home_card_m">
              <div className="card_2">
                <div className="d-flex p-3">
                  <div className="d-flex justify-content-center align-items-center">
                    <img src={img} alt="" className="img2" />
                  </div>
                  <div className="ms-3 text-white">
                    <p className="">Total Payable Amount</p>
                    <p className="fw-bold">
                      Tk{" "}
                      {data?.length > 0 || filterData.length > 0
                        ? totalBookingAmount
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="col-md-4">
              <div className="card_3_transaction">
                <div className="d-flex p-3">
                  <div className="d-flex justify-content-center align-items-center">
                    <img src={img} alt="" className="img3" />
                  </div>
                  <div className="ms-3 text-white">
                    <p>Total Cash Amount</p>
                    <p className="fw-bold">
                      Tk{" "}
                      {data?.length > 0 || filterData.length > 0
                        ? mytotalReceiveTk?.toLocaleString()
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-md-4">
              <div className="card_4">
                <div className="d-flex p-3">
                  <div className="d-flex justify-content-center align-items-center">
                    <img src={img} alt="" className="img3" />
                  </div>
                  <div className="ms-3 text-white">
                    <p>Total Due Amount</p>
                    <p className="fw-bold">
                      Tk{" "}
                      {data?.length > 0 || filterData.length > 0
                        ? totalBookingAmount - mytotalReceiveTk
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="content-wrapper " style={{ background: "unset" }}>
          <section className="content customize_list">
            <div className="">
              <div className=" d-flex justify-content-between gap-5 ">
                <h6 className=" ">Transaction</h6>

                <div className=" d-flex gap-5 ">
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
                  <div>
                    <label htmlFor="">Branch </label> <br />
                    <select
                      className="rounded"
                      style={{ height: "30px" }}
                      // onChange={handleBranch}
                      disabled
                    >
                      <option value={findManagerBranch?._id}>
                        {findManagerBranch?.name}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="">Payment Type </label> <br />
                    <select
                      className="rounded"
                      style={{ height: "30px", width: "100px" }}
                      onChange={handlePaymentType}
                    >
                      <option value="All">All</option>
                      <option value="bkash">Bkash</option>
                      <option value="nagad">Nagad</option>
                      <option value="dutch">dutch-bangla</option>
                      <option value="cash">Cash</option>
                      <option value="bank">Bank</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="">Transaction Id </label> <br />
                    <input
                      type="text"
                      list="transactionId"
                      placeholder="Type Transaction Id"
                      onChange={(e) => setTransactionId(e.target.value)}
                      style={{
                        width: "150px",
                      }}
                    />
                    {/* <datalist id="transactionId">
                      {bookings?.map((booking) => {
                        return (
                          <option key={booking._id}>
                            {booking?.userId?.slice(-5)}
                          </option>
                        );
                      })}
                    </datalist> */}
                  </div>
                  <div>
                    <label htmlFor="">User Id </label> <br />
                    <input
                      type="text"
                      list="userId"
                      placeholder="Type User Id"
                      onChange={(e) => setUserId(e.target.value)}
                      style={{
                        width: "200px",
                      }}
                    />
                    <datalist id="userId">
                      {bookings?.map((booking) => {
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
                        width: "200px",
                      }}
                    />
                    <datalist id="bookingId">
                      {bookings?.map((booking) => {
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
                        height: "35px",
                        padding: "0 10px",
                      }}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
              {isLoading ? (
                <p
                  style={{ margin: "150px 0" }}
                  className="text-center fw-bold"
                >
                  Please Wait... <Spinner size="sm" animation="grow" />
                </p>
              ) : (
                <>
                  <div className="d-flex gap-5 justify-content-end mt-3">
                    {data?.length > 0 || filterData?.length > 0 ? (
                      <div className="mt-2">
                        <ReactToPrint
                          trigger={() => (
                            <button
                              className=" px-3 rounded text-white font-medium"
                              style={{ backgroundColor: "#35b0a7" }}
                            >
                              Print
                            </button>
                          )}
                          content={() => ref.current}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <hr
                    style={{ height: "1px", background: "rgb(191 173 173)" }}
                  />
                  {data?.length > 0 || filterData?.length > 0 ? (
                    <div className="card">
                      <div className="card-body card_body_sm">
                        <>
                          <ToolkitProvider
                            bootstrap4
                            keyField="id"
                            columns={columns}
                            data={isFilter ? filterData : data}
                            pagination={pagination}
                          >
                            {(props) => (
                              <React.Fragment>
                                <BootstrapTable
                                  bootstrap4
                                  keyField="id"
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
                      Find Transctions... <Spinner size="sm" animation="grow" />
                    </p>
                  )}
                </>
              )}
              {/* /.row (main row) */}
            </div>
            <div className="d-none">
              <div ref={ref}>
                <h4 className="mt-5 mb-4 ">Transaction History</h4>
                <Table striped bordered responsive>
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
                    {isFilter
                      ? filterData.map((transaction) => (
                          <TransactionPrint transaction={transaction} />
                        ))
                      : data.map((transaction) => (
                          <TransactionPrint transaction={transaction} />
                        ))}
                  </tbody>
                </Table>
                <div
                  className="d-flex justify-content-end "
                  style={{ marginRight: "280px" }}
                >
                  <p style={{ color: "green" }} className="fw-bold">
                    {" "}
                    Total Cash ={" "}
                    {data?.length > 0 || filterData?.length > 0
                      ? mytotalReceiveTk?.toLocaleString()
                      : 0}{" "}
                    Tk
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* /.content */}
        </div>
      </div>
    </>
  );
};

export default TransactionManager;
