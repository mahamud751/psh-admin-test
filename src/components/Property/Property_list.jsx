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
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Property.css";
import Property from "../../pages/edit/PropertyUpdate";
import { AuthContext } from "../../contexts/UserProvider";
import PropertyUpdate from "../../pages/edit/PropertyUpdate";
import { BiSolidEdit } from "react-icons/bi";
import PropertyUpdate2 from "../../pages/edit/PropertyUpdate2";
import { AiOutlineEye } from "react-icons/ai";
import PropertyDetails from "./PropertyDetails";
import { useQuery } from "react-query";

const Property_list = (props) => {
  const MySwal = withReactContent(Swal);
  const { user } = useContext(AuthContext);
  const userBranch = user?.branch?._id;

  //sub stream
  const [data, setData] = useState([]);

  const [categories, setCategories] = useState({});
  const [branch, setBranch] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "https://psh-server-test.onrender.com/api/category",
          {
            mode: "cors",
          }
        );
        const categoryMap = {};
        data.forEach((category) => {
          categoryMap[category._id] = category.name;
        });
        setCategories(categoryMap);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "https://psh-server-test.onrender.com/api/branch",
          {
            mode: "cors",
          }
        );
        const categoryMap = {};
        data.forEach((category) => {
          categoryMap[category._id] = category.name;
        });
        setBranch(categoryMap);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  // Get Propertys

  const { isLoading, refetch } = useQuery([data, branch], () =>
    fetch(`https://psh-server-test.onrender.com/api/property`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
  );
  const main = data.filter((pd) => pd?.branch?._id === userBranch);

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
              {/* <img
                src={img}
                alt=""
                className="ms-3"
                onClick={() => handleCategory(row._id)}
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
  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `https://psh-server-test.onrender.com/api/property`,
  //         {
  //           mode: "cors",
  //         }
  //       );
  //       setData(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getData();
  // }, []);

  // const mainData = user?.user?.role === "manager" ? main : [];
  // console.log(mainData);
  //delete
  const [products, setProducts] = useState(data);
  const handleCategory = async (id) => {
    const confirmation = window.confirm("Are you Sure?");
    if (confirmation) {
      const url = `https://psh-server-test.onrender.com/api/property/${id}`;
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
                <h6 className="college_h6">Property List</h6>
              </div>
              <div className="export_btn_main">
                <div>
                  <div className="">
                    <div className="corporate_addNew_btn">
                      <Link to="/add_property">
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
                    data={main}
                    pagination={pagination}
                    exportCSV
                  >
                    {(props) => (
                      <React.Fragment>
                        <BootstrapTable
                          bootstrap4
                          keyField="_id"
                          columns={columns}
                          data={main}
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

export default Property_list;
