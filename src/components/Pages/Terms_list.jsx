import React, { useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useQuery } from "react-query";

const Terms_list = () => {
  const [data, setData] = useState();

  const { isLoading, refetch } = useQuery([], () =>
    fetch(`https://api.psh.com.bd/api/terms`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = [
      { title: "No", dataKey: "no" },
      { title: "Category", dataKey: "category" },
    ];
    const tableData = data.map((item, index) => ({
      no: index + 1,
      category: item.name,
    }));
    doc.autoTable(columns, tableData, { startY: 20 });

    // Save the PDF file
    doc.save("Terms_list.pdf");
  };
  return (
    <>
      {data?.map((item, i) => (
        <>
          <div className="export_btn_main">
            <div>
              <div className="corporate_addNew_btn">
                <Link to={`/update_terms/${item._id}`}>
                  <button className="college_btn2 ms-4 p-3">
                    Update Terms & Conditions{" "}
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="card mt-3">
            <div className="card-body card_body_sm">
              <div className="col-md-12 form_sub_stream privacy-policy-container">
                <div dangerouslySetInnerHTML={{ __html: item?.desc }} key={i} />
              </div>
            </div>
          </div>
        </>
      ))}
    </>
  );
};

export default Terms_list;
