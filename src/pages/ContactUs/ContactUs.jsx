import React, { useState } from "react";

import axios from "axios";

import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";

import { useQuery } from "react-query";

import { AiOutlineDelete } from "react-icons/ai";

import { ToastContainer, toast } from "react-toastify";
import Accept from "./Accept";

const ContactUs = () => {
  //sub stream
  const [data, setData] = useState([]);

  const columns = [
    {
      text: "Name",
      formatter: (cellContent, row) => {
        return <p>{row?.name}</p>;
      },
    },
    {
      text: "Email",
      formatter: (cellContent, row) => {
        return <p>{row?.email}</p>;
      },
    },
    {
      text: "Mobile Number",
      formatter: (cellContent, row) => {
        return <p>{row?.mobileNumber} </p>;
      },
    },
    {
      text: "Pur Pose",
      formatter: (cellContent, row) => {
        return <p>{row?.purPose} </p>;
      },
    },
    {
      text: "Appointment Date",
      formatter: (cellContent, row) => {
        return <p>{row?.appointMentDate} </p>;
      },
    },
    {
      text: "AppointMent Time",
      formatter: (cellContent, row) => {
        return <p>{row?.appointMentTime} </p>;
      },
    },
    {
      text: "Message",
      formatter: (cellContent, row) => {
        return <p>{row?.contactMsg} </p>;
      },
    },

    {
      text: "Status",
      formatter: (cellContent, contact) => {
        return (
          <>
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target={`#accept${contact?._id}`}
              style={{
                backgroundColor:
                  contact?.status === "Accepted" ? "#d9dede" : "#17a2b8",
                color: "white",
                border: "none",
              }}
              disabled={contact?.status === "Accepted" ? true : false}
            >
              Accept
            </button>

            <Accept contact={contact} />
          </>
        );
      },
    },
    {
      text: "Action",
      formatter: (cellContent, contact) => {
        return (
          <>
            <div className="d-flex justify-content-center gap-5">
              <div className="">
                <button className="btn">
                  <AiOutlineDelete
                    onClick={() => handleDelete(contact?._id)}
                    style={{ width: "30px", height: "30px" }}
                    className="delete-button"
                  />
                </button>
              </div>
            </div>
            {/* Modal order Date Update */}

            <div className="d-flex justify-content-center"></div>
            <div
              className="modal fade"
              id={`loginModal${contact._id}`}
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
    fetch(`https://api.psh.com.bd/api/contact`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data?.contactUs);
      })
  );

  //delete
  const [contactUs, setContactUs] = useState(data);
  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you Sure?");
    if (confirmation) {
      const url = `https://api.psh.com.bd/api/contact/${id}`;
      fetch(url, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          refetch();
          toast.success("Deleted");
          if (data.deletedCount === 1) {
            const remainItem = contactUs.filter((item) => item._id !== id);
            setContactUs(remainItem);
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
                <h6 className="college_h6">Contact Us List</h6>
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

export default ContactUs;
