import React, { useState } from "react";

import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";

import "jspdf-autotable";
import { useQuery } from "react-query";
import { BiSolidEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import UpdateAdjustment from "./UpdateAdjustment";
import { ToastContainer, toast } from "react-toastify";

const AdjustmentList = () => {
  const MySwal = withReactContent(Swal);

  //sub stream
  const [data, setData] = useState([]);

  console.log(data);
  const columns = [
    {
      text: "Booking Id",
      formatter: (cellContent, row) => {
        return (
          <div>
            <p>#{row?.booking?._id?.slice(0, 5)}</p>
            <p>{row?.branch?.name}</p>
          </div>
        );
      },
    },
    {
      text: "User Id",
      formatter: (cellContent, row) => {
        return (
          <div>
            <p>#{row?.userId?._id?.slice(0, 5)}</p>
            <p>{row?.userId?.firstName}</p>
          </div>
        );
      },
    },
    {
      text: "Total Amount",
      formatter: (cellContent, row) => {
        return <p>{row?.booking?.totalAmount} Tk</p>;
      },
    },
    {
      text: "Discount",
      formatter: (cellContent, row) => {
        return <p>{row?.booking?.discount} Tk</p>;
      },
    },
    {
      text: "Payable Amount",
      formatter: (cellContent, row) => {
        return <p>{row?.booking?.payableAmount} Tk</p>;
      },
    },
    {
      text: "Total Receive",
      formatter: (cellContent, row) => {
        return <p>{row?.booking?.totalReceiveTk} Tk</p>;
      },
    },
    {
      text: "Due",
      formatter: (cellContent, row) => {
        return <p>{row?.booking?.dueAmount} Tk</p>;
      },
    },
    {
      text: "Adjustment RQ",
      formatter: (cellContent, adjustment) => {
        return (
          <div className="d-flex justify-content-between">
            <p>{adjustment?.adjustmentAmount} Tk</p>
            <button
              disabled={adjustment?.status === "Accepted" ? true : false}
              onClick={() => handleAccept(adjustment)}
              className="btn"
              style={{ backgroundColor: "#00bbb4", color: "white" }}
            >
              {adjustment?.status === "Accepted" ? "Accepted" : "Accept"}
            </button>
          </div>
        );
      },
    },

    {
      text: "Action",
      formatter: (cellContent, adjustment) => {
        return (
          <>
            <div className="d-flex justify-content-center gap-5">
              <button
                type="button"
                className="bg-white"
                data-bs-toggle="modal"
                data-bs-target={`#discount${adjustment?._id}`}
                disabled={adjustment?.status === "Accepted" ? true : false}
              >
                <BiSolidEdit style={{ width: "30px", height: "30px" }} />
              </button>
              <div className="">
                <button
                  className="btn "
                  disabled={
                    adjustment?.status === "Accepted"
                      ? true
                      : false ||
                        adjustment?.booking?.payableAmount ===
                          adjustment?.booking?.totalReceiveTk
                      ? true
                      : false
                  }
                >
                  <AiOutlineDelete
                    onClick={() => handleDelete(adjustment?._id)}
                    style={{ width: "30px", height: "30px" }}
                    className="delete-button"
                  />
                </button>
              </div>
            </div>
            {/* Modal order Date Update */}

            <div>
              <UpdateAdjustment data={adjustment} refetch={refetch} />
            </div>

            <div className="d-flex justify-content-center"></div>
            <div
              className="modal fade"
              id={`loginModal${adjustment._id}`}
              tabIndex="{-1}"
              role="dialog"
              aria-labelledby="loginModal"
              aria-hidden="true"
            ></div>
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
  // Get All Adjustment
  const { isLoading, refetch } = useQuery([], () =>
    fetch(`https://api.psh.com.bd/api/adjustment`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data?.adjustment);
      })
  );

  // handle Accept Adjustment
  const handleAccept = async (adjustment) => {
    const adjustmentData = {
      status: "Accepted",
      adjustmentAmount: adjustment?.adjustmentAmount,
    };

    try {
      await axios.patch(
        `https://api.psh.com.bd/api/adjustment/${adjustment._id}`,
        adjustmentData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Accepted");
      refetch();
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  };

  //delete
  const [adjustments, setAdjustment] = useState(data);
  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you Sure?");
    if (confirmation) {
      const url = `https://api.psh.com.bd/api/adjustment/${id}`;
      fetch(url, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          refetch();
          toast.success("Deleted");
          if (data.deletedCount === 1) {
            const remainItem = adjustments.filter((item) => item._id !== id);
            setAdjustment(remainItem);
          }
        });
    }
  };

  return (
    <div className="wrapper">
      <div className="content-wrapper" style={{ background: "unset" }}>
        <section className="content customize_list">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-7">
                <h6 className="college_h6">Adjustment List</h6>
              </div>
            </div>
            <hr style={{ height: "1px", background: "rgb(191 173 173)" }} />
            <div className="card">
              <div className="card-body card_body_sm">
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="_id"
                    columns={columns}
                    data={data}
                    pagination={pagination}
                    exportCSV
                  >
                    {(props) => (
                      <React.Fragment>
                        <BootstrapTable
                          bootstrap4
                          keyField="_id"
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

export default AdjustmentList;
