import React, { useEffect, useState } from "react";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import { Link } from "react-router-dom";
import "jspdf-autotable";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { useQuery } from "react-query";

import EventDetails from "./EventDetails";
import EventUpdate from "../../pages/edit/EventUpdate";

const Event_list = () => {
  const MySwal = withReactContent(Swal);
  const { data, refetch, error } = useQuery("eventData", async () => {
    const response = await axios.get("https://api.psh.com.bd/api/event", {
      mode: "cors",
    });
    return response.data;
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching banner data:", error);
    }
  }, [error, data]);
  //sub stream

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
    {
      text: "Picture",
      formatter: (cellContent, row) => {
        return (
          <div>
            <img
              src={row.photos[0]}
              alt=""
              style={{ width: 120, height: 120 }}
            />
          </div>
        );
      },
    },
    {
      dataField: "name",
      text: "Name",
    },

    {
      text: "Action",
      formatter: (cellContent, row) => {
        return (
          <>
            {" "}
            <div className="d-flex justify-content-center">
              <div>
                <button
                  type="button"
                  className="bg-white"
                  data-bs-toggle="modal"
                  data-bs-target={`#update${row._id}`}
                >
                  <span>
                    <BiSolidEdit style={{ width: "30px", height: "30px" }} />
                  </span>
                </button>

                <EventUpdate data={row} refetch={refetch} />
              </div>
              <div>
                <button
                  type="button"
                  className="bg-white"
                  data-bs-toggle="modal"
                  data-bs-target={`#propertyDetails${row._id}`}
                >
                  <span>
                    <AiOutlineEye style={{ width: "30px", height: "30px" }} />
                  </span>
                </button>

                {/* Modal Order Details */}
                <EventDetails data={row} />
              </div>

              <AiOutlineDelete
                onClick={() => handleDelete(row._id)}
                style={{ width: "30px", height: "30px", marginTop: "10px" }}
              />
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

  //delete
  const [blogs, setBlogs] = useState(data);
  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you Sure?");
    if (confirmation) {
      const url = `https://api.psh.com.bd/api/event/${id}`;
      fetch(url, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          MySwal.fire("Good job!", "successfully deleted", "success");
          if (data.deletedCount === 1) {
            const remainItem = blogs.filter((item) => item._id !== id);
            setBlogs(remainItem);
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
                <h6 className="college_h6">Event List</h6>
              </div>
              <div className="export_btn_main">
                <div>
                  <div className="">
                    <div className="corporate_addNew_btn">
                      <Link to={"/add_event"}>
                        <button className="college_btn2 ms-4 p-3">
                          Add New
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
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
                    data={data || []}
                    pagination={pagination}
                    exportCSV
                  >
                    {(props) => (
                      <React.Fragment>
                        <BootstrapTable
                          bootstrap4
                          keyField="_id"
                          columns={columns}
                          data={data || []}
                          pagination={pagination}
                          {...props.baseProps}
                        />
                      </React.Fragment>
                    )}
                  </ToolkitProvider>
                </>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Event_list;
