import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import axios from "axios";

const Branch = ({ data }) => {
  const { _id, name } = data;

  const [files, setFiles] = useState("");
  const MySwal = withReactContent(Swal);
  const formRef = useRef(null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data2 = {
      name: formData.get("name"),
      locationLink: formData.get("locationLink"),
      nearLocation1: formData.get("nearLocation1"),
      nearLocation2: formData.get("nearLocation2"),
      nearLocation3: formData.get("nearLocation3"),
      nearLocation4: formData.get("nearLocation4"),
      nearLocation5: formData.get("nearLocation5"),
      nearLocation6: formData.get("nearLocation6"),
      branchEmail: formData.get("branchEmail"),
      branchAddress: formData.get("branchAddress"),
      branchMobileNumber: formData.get("branchMobileNumber"),
      branchBkashNumber: formData.get("branchBkashNumber"),
      branchNagadNumber: formData.get("branchNagadNumber"),
      branchDutchNumber: formData.get("branchDutchNumber"),
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

      const branch = {
        ...data2,
        photos: list?.length > 0 ? list : data?.photos,
      };

      await axios.put(`https://api.psh.com.bd/api/branch/${_id}`, branch);
      MySwal.fire("Good job!", "successfully added", "success");
      formRef.current.reset();
    } catch (err) {
      MySwal.fire("Something Error Found.", "warning");
    }
  };

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="row p-3">
          <div className="col-md-6 form_sub_stream">
            <label htmlFor="inputState" className="form-label profile_label3 ">
              Branch Name
            </label>

            <input
              type="text"
              className="main_form w-100"
              name="name"
              placeholder="Branch Name"
              required
              defaultValue={data?.name}
            />
          </div>
          <div className="col-md-6 form_sub_stream">
            <label htmlFor="inputState" className="form-label profile_label3 ">
              Location (Google Location Link)
            </label>

            <input
              type="text"
              className="main_form w-100"
              name="locationLink"
              placeholder="Google Location Link"
              required
              defaultValue={data?.locationLink}
            />
          </div>

          <div className="col-md-6 form_sub_stream">
            <label htmlFor="inputState" className="form-label profile_label3 ">
              Phone Number
            </label>

            <input
              type="text"
              className="main_form w-100"
              name="branchMobileNumber"
              placeholder="Mobile Number"
              required
              defaultValue={data?.branchMobileNumber}
            />
          </div>
          <div className="col-md-6 form_sub_stream">
            <label htmlFor="inputState" className="form-label profile_label3 ">
              Branch Bkash Number
            </label>

            <input
              type="text"
              className="main_form w-100"
              name="branchBkashNumber"
              placeholder="Branch Bkash Number"
              required
              defaultValue={data?.branchBkashNumber}
            />
          </div>

          <div className="col-md-6 form_sub_stream">
            <label htmlFor="inputState" className="form-label profile_label3 ">
              Nagad Number
            </label>

            <input
              type="text"
              className="main_form w-100"
              name="branchNagadNumber"
              placeholder="Branch Nagad Number"
            />
          </div>
          <div className="col-md-6 form_sub_stream">
            <label htmlFor="inputState" className="form-label profile_label3 ">
              Dutch-Bangla Number
            </label>

            <input
              type="text"
              className="main_form w-100"
              name="branchDutchNumber"
              placeholder="Branch Dutch-bangla Number"
            />
          </div>
          <div className="col-md-6 form_sub_stream">
            <label htmlFor="inputState" className="form-label profile_label3 ">
              Email
            </label>

            <input
              type="text"
              className="main_form w-100"
              name="branchEmail"
              placeholder="Branch Email"
              required
              defaultValue={data?.branchEmail}
            />
          </div>
          {/* Arrount The Building */}
          <h5>Around The Building</h5>
          <div className="col-md-6 form_sub_stream">
            <label htmlFor="inputState" className="form-label profile_label3 ">
              No:1
            </label>

            <input
              type="text"
              className="main_form w-100"
              name="nearLocation1"
              placeholder="No:1"
              defaultValue={data?.nearLocation1}
            />
          </div>
          <div className="col-md-6 form_sub_stream">
            <label htmlFor="inputState" className="form-label profile_label3 ">
              No:2
            </label>

            <input
              type="text"
              className="main_form w-100"
              name="nearLocation2"
              placeholder="No:2"
              defaultValue={data?.nearLocation2}
            />
          </div>
          <div className="col-md-6 form_sub_stream">
            <label htmlFor="inputState" className="form-label profile_label3 ">
              No:3
            </label>

            <input
              type="text"
              className="main_form w-100"
              name="nearLocation3"
              placeholder="No:3"
              defaultValue={data?.nearLocation3}
            />
          </div>
          <div className="col-md-6 form_sub_stream">
            <label htmlFor="inputState" className="form-label profile_label3 ">
              No:4
            </label>

            <input
              type="text"
              className="main_form w-100"
              name="nearLocation4"
              placeholder="No:4"
              defaultValue={data?.nearLocation4}
            />
          </div>
          <div className="col-md-6 form_sub_stream">
            <label htmlFor="inputState" className="form-label profile_label3 ">
              No:5
            </label>

            <input
              type="text"
              className="main_form w-100"
              name="nearLocation5"
              placeholder="No:5"
              defaultValue={data?.nearLocation5}
            />
          </div>
          <div className="col-md-6 form_sub_stream">
            <label htmlFor="inputState" className="form-label profile_label3 ">
              No:6
            </label>

            <input
              type="text"
              className="main_form w-100"
              name="nearLocation6"
              placeholder="No:6"
              defaultValue={data?.nearLocation5}
            />
          </div>
          <div className="col-md-6 form_sub_stream">
            <label htmlFor="inputState" className="form-label profile_label3 ">
              Address
            </label>

            <textarea
              cols="50"
              rows="3"
              className="px-2 rounded"
              style={{ width: "640px" }}
              name="branchAddress"
              placeholder="Deatails Address"
              required
              defaultValue={data?.branchAddress}
            />
          </div>
          <div className="col-md-12 form_sub_stream">
            <label htmlFor="inputState" className="form-label profile_label3 ">
              Image upload
            </label>

            <input
              type="file"
              className="main_form w-100 p-0"
              name="img"
              onChange={(e) => setFiles(e.target.files)}
              multiple
              // required
            />
          </div>
        </div>

        <div className="d-flex justify-content-center my-5">
          <button type="submit" className="profile_btn" style={{ width: 175 }}>
            Update Branch
          </button>
        </div>
      </form>
    </div>
  );
};

export default Branch;
