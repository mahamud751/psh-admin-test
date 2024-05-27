import axios from "axios";
import React from "react";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";

const ExtraChargeEditModal = ({ setShow, show, charge, refetch }) => {
  const handleClose = () => setShow(false);

  const handleExtraCharge = async (e) => {
    e.preventDefault();

    const updateExtraCharge = {
      vatTax: e.target.vatTax.value,
      admissionFee: e.target.admissionFee.value,
      securityFee: e.target.securityFee.value,
      upto6MonthsAdmissionFee: e.target.upto6MonthsAdmissionFee.value,
      upto6MonthsSecurityFee: e.target.upto6MonthsSecurityFee.value,
      for1YearAdmissionFee: e.target.for1YearAdmissionFee.value,
      for1YearSecurityFee: e.target.for1YearSecurityFee.value,
    };

    try {
      const response = await axios.put(
        `https://psh-server-test.onrender.com/api/extraCharge/${charge._id}`,
        updateExtraCharge,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);
      refetch();
    } catch (error) {
      return toast.error(error.response?.data?.message);
    }
  };
  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Extra Charge</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleExtraCharge}>
            <div className=" ">
              <label htmlFor="">Vat & Tax :</label>
              <br />

              <input
                type="text"
                name="vatTax"
                placeholder="How much percent VAT & Tax would you like to charge?"
                style={{ width: "65%", height: "30px" }}
                defaultValue={charge?.vatTax}
              />
            </div>

            <div className=" mt-2">
              <label htmlFor="">Admission Fee for 2 months & Upto:</label>
              <br />

              <input
                type="number"
                placeholder="Admission Fee"
                name="admissionFee"
                className=""
                style={{ width: "65%", height: "30px" }}
                defaultValue={charge?.admissionFee}
              />
            </div>
            <div className=" mt-2">
              <label htmlFor="">Security Fee for 2 months & Upto:</label>
              <br />

              <input
                type="number"
                placeholder="Security Fee"
                name="securityFee"
                className=""
                style={{ width: "65%", height: "30px" }}
                defaultValue={charge?.securityFee}
              />
            </div>
            <div className=" mt-2">
              <label htmlFor="">Admission Fee for 6 months & Upto:</label>
              <br />

              <input
                type="number"
                placeholder="Admission Fee"
                name="upto6MonthsAdmissionFee"
                className=""
                style={{ width: "65%", height: "30px" }}
                defaultValue={charge?.upto6MonthsAdmissionFee}
              />
            </div>
            <div className=" mt-2">
              <label htmlFor="">Security Fee for 6 months & Upto:</label>
              <br />

              <input
                type="number"
                placeholder="Security Fee"
                name="upto6MonthsSecurityFee"
                className=" "
                style={{ width: "65%", height: "30px" }}
                defaultValue={charge?.upto6MonthsSecurityFee}
              />
            </div>
            <div className=" mt-2">
              <label htmlFor="">Admission Fee for 1 Year:</label>
              <br />

              <input
                type="number"
                placeholder="Admission Fee"
                name="for1YearAdmissionFee"
                className=""
                style={{ width: "65%", height: "30px" }}
                defaultValue={charge?.for1YearAdmissionFee}
              />
            </div>
            <div className=" mt-2">
              <label htmlFor="">Security Fee for 1 Year:</label>
              <br />

              <input
                type="number"
                placeholder="Security Fee"
                name="for1YearSecurityFee"
                className=" "
                style={{ width: "65%", height: "30px" }}
                defaultValue={charge?.for1YearSecurityFee}
              />
            </div>
            <input
              type="submit"
              value="Update"
              style={{
                marginLeft: "328px",
                backgroundColor: "#27B3B1",
                border: "none",
              }}
              className="mt-2 text-white px-4 py-2"
            />
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ExtraChargeEditModal;
