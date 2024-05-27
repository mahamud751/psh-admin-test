import React, { useState } from "react";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";

import { useQuery } from "react-query";

import { ToastContainer } from "react-toastify";

const RoomVisitAdmin = () => {
  const MySwal = withReactContent(Swal);
  const [data, setData] = useState([]);
  const { isLoading, refetch } = useQuery([], () =>
    fetch(`https://psh-server-test.onrender.com/api/requestVisit`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
  );

  const columns = [
    {
      text: <span>Name</span>,
      formatter: (cellContent, row, index) => {
        return (
          <>
            {" "}
            <p>{row?.fullname}</p>
          </>
        );
      },
    },

    {
      text: <span>Email</span>,
      formatter: (cellContent, row, index) => {
        return (
          <>
            {" "}
            <p>{row?.email}</p>
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
    {
      text: "Visit Time",
      formatter: (cellContent, row, index) => {
        const formattedDate = row?.availabilityForVisitTime;
        return (
          <>
            {" "}
            <p>{formattedDate}</p>
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
      const url = `https://psh-server-test.onrender.com/api/requestVisit/${id}`;
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
              <h6 className=" ">Corporate Visiting Request</h6>
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
          </div>
        </section>
      </div>
    </div>
  );
};

export default RoomVisitAdmin;
