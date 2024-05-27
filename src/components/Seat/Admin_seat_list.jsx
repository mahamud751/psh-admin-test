import React, { useEffect, useState } from "react";
import img from "../../img/college/Icon material-delete.png";
import img3 from "../../img/college/Icon feather-edit.png";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ToolkitProvider, {
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import Seat from "../../pages/edit/Seat";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Admin_seat_list = () => {
  const MySwal = withReactContent(Swal);

  //sub stream
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "https://api.psh.com.bd/api/property",
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
      text: "Image",
      formatter: (cellContent, row) => {
        return (
          <div>
            <img
              src={row.photos && row.photos[0]}
              alt=""
              style={{ width: 120 }}
            />
          </div>
        );
      },
    },
    {
      dataField: "name",
      text: "Seat",
    },
    { dataField: "property.name", text: "Property" },
    {
      dataField: "desc",
      text: "Description",
    },
    {
      dataField: "seatNumber",
      text: "Seat Number",
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
                onClick={() => handleSeat(row._id)}
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
                    <Seat data={row} />
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
        const { data } = await axios.get(`https://api.psh.com.bd/api/seat`, {
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
  const handleSeat = async (id) => {
    const confirmation = window.confirm("Are you Sure?");
    if (confirmation) {
      const url = `https://api.psh.com.bd/api/seat/${id}`;
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
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = [
      { title: "No", dataKey: "no" },
      { title: "Seat", dataKey: "seat" },
    ];
    const tableData = data.map((item, index) => ({
      no: index + 1,
      seat: item.name,
    }));
    doc.autoTable(columns, tableData, { startY: 20 });

    // Save the PDF file
    doc.save("seat_list.pdf");
  };

  return (
    <div className="wrapper">
      <div className="content-wrapper" style={{ background: "unset" }}>
        <section className="content customize_list">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-7">
                <h6 className="college_h6">Seat List</h6>
              </div>
              <div className="export_btn_main">
                <div>
                  <div className="">
                    <div className="corporate_addNew_btn">
                      <Link to={"/add_seat"}>
                        <button className="college_btn2 ms-4 p-3">
                          Add New
                        </button>
                      </Link>
                    </div>
                  </div>
                  <button
                    className="export_btn mt-2 p-3"
                    onClick={handleDownloadPDF}
                  >
                    Export to PDF
                  </button>
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

export default Admin_seat_list;
