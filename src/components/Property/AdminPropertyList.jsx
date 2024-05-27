import React, { useContext, useEffect, useState } from "react";
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

import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";

import PropertyDetails from "./PropertyDetails";
import PropertyStatusUpdate from "../../pages/edit/PropertyStatusUpdate";
import { useQuery } from "react-query";
import PropertyUpdate2 from "../../pages/edit/PropertyUpdate2";
import { ToastContainer, toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

const AdminPropertyList = (props) => {
  const MySwal = withReactContent(Swal);

  //sub stream
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);

  const [categories, setCategories] = useState([]);

  const [branches, setBranches] = useState([]);
  const [selectCategory, setSelectCategory] = useState("All");
  const [selectBranch, setSelectBranch] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const { refetch: categoryList } = useQuery(["categoryList"], async () => {
    try {
      const response = await axios.get(`https://api.psh.com.bd/api/category`, {
        mode: "cors",
      });

      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  });
  const { refetch: branchList } = useQuery(["branchList"], async () => {
    try {
      const response = await axios.get(`https://api.psh.com.bd/api/branch`, {
        mode: "cors",
      });

      setBranches(response.data);
    } catch (error) {
      console.error(error);
    }
  });

  // Get Properties
  const { refetch } = useQuery(["propertyList"], async () => {
    try {
      const response = await axios.get("https://api.psh.com.bd/api/property", {
        mode: "cors",
      });

      setData(response.data); // Return data from the async function
    } catch (error) {
      console.error(error);
      throw error; // Throw the error to handle it in the caller
    }
  });

  // Handle Search

  const handleSearch = async () => {
    setIsLoading(true);
    setIsFilter(true);

    try {
      const response = await axios.get("https://api.psh.com.bd/api/property", {
        params: {
          sCategory: selectCategory !== "All" ? selectCategory : undefined,
          sBranch: selectBranch !== "All" ? selectBranch : undefined,
          roomNumber: roomNumber.toUpperCase(),
        },
        mode: "cors",
      });

      setFilterData(response.data);
    } catch (error) {
      console.error(error);
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
      dataField: "roomNumber",
      text: "Room No.",
    },
    { dataField: "category.name", text: "Category" },
    { dataField: "branch.name", text: "Branch" },

    {
      text: "Per Day",
      formatter: (cellContent, row) => {
        return (
          <>
            <div className=" d-flex ">
              <div>
                <p className="fw-bold">{row?.perDay?.toLocaleString()}</p>
              </div>
            </div>
          </>
        );
      },
    },

    {
      text: "Per Month",
      formatter: (cellContent, row) => {
        return (
          <>
            <div className=" d-flex ">
              <div>
                <p className="fw-bold">{row?.perMonth?.toLocaleString()}</p>
              </div>
            </div>
          </>
        );
      },
    },
    {
      text: "Per Year",
      formatter: (cellContent, row) => {
        return (
          <>
            <div className=" d-flex ">
              <div>
                <p className="fw-bold">{row?.perYear?.toLocaleString()}</p>
              </div>
            </div>
          </>
        );
      },
    },

    {
      text: "Seats",
      formatter: (cellContent, row) => {
        return (
          <>
            <div>
              {row?.seats?.map((seat) => (
                <div className="d-flex">
                  <p>{seat?.seatNumber}</p>
                </div>
              ))}
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
            <div className=" d-flex ">
              <div>
                <p
                  className="fw-bold"
                  style={{
                    color: row?.isPublished === "Published" ? "#27b3b1" : "red",
                  }}
                >
                  {row?.isPublished}
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
              <PropertyStatusUpdate data={row} refetch={refetch} />
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
            {" "}
            <div className="d-flex justify-content-center">
              <div>
                <button
                  type="button"
                  className="bg-white"
                  data-bs-toggle="modal"
                  data-bs-target={`#propertyUpdate${row._id}`}
                >
                  <span>
                    <BiSolidEdit style={{ width: "24px", height: "24px" }} />
                  </span>
                </button>
              </div>

              <div>
                <PropertyUpdate2 data={row} refetch={refetch} />
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
                <PropertyDetails data={row} />
              </div>

              {/* <AiOutlineDelete
                onClick={() => handleDelete(row._id)}
                style={{ width: "30px", height: "30px", marginTop: "10px" }}
              /> */}
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
  const [products, setProducts] = useState(data);
  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you Sure?");
    if (confirmation) {
      const url = `https://api.psh.com.bd/api/property/${id}`;
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
            </div>
            <div className="row">
              <div className="col-md-7">
                <h6 className="college_h6">Property List</h6>
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
                    <option value="All">All</option>
                    {branches?.map((branch) => (
                      <option key={branch._id} value={branch?.name}>
                        {branch?.name}
                      </option>
                    ))}
                  </select>
                </div>

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
                <div>
                  <div className="">
                    <div className="corporate_addNew_btn">
                      <Link to={"/add_property"}>
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
                Find Properties...
                <Spinner size="sm" animation="grow" />
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPropertyList;
