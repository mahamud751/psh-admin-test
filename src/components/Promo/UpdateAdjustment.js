import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const UpdateAdjustment = ({ data, refetch }) => {
  const [adjustmentAmount, setAdjustmentAmount] = useState(
    data?.adjustmentAmount
  );
  const [receivedTk, setReciveTk] = useState(0);
  const [loading, setLoading] = useState(false);

  // Handle Adjustment Request

  const handleAdjustment = async (e) => {
    e.preventDefault();
    const adjustment = {
      adjustmentAmount: adjustmentAmount,
    };
    try {
      await axios.patch(
        `https://api.psh.com.bd/api/adjustment/${data._id}`,
        adjustment,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Success");
      refetch();
    } catch (error) {
      return toast.error(error.response.data.message);
    }
    e.target.reset();
  };
  return (
    <div className="container">
      <div
        className="modal fade"
        id={`discount${data?._id}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Adjustment
              </h1>{" "}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAdjustment}>
                <div>
                  <label htmlFor="" className="fs-5 fw-normal">
                    Adjustment Amount
                  </label>
                  <br />
                  <input
                    type="number"
                    placeholder="Discount
              "
                    id=""
                    className="px-2 rounded"
                    style={{ width: "300px", height: "40px" }}
                    name="discount"
                    defaultValue={data?.adjustmentAmount}
                    onChange={(e) => setAdjustmentAmount(e.target.value)}
                  />{" "}
                  <br />
                </div>
                <div className="mt-3">
                  <div className="text-right total-amount-right font-[600] ">
                    <div className="d-flex ">
                      <p className="fw-bold">Total :</p>

                      <p className="ms-5">{data?.booking?.totalAmount} Tk</p>
                    </div>
                    <div className="d-flex ">
                      <p className="fw-bold">Already Discount :</p>

                      <p className=" ms-5">
                        {data?.booking?.discount + Number(adjustmentAmount)} Tk
                      </p>
                    </div>
                    <div className="d-flex ">
                      <p className="fw-bold">Payable :</p>

                      <p className=" ms-5">
                        {data?.booking?.payableAmount -
                          Number(adjustmentAmount)}{" "}
                        Tk
                      </p>
                    </div>

                    <div className="paid-amount d-flex ">
                      <p className="fw-bold ">Recieve :</p>
                      <p className=" ms-5">
                        {" "}
                        {data?.booking?.totalReceiveTk + Number(receivedTk)} Tk
                      </p>
                    </div>

                    <div className="paid-amount d-flex ">
                      <p
                        className="fw-bold "
                        style={{
                          color: data?.booking?.dueAmount > 0 ? "red" : "",
                        }}
                      >
                        Due :
                      </p>

                      <p className=" text-[12px] ms-5">
                        {data?.booking?.dueAmount -
                          Number(adjustmentAmount) -
                          Number(receivedTk)}{" "}
                        Tk
                      </p>
                    </div>
                  </div>
                </div>
                <input
                  type="submit"
                  className="mt-2 px-4 py-1 rounded text-white"
                  id=""
                  value="Update"
                  style={{
                    fontSize: "18px",
                    backgroundColor:
                      data?.booking?.totalReceiveTk ===
                      data?.booking?.payableAmount
                        ? "rgb(170 221 220)"
                        : "#00BBB4",
                    border: "none",
                  }}
                  disabled={
                    loading
                      ? true
                      : false ||
                        data?.booking?.totalReceiveTk ===
                          data?.booking?.payableAmount
                      ? true
                      : false
                  }
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAdjustment;
