import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Invoice = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `https://psh-server-test.onrender.com/api/order/${id}`,
          {
            mode: "cors",
          }
        );
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getData(data);
  }, []);

  const item = data.getState;
  return (
    <div className="wrapper">
      <div className="content-wrapper" style={{ background: "unset" }}>
        <section className="content">
          <div className="container-fluid">
            {/* Content Header (Page header) */}
            <section className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1>Invoice</h1>
                  </div>
                </div>
              </div>
              {/* /.container-fluid */}
            </section>
            <section className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    {/* Main content */}
                    <div className="invoice p-3 mb-3">
                      <div className="row invoice-info">
                        {/* /.col */}
                        <div className="col-sm-8 invoice-col">
                          <address>
                            <strong>{`${data.firstName} ${data.lastName}`}</strong>
                            <br />
                            795 Folsom Ave, Suite 600
                            <br />
                            San Francisco, CA 94107
                            <br />
                            Phone: {data.phone}
                            <br />
                            Email: {data.email}
                          </address>
                        </div>
                        {/* /.col */}
                        <div className="col-sm-4 invoice-col">
                          <b>Invoice #{data._id}</b>
                          <br />
                          <br />
                          <br />
                          <b>Payment Due:</b> 2/22/2014
                        </div>
                        {/* /.col */}
                      </div>
                      {/* /.row */}
                      {/* Table row */}
                      <div className="row">
                        <div className="col-12 table-responsive">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Qty</th>
                                <th>Name</th>

                                <th>Description</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item
                                ? item.map((arr1) =>
                                    arr1.map((obj, i) => (
                                      <>
                                        <tr>
                                          <td>{i + 1}</td>
                                          <td>{obj.name}</td>
                                          <td>{obj.desc}</td>
                                          <td>$64.50</td>
                                        </tr>
                                      </>
                                    ))
                                  )
                                : ""}
                            </tbody>
                          </table>
                        </div>
                        {/* /.col */}
                      </div>
                      {/* /.row */}
                      <div className="row">
                        {/* accepted payments column */}
                        <div className="col-6"></div>
                        {/* /.col */}
                        <div className="col-6">
                          <div className="table-responsive">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <th style={{ width: "50%" }}>Tax:</th>
                                  <td>$20.00</td>
                                </tr>

                                <tr>
                                  <th>Total:</th>
                                  <td>$265.24</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        {/* /.col */}
                      </div>
                      {/* /.row */}
                      {/* this row will not appear when printing */}
                      <div className="row no-print">
                        <div className="col-12">
                          <button
                            type="button"
                            className="btn btn-primary float-right"
                            style={{ marginRight: 5 }}
                          >
                            <i className="fas fa-download" /> Generate PDF
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* /.invoice */}
                  </div>
                  {/* /.col */}
                </div>
                {/* /.row */}
              </div>
              {/* /.container-fluid */}
            </section>
            {/* /.content */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Invoice;
