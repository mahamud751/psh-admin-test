import React, { useState } from "react";

import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";

import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";

import { useQuery } from "react-query";

import { ToastContainer } from "react-toastify";
import { useEffect } from "react";

import UserStatusUpdate from "./UserStatusUpdate";

const UserManage = () => {
  const MySwal = withReactContent(Swal);

  //sub stream
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (data) {
      const users = data?.filter((user) => user?.role === "user");
      setUsers(users);
    }
  }, [data]);
  const { isLoading, refetch } = useQuery([data], () =>
    fetch(`https://api.psh.com.bd/api/users`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
  );

  const columns = [
    {
      text: "Sign-up Date",
      formatter: (cellContent, row, index) => {
        const formattedDate = new Date(row?.createdAt).toLocaleString();
        const formattedTime = new Date(row?.createdAt)
          ?.toLocaleString()
          ?.split(",")[1];
        return (
          <>
            {" "}
            <p>{formattedDate?.split(",")[0]}</p>
            <p>{formattedTime}</p>
          </>
        );
      },
    },
    {
      dataField: `firstName`,
      text: "Full Name",
    },
    {
      dataField: `email`,
      text: "Email",
    },
    {
      dataField: `phone`,
      text: "Phone Number",
    },
    {
      dataField: `userStatus`,
      text: "User Status",
    },
    {
      dataField: `role`,
      text: "Role",
    },

    {
      text: "Action",
      formatter: (cellContent, row) => {
        return (
          <>
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target={`#status${row._id}`}
              className="d-flex justify-content-center order-status bg-white"
            >
              <BiSolidEdit style={{ width: "30px", height: "30px" }} />
            </button>

            <div>
              <UserStatusUpdate data={row} refetch={refetch} />
            </div>
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
    <div className="wrapper">
      <div className="content-wrapper" style={{ background: "unset" }}>
        <section className="content customize_list">
          <div className="container-fluid">
            <div className="">
              <h6 className="college_h6">
                Total User : ({users?.length}) Person
              </h6>
            </div>
            <hr style={{ height: "1px", background: "rgb(191 173 173)" }} />
            <div className="card">
              <div className="card-body card_body_sm">
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="id"
                    columns={columns}
                    data={users}
                    pagination={pagination}
                  >
                    {(props) => (
                      <React.Fragment>
                        <BootstrapTable
                          bootstrap4
                          keyField="id"
                          columns={columns}
                          data={users}
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

export default UserManage;
