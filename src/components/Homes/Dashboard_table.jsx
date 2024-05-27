import React, { useEffect, useState } from "react";
import img from "../../img/college/Icon material-delete.png";
import img3 from "../../img/college/Icon feather-edit.png";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import { Link } from "react-router-dom";
import PropertyEdit from "../../pages/edit/PropertyUpdate";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Dashoboard_table = (props) => {
  const MySwal = withReactContent(Swal);

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
      dataField: "type",
      text: "Type",
    },
    {
      dataField: "desc",
      text: "Description",
    },
    {
      dataField: "availble",
      text: "Availble",
    },
    {
      dataField: "city",
      text: "City",
    },
    {
      dataField: "perDay",
      text: "Per Day",
    },
    {
      dataField: "perMonth",
      text: "Per Month",
    },
    {
      dataField: "perYear",
      text: "Per Month",
    },
    {
      text: "Action",
      formatter: (cellContent, row) => {
        return (
          <>
            {" "}
            <div className="d-flex justify-content-center">
              <img
                src={img3}
                alt=""
                data-toggle="modal"
                data-target={`#loginModal${row._id}`}
              />
              <img
                src={img}
                alt=""
                className="ms-3"
                onClick={() => handleCategory(row._id)}
              />
            </div>
            <div
              className="modal fade"
              id={`loginModal${row._id}`}
              tabIndex="{-1}"
              role="dialog"
              aria-labelledby="loginModal"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ width: 700 }}>
                  <div className="modal-body">
                    <PropertyEdit data={row} />
                  </div>
                </div>
              </div>
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
        const { data } = await axios.get(`https://api.psh.com.bd/api/hotels`, {
          mode: "cors",
        });
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  //delete
  const [products, setProducts] = useState(data);
  const handleCategory = async (id) => {
    const confirmation = window.confirm("Are you Sure?");
    if (confirmation) {
      const url = `https://api.psh.com.bd/api/hotels/${id}`;
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
    <div className="mt-5">
      <div style={{ background: "unset" }}>
        <section className="content">
          <div>
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
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashoboard_table;
