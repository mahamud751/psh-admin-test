import React, { useEffect, useState } from "react";
import img from "../../../img/college/Icon material-delete.png";
import img3 from "../../../img/college/Icon feather-edit.png";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ToolkitProvider, {
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import { Link } from "react-router-dom";
import "./Postlist.css";

const MyExportCSV = (props) => {
  const handleClick = () => {
    props.onExport();
  };
  return (
    <div>
      <button className="college_btn mb-3" onClick={handleClick}>
        Export to CSV
      </button>
    </div>
  );
};
const PostList = () => {
  const MySwal = withReactContent(Swal);

  //sub stream
  const [data, setData] = useState([]);

  const { ExportCSVButton } = CSVExport;

  const columns = [
    {
      dataField: "news_feeds.id",
      text: "No",
    },
    {
      dataField: "news_feeds.name",
      text: "User",
    },
    {
      dataField: "news_feeds.feed_category",
      text: "Category",
    },
    {
      dataField: "news_feeds.title",
      text: "Title",
    },
    {
      text: "Description",
      formatter: (cellContent, row) => {
        return (
          <div id="summary">
            <p className="collapse" id={`collapseSummary${row.news_feeds.id}`}>
              {row.news_feeds.caption}
            </p>
            <a
              className="collapsed"
              data-toggle="collapse"
              href={`#collapseSummary${row.news_feeds.id}`}
              aria-expanded="false"
              aria-controls="collapseSummary"
            ></a>
          </div>
        );
      },
    },

    {
      dataField: "news_feeds.feed_type",
      text: "Feed",
    },
    {
      dataField: "news_feeds.total_reports",
      text: "Report",
    },
    {
      dataField: "news_feeds.date",
      text: "Date",
    },
    {
      text: "Action",
      formatter: (cellContent, row) => {
        return (
          <>
            <img
              src={img}
              alt=""
              className="ms-3"
              onClick={() => handleCategory(row.news_feeds.id)}
            />
          </>
        );
      },
    },
  ];
  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 10,
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
        const { data } = await axios.get(`https://hcceco.com/api/get_posts`, {
          mode: "cors",
        });
        setData(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  //delete
  const [products, setProducts] = useState(data);
  const handleCategory = async (id) => {
    const formData = { news_feeds_id: id };
    const response = await axios
      .post("https://hcceco.com/api/delete_posts", formData)
      .then((data) => {
        const remainItem = products.filter((item) => item.id !== id);
        setProducts(remainItem);
        MySwal.fire("Good job!", "successfully delete", "success");
      })
      .catch((error) => {
        MySwal.fire("Something Error Found.", "warning");
      });
  };
  return (
    <div className="row">
      <div className="col-md-12" id="withdraw">
        <div className="card">
          <div className="card-body card_body_sm">
            <>
              <ToolkitProvider
                bootstrap4
                keyField="news_feeds.id"
                columns={columns}
                data={data}
                pagination={pagination}
                exportCSV
              >
                {(props) => (
                  <React.Fragment>
                    <MyExportCSV {...props.csvProps} />
                    <BootstrapTable
                      bootstrap4
                      keyField="news_feeds.id"
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

      {/* /.content-wrapper */}

      {/* Control Sidebar */}
    </div>
  );
};

export default PostList;
