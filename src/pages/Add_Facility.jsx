import axios from "axios";
import React, { useState, useRef } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Add_Facility = () => {
  const [files, setFiles] = useState("");
  const MySwal = withReactContent(Swal);
  const formRef = useRef(null);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://psh-server-test.onrender.com/api/facilityCategory"
        );
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data2 = {
      name: formData.get("name"),
      facilityCategoryId: formData.get("facilityCategory"),
    };
    try {
      const list = await Promise.all(
        Object.values(files).map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "upload");
          const uploadRes = await axios.post(
            "https://api.cloudinary.com/v1_1/dtpvtjiry/image/upload",
            data
          );

          const { secure_url } = uploadRes.data;
          return secure_url;
        })
      );

      const product = {
        ...data2,
        photos: list,
      };

      await axios.post(
        "https://psh-server-test.onrender.com/api/facility",
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
              <div className="col-md-6 form_sub_stream ">
                <label htmlFor="inputState" className="profile_label3">
                  Facility Type
                </label>
                <select
                  name="facilityCategory"
                  id="inputState"
                  className="main_form w-100"
                >
                  <option>Select Type</option>
                  {categories.map((pd) => (
                    <option key={pd._id} value={pd._id}>
                      {pd.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Name
                </label>
                <input
                  type="text"
                  className="main_form w-100"
                  name="name"
                  placeholder="Product Name"
                />
              </div>
              {/* {seatOptions.map((option, index) => (
                <>
                  <div className="col-md-4 form_sub_stream" key={index}>
                    <label className="profile_label3">Name</label>
                    <input
                      type="text"
                      className="main_form w-100"
                      value={option.name}
                      onChange={(e) => {
                        const updatedOptions = [...seatOptions];
                        updatedOptions[index].name = e.target.value;
                        setSeatOptions(updatedOptions);
                      }}
                    />
                  </div>

                  <div className="col-md-4 form_sub_stream">
                    <label
                      htmlFor="inputState"
                      className="form-label profile_label3 "
                    >
                      Seat Photos
                    </label>
                    <input
                      type="file"
                      id="seatPhotos"
                      className="main_form w-100 p-0"
                      name="seatPhotos"
                      onChange={(e) => setSeatPhotos(e.target.files)}
                      multiple
                    />
                  </div>

                  <div
                    className="col-md-4 form_sub_stream"
                    style={{ marginTop: 50 }}
                  >
                    <i
                      className="fa-solid fa-plus"
                      onClick={handleAddSeatOption}
                    ></i>
                    <i
                      className="fa-solid fa-trash ms-4"
                      onClick={() => handleRemoveSeatOption(index)}
                    ></i>
                  </div>
                </>
              ))} */}
              {/* <div className="col-md-6 form_sub_stream ">
                <label htmlFor="inputState" className="profile_label3">
                  Type
                </label>
                <select name="type" id="inputState" className="main_form w-100">
                  <option value="common">Common</option>
                  <option value="room">Room</option>
                  <option value="common">Top </option>
                  <option value="room">Room</option>
                </select>
              </div> */}
              <div className="col-md-12 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Image upload
                </label>

                <input
                  type="file"
                  className="main_form w-100 p-0"
                  name="img"
                  onChange={(e) => setFiles(e.target.files)}
                  multiple
                />
              </div>
            </div>

            <div className="d-flex justify-content-center my-5">
              <button
                type="submit"
                className="profile_btn"
                style={{ width: 175 }}
              >
                Add Facility
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add_Facility;
