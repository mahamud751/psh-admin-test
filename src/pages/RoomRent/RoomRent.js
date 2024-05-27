import React, { useState } from "react";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";

import { AiOutlineEye } from "react-icons/ai";

import { useQuery } from "react-query";

import { ToastContainer } from "react-toastify";
import SeeRoomRentDetails from "./SeeRoomRentDetails";

const RoomRent = () => {
  const MySwal = withReactContent(Swal);
  const [data, setData] = useState([]);
  const { isLoading, refetch } = useQuery([], () =>
    fetch(`https://psh-server-test.onrender.com/api/requestRent`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
  );

  const columns = [
    {
      text: <span>FirstName</span>,
      formatter: (cellContent, row, index) => {
        return (
          <>
            {" "}
            <p>{row?.firstName}</p>
          </>
        );
      },
    },

    {
      text: <span>Phone</span>,
      formatter: (cellContent, row, index) => {
        return (
          <>
            {" "}
            <p>{row?.phone}</p>
          </>
        );
      },
    },
    // {
    //   text: "email",
    //   formatter: (cellContent, row, index) => {
    //     return (
    //       <>
    //         {" "}
    //         <p>{row?.email}</p>
    //       </>
    //     );
    //   },
    // },
    {
      dataField: "totalRoom",
      text: "TotalRoom",
    },
    {
      dataField: "position",
      text: "Position",
    },
    {
      dataField: "company",
      text: "Company",
    },
    {
      dataField: "companyEmail",
      text: "Company Email ",
    },
    {
      dataField: "location",
      text: "Location",
    },
    {
      dataField: "propertyType",
      text: "Property Type",
    },

    {
      dataField: "location",
      text: "Location",
    },
    {
      text: "Availability For Visit",
      formatter: (cellContent, row, index) => {
        const formattedDate = new Date(
          row?.availabilityForVisit
        ).toLocaleString();
        return (
          <>
            {" "}
            <p>{formattedDate?.split(",")[0]}</p>
          </>
        );
      },
    },

    // {
    //   text: "returnTime",
    //   formatter: (cellContent, row, index) => {
    //     return (
    //       <>
    //         {" "}
    //         <p>{row?.returnTime}</p>
    //       </>
    //     );
    //   },
    // },
    // {
    //   text: "knowAbout",
    //   formatter: (cellContent, row, index) => {
    //     return (
    //       <>
    //         {" "}
    //         <p>{row?.knowAbout}</p>
    //       </>
    //     );
    //   },
    // },

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
            <SeeRoomRentDetails data={row} />
          </div>
        );
      },
    },

    // {
    //   text: "Action",
    //   formatter: (cellContent, row) => {
    //     return (
    //       <>
    //         <div className="d-flex gap-2 fw-bold">
    //           <button
    //             type="button"
    //             data-bs-toggle="modal"
    //             data-bs-target={`#payment${row._id}`}
    //             style={{ backgroundColor: "#00BBB4" }}
    //           >
    //             Payment
    //           </button>
    //           {/*
    //           <button className="bg-danger">End</button> */}
    //         </div>
    //       </>
    //     );
    //   },
    // },
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
      const url = `https://psh-server-test.onrender.com/api/requestRent/${id}`;
      fetch(url, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          MySwal.fire("Good job!", "successfully deleted", "success");
          if (data.deletedCount === 1) {
            const remainItem = products.filter((item) => item._id !== id);
            setProducts(remainItem);
          }
        });
    }
  };
  return (
    <div className="wrapper">
      <div className="content-wrapper" style={{ background: "unset" }}>
        <section className="content customize_list">
          <div className="container-fluid">
            <div className=" d-flex justify-content-between gap-5 ">
              <h6 className=" ">Corporate Housing Request</h6>
            </div>
            <hr style={{ height: "1px", background: "rgb(191 173 173)" }} />
            {data?.length > 0 ? (
              <div className="card">
                <div className="card-body card_body_sm">
                  <>
                    <ToolkitProvider
                      bootstrap4
                      keyField="id"
                      columns={columns}
                      data={data}
                      pagination={pagination}
                    >
                      {(props) => (
                        <React.Fragment>
                          <BootstrapTable
                            bootstrap4
                            keyField="id"
                            columns={columns}
                            data={data}
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
                Sorry No Request Found
              </p>
            )}
            {/* /.row (main row) */}
          </div>
          {/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
      {/* /.content-wrapper */}

      {/* Control Sidebar */}
    </div>
  );
};

export default RoomRent;
