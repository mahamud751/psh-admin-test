import React, { useContext, useEffect, useRef, useState } from "react";
import img from "../../img/college/Icon material-delete.png";
import img3 from "../../img/college/Icon feather-edit.png";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import { Link } from "react-router-dom";

import "jspdf-autotable";
import "./Property.css";

import { useQuery } from "react-query";

import { ToastContainer, toast } from "react-toastify";
import { AiOutlineEye } from "react-icons/ai";
import RentDeatals from "./RentDeatals";
import { Spinner, Table } from "react-bootstrap";
import ReactToPrint from "react-to-print";
import ReportPrint from "./ReportPrint";
import { AuthContext } from "../../contexts/UserProvider";

const PropertyReports = (props) => {
  const ref = useRef();
  const { logoutUser, user } = useContext(AuthContext);

  const userBranch = user?.branch?.name;

  //sub stream
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [isDate, setIsDate] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [bookedSeat, setBookedSeat] = useState([]);
  const [availbleSeats, setAvailbleSeats] = useState([]);

  const [branches, setBranches] = useState([]);
  const [selectCategory, setSelectCategory] = useState("All");
  const [selectBranch, setSelectBranch] = useState("All");
  const [bookingCheck, setBookingCheck] = useState("All");

  // Fetch categories
  const { refetch: refetchCategories } = useQuery(
    ["categoryList"],
    async () => {
      try {
        const response = await axios.get(
          `https://psh-server-test.onrender.com/api/category`
        );
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  );

  // Fetch branches
  const { refetch: refetchBranches } = useQuery(["branchList"], async () => {
    try {
      const response = await axios.get(
        `https://psh-server-test.onrender.com/api/branch`
      );
      setBranches(response.data);
    } catch (error) {
      console.error(error);
    }
  });

  // Fetch property list
  const { refetch: refetchPropertyList } = useQuery(
    ["propertyList"],
    async () => {
      try {
        let response;
        if (
          userBranch &&
          (user?.role === "manager" || user?.role === "partner")
        ) {
          response = await axios.get(
            "https://psh-server-test.onrender.com/api/property/booking-report",
            {
              params: {
                branch: userBranch,
              },
              mode: "cors",
            }
          );
        } else {
          response = await axios.get(
            "https://psh-server-test.onrender.com/api/property/booking-report",
            {
              mode: "cors",
            }
          );
        }
        setData(response.data?.allProperty);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  );

  // Handle Search

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://psh-server-test.onrender.com/api/property/booking-report",
        {
          params: {
            category: selectCategory,
            branch:
              userBranch &&
              (user?.role === "manager" || user?.role === "partner")
                ? userBranch
                : selectBranch,
            fromDate: fromDate,
            toDate: toDate,
            bookingCheck: bookingCheck,
            roomNumber: roomNumber.toUpperCase(),
          },
          mode: "cors",
        }
      );
      return response.data?.allProperty || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const findBookedSeats = (data, fromDate, toDate) => {
    const bookedSeats = [];
    data.forEach((item) => {
      item.seats.forEach((seat) => {
        if (
          seat.rentDate &&
          seat.rentDate.some(
            (date) => date.bookEndDate >= fromDate && date.bookEndDate <= toDate
          )
        ) {
          bookedSeats.push(seat);
        }
      });
    });
    return bookedSeats;
  };

  const findAvailableSeats = (data, fromDate, toDate) => {
    const availableSeats = [];
    data.forEach((item) => {
      item.seats.forEach((seat) => {
        if (
          seat.rentDate &&
          !seat.rentDate.some(
            (date) => date.bookEndDate >= fromDate && date.bookEndDate <= toDate
          )
        ) {
          availableSeats.push(seat);
        }
      });
    });
    return availableSeats;
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setIsFilter(true);

    if (bookingCheck !== "All" && selectCategory === "All") {
      toast.error("Please Select Category Type");
      setIsLoading(false);
      return;
    }
    if (bookingCheck !== "All" && (!fromDate || !toDate)) {
      toast.error("Please Select From Date and To Date");
      setIsLoading(false);
      return;
    }

    if (bookingCheck !== "All" && fromDate && toDate) {
      setIsDate(true);
    } else {
      setIsDate(false);
    }
    try {
      const data = await fetchData();
      setFilterData(data);

      const bookedSeats = findBookedSeats(data, fromDate, toDate);
      setBookedSeat(bookedSeats);

      const availableSeats = findAvailableSeats(data, fromDate, toDate);
      setAvailbleSeats(availableSeats);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      text: "No",
      formatter: (cellContent, row, index) => {
        return (
          <>
            {" "}
            <p>{index + 1}</p>
          </>
        );
      },
    },
    { dataField: "category.name", text: "Category" },
    { dataField: "branch.name", text: "Branch" },
    {
      dataField: "roomNumber",
      text: "Room No.",
    },

    {
      text: "Seats",
      formatter: (cellContent, row) => {
        return (
          <>
            <div>
              {row?.seats?.map((seat) => {
                return (
                  <div className=" fw-bold mr-2">
                    <p
                      style={{
                        color: isFilter
                          ? bookedSeat.some((booked) => booked._id === seat._id)
                            ? "red"
                            : "black"
                          : "",
                      }}
                    >
                      {seat?.seatNumber},
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        );
      },
    },

    {
      text: "Booking Details",
      formatter: (cellContent, row) => {
        return (
          <>
            <div className="d-flex justify-content-center fw-bold">
              <button
                type="button"
                className="bg-white"
                data-bs-toggle="modal"
                data-bs-target={`#rentDetails${row._id}`}
              >
                <span>
                  <AiOutlineEye style={{ width: "24px", height: "24px" }} />
                </span>
              </button>
            </div>

            <RentDeatals data={row} />
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

  return (
    <>
      <div className="wrapper">
        <div className="content-wrapper" style={{ background: "unset" }}>
          <section className="content customize_list">
            <div className="container-fluid">
              <div className="d-flex justif-content-between">
                <p
                  className="fs-5"
                  style={{
                    backgroundColor: "#35b0a7",
                    padding: "0 15px",
                    color: "white",
                  }}
                >
                  Total Room : {isFilter ? filterData?.length : data?.length}
                </p>
                {isFilter &&
                selectCategory === "Shared Room" &&
                bookedSeat?.length > 0 ? (
                  <p
                    className="fs-5"
                    style={{
                      marginLeft: 20,
                      backgroundColor: "#35b0a7",
                      padding: "0 15px",
                      color: "white",
                    }}
                  >
                    Occupied Seat : {bookedSeat?.length}
                  </p>
                ) : (
                  ""
                )}
                {isFilter &&
                selectCategory === "Shared Room" &&
                availbleSeats?.length > 0 ? (
                  <p
                    className="fs-5"
                    style={{
                      marginLeft: 20,
                      backgroundColor: "#35b0a7",
                      padding: "0 15px",
                      color: "white",
                    }}
                  >
                    Available Seat : {availbleSeats?.length}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div className="row">
                <div className="col-md-7">
                  <h6 className="college_h6">Booking Reports</h6>
                </div>{" "}
                <div className="d-flex justify-content-end ">
                  <div>
                    <div>
                      <label htmlFor="Category">Category: </label>
                    </div>
                    <select
                      onChange={(e) => setSelectCategory(e.target.value)}
                      style={{
                        height: "30px",
                      }}
                    >
                      <option value="All">All</option>
                      {categories?.map((category) => (
                        <option key={category._id} value={category?.name}>
                          {category?.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginLeft: 10 }}>
                    <div>
                      <label htmlFor="branch">Branch</label>
                    </div>

                    <select
                      onChange={(e) => setSelectBranch(e.target.value)}
                      style={{
                        height: "30px",
                      }}
                    >
                      {userBranch &&
                      (user?.role === "manager" || user?.role === "partner") ? (
                        <option value={userBranch}>{userBranch}</option>
                      ) : (
                        <>
                          <option value="All">All</option>
                          {branches?.map((branch) => (
                            <option key={branch._id} value={branch?.name}>
                              {branch?.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                  <div style={{ marginLeft: 10 }}>
                    <div>
                      <label htmlFor="booking">Room</label>
                    </div>

                    <select
                      onChange={(e) => setBookingCheck(e.target.value)}
                      style={{
                        height: "30px",
                      }}
                    >
                      <option>All</option>

                      <option>Occupied</option>

                      <option>Available</option>
                    </select>
                  </div>

                  {bookingCheck !== "All" ? (
                    <>
                      <div className="" style={{ marginLeft: 10 }}>
                        <label htmlFor="">From Date </label>
                        <br />
                        <div>
                          <input
                            style={{
                              height: "30px",
                            }}
                            type="date"
                            onChange={(e) => setFromDate(e.target.value)}
                            name=""
                            id=""
                          />
                        </div>
                      </div>
                      <div className="" style={{ marginLeft: 10 }}>
                        <label htmlFor="">To Date </label> <br />
                        <div>
                          <input
                            style={{
                              height: "30px",
                            }}
                            type="date"
                            name=""
                            id=""
                            onChange={(e) => setToDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  <div style={{ marginLeft: 10 }}>
                    <label htmlFor="">Room No. </label> <br />
                    <input
                      type="text"
                      list="roomNumber"
                      placeholder="Type Room Number"
                      onChange={(e) => setRoomNumber(e.target.value)}
                      style={{
                        width: "200px",
                      }}
                    />
                  </div>
                  <div style={{ marginLeft: 10, marginTop: 30 }}>
                    <button
                      onClick={handleSearch}
                      className="btn text-white mb-5"
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
                <div className="export_btn_main">
                  {data.length > 0 || filterData.length > 0 ? (
                    <div className="mt-2">
                      <ReactToPrint
                        trigger={() => (
                          <button
                            className=" px-3 rounded text-white font-medium"
                            style={{ backgroundColor: "#35b0a7" }}
                          >
                            Print Reports
                          </button>
                        )}
                        content={() => ref.current}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <hr style={{ height: "1px", background: "rgb(191 173 173)" }} />
              {isLoading ? (
                <p
                  style={{ margin: "150px 0" }}
                  className="text-center text-danger fw-bold"
                >
                  Please Wait...
                  <Spinner size="sm" animation="grow" />
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
                  Find Reports... <Spinner size="sm" animation="grow" />
                </p>
              )}
            </div>

            <div className="d-none">
              <div ref={ref}>
                <h4 className="mt-5 mb-4 ms-5">Booking Reports</h4>
                <Table
                  striped
                  bordered
                  responsive
                  // style={{
                  //   width: "1000px",
                  // }}
                  className="mx-5"
                >
                  <thead>
                    <tr>
                      <th> Room Number</th>
                      <th> Seats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isFilter
                      ? filterData.map((room) => (
                          <ReportPrint room={room} key={room?._id} />
                        ))
                      : data.map((room) => (
                          <ReportPrint room={room} key={room?._id} />
                        ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PropertyReports;
