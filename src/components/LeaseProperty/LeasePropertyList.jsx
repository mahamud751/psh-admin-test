import React, { useEffect, useState } from "react";
import img from "../../img/college/Icon material-delete.png";
import img3 from "../../img/college/Icon feather-edit.png";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";

import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import SeeLeasePropropery from "./SeeLeasePropropery";

const LeasePropertyList = () => {
  const MySwal = withReactContent(Swal);

  //sub stream
  const [data, setData] = useState([]);

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
      dataField: `firstName`,
      text: "User Name",
    },

    // {
    //   dataField: "email",
    //   text: "Email",
    // },
    {
      dataField: "phoneNumber",
      text: "Number",
    },

    {
      text: "Property Size",
      formatter: (cellContent, row, index) => {
        return (
          <>
            {" "}
            <p>{row?.propertySize} Sq.ft</p>
          </>
        );
      },
    },
    {
      dataField: "propertyType",
      text: "Property Type",
    },
    {
      text: "Address",
      formatter: (cellContent, row, index) => {
        return (
          <>
            {" "}
            <p>
              {row?.stateRegion}, {row?.address},{row?.city}
            </p>
          </>
        );
      },
    },
    // {
    //   dataField: "status",
    //   text: "Status",
    // },

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
                  data-bs-target={`#details${row._id}`}
                >
                  <span>
                    <AiOutlineEye style={{ width: "30px", height: "30px" }} />
                  </span>
                </button>

                {/* Modal Order Details */}
                <SeeLeasePropropery data={row} />
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
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `https://api.psh.com.bd/api/leaseproperty`,
          {
            mode: "cors",
          }
        );
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  //delete
  const [products, setProducts] = useState(data);
  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you Sure?");
    if (confirmation) {
      const url = `https://api.psh.com.bd/api/leaseProperty/${id}`;
      fetch(url, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
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
            <div className="row">
              <div className="col-md-7">
                <h6 className="college_h6">Lease Property List</h6>
              </div>
            </div>
            <hr style={{ height: "1px", background: "rgb(191 173 173)" }} />
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

export default LeasePropertyList;
