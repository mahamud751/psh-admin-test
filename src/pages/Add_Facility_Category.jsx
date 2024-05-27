import axios from "axios";
import React, { useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Add_Facility_Category = () => {
  const MySwal = withReactContent(Swal);
  const formRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data2 = {
      name: formData.get("name"),
    };
    try {
      const product = {
        ...data2,
      };

      await axios.post(
        "https://psh-server-test.onrender.com/api/facilityCategory",
        product
      );
      MySwal.fire("Good job!", "successfully added", "success");
      formRef.current.reset();
    } catch (err) {
      MySwal.fire("Something Error Found.", "warning");
    }
  };
  return (
    <div className="wrapper">
      <div className="content-wrapper" style={{ background: "unset" }}>
        <div className="customize registration_div card">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="row p-3">
              <div className="col-md-6 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Add Room Category
                </label>

                <input
                  type="text"
                  className="main_form w-100"
                  name="name"
                  placeholder="Add Room Category"
                />
              </div>
            </div>

            <div className="d-flex justify-content-center my-5">
              <button
                type="submit"
                className="profile_btn"
                style={{ width: 175 }}
              >
                Add Room Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add_Facility_Category;
