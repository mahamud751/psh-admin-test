import React, { useEffect, useState } from "react";
import img from "../../img/college/Icon material-delete.png";
import img3 from "../../img/college/Icon feather-edit.png";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import Category from "../../pages/edit/Category";
import { Link } from "react-router-dom";
import PromoUpdate from "../../pages/edit/PromoUpdate";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useQuery } from "react-query";
import { BiSolidEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";

const Promo_list = () => {
  const MySwal = withReactContent(Swal);

  //sub stream
  const [data, setData] = useState([]);

  const columns = [
    {
      dataField: "promoName",
      text: "Promo Name",
    },
    {
      dataField: "promoCode",
      text: "Promo Code",
    },
    {
      text: "Total Duration",
      formatter: (cellContent, row) => {
        return <p>{row.minimumDays} Days</p>;
      },
    },

    {
      dataField: "promoStart",
      text: "Promo Start",
    },

    {
      dataField: "promoEnd",
      text: "Promo End",
    },
    {
      text: "Discount",
      formatter: (cellContent, row) => {
        return <p>{row.promoDiscount}%</p>;
      },
    },
    {
      dataField: "promoDetails",
      text: "Details",
    },
    {
      text: "Image",
      formatter: (cellContent, row) => {
        return (
          <div>
            <img
              src={row.photos[0] && row.photos[0]}
              alt=""
              style={{ width: 120 }}
            />
          </div>
        );
      },
    },

    {
      text: "Action",
      formatter: (cellContent, row) => {
        return (
          <>
            <div className="d-flex justify-content-center gap-5">
              <button
                type="button"
                className="bg-white"
                data-bs-toggle="modal"
                data-bs-target={`#promo${row._id}`}
              >
                <BiSolidEdit style={{ width: "30px", height: "30px" }} />
              </button>
              <div className="mt-2">
                <AiOutlineDelete
                  onClick={() => handleCategory(row._id)}
                  style={{ width: "30px", height: "30px" }}
                />
              </div>
            </div>
            {/* Modal order Date Update */}

            <div>
              <PromoUpdate data={row} refetch={refetch} />
            </div>

            <div className="d-flex justify-content-center"></div>
            <div
              className="modal fade"
              id={`loginModal${row._id}`}
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
  // Get All Promo
  const { isLoading, refetch } = useQuery([], () =>
    fetch(`https://psh-server-test.onrender.com/api/promo`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
  );

  //delete
  const [products, setProducts] = useState(data);
  const handleCategory = async (id) => {
    const confirmation = window.confirm("Are you Sure?");
    if (confirmation) {
      const url = `https://psh-server-test.onrender.com/api/promo/${id}`;
      fetch(url, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          MySwal.fire("Good job!", "successfully deleted", "success");
          refetch();
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
                <h6 className="college_h6">Discount List</h6>
              </div>
              <div className="export_btn_main">
                <div>
                  <div className="">
                    <div className="corporate_addNew_btn">
                      <Link to={"/add_promo"}>
                        <button className="college_btn2 ms-4 p-3">
                          Add New Discount
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

export default Promo_list;
