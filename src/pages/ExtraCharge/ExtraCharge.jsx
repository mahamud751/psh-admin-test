import React from "react";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { BiSolidEdit } from "react-icons/bi";
import ExtraChargeEditModal from "./ExtraChargeEditModal";
import useExtraCharge from "../../hooks/useExtraCharge";

import { Toaster } from "react-hot-toast";
const ExtraCharge = () => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const [extraCharge, refetch] = useExtraCharge();

  return (
    <div className="wrapper">
      <div className="content-wrapper">
        <section className="content customize_list">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-7">
                <h3 className=" mb-3">Extra Charge</h3>
              </div>
            </div>
          </div>
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>Vat</th>
                <th>Admission Fee for 2 Months & Upto</th>
                <th>Security Fee for 2 Months & Upto</th>
                <th>Admission Fee for 6 Months & Upto</th>
                <th>Security Fee for 6 Months & Upto</th>
                <th>Admission Fee for 1 Year</th>
                <th>Security Fee for 1 Year</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {extraCharge.map((charge) => (
                <>
                  <tr>
                    <td>{charge?.vatTax}%</td>
                    <td> Tk {charge?.admissionFee}</td>
                    <td> TK {charge?.securityFee}</td>
                    <td> Tk {charge?.upto6MonthsAdmissionFee}</td>
                    <td> TK {charge?.upto6MonthsSecurityFee}</td>
                    <td> Tk {charge?.for1YearAdmissionFee}</td>
                    <td> TK {charge?.for1YearSecurityFee}</td>
                    <td>
                      {" "}
                      <span onClick={handleShow}>
                        <BiSolidEdit
                          style={{
                            width: "30px",
                            height: "30px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </td>
                  </tr>
                  <ExtraChargeEditModal
                    show={show}
                    setShow={setShow}
                    charge={charge}
                    refetch={refetch}
                  />
                </>
              ))}
            </tbody>
          </Table>
        </section>
      </div>
      <Toaster
        containerStyle={{ top: 100 }}
        toastOptions={{ position: "top-center" }}
      ></Toaster>
    </div>
  );
};

export default ExtraCharge;
