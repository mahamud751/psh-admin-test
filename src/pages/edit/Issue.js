import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import axios from "axios";

const Issue = ({ data }) => {
  const { _id, name, seatNumber, desc } = data;
  const [user, setUser] = useState(data);
  const [files, setFiles] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.psh.com.bd/api/branch");
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const MySwal = withReactContent(Swal);

  const handleOnBlur = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const newInfo = { ...user };
    if (field === "status") {
      newInfo[field] = value;
    }
    newInfo[field] = value;
    setUser(newInfo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // const data2 = {
    //   branchId: formData.get("branch"),
    // };
    const newPost = {
      ...user,
      // ...data2,
    };
    try {
      const product = {
        ...newPost,
      };

      await axios.put(`https://api.psh.com.bd/api/issue/${_id}`, product);
      MySwal.fire("Good job!", "successfully edited", "success");
    } catch (err) {
      MySwal.fire("Something Error Found.", "warning");
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div>
            <div className="card-body">
              {/* <div className="col-md-12 form_sub_stream ">
                <label htmlFor="inputState" className="profile_label3">
                  Branch
                </label>
                <select
                  name="branch"
                  id="inputState"
                  className="main_form w-100"
                >
                  <option>Select Branch</option>
                  {categories.map((pd) => (
                    <option key={pd._id} value={pd._id}>
                      {pd.name}
                    </option>
                  ))}
                </select>
              </div> */}
              {/* <div className="col-md-12 mb-3">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3"
                >
                  Issue Name
                </label>
                <input
                  type="text"
                  className="main_form  w-100"
                  name="name"
                  onBlur={handleOnBlur}
                  defaultValue={name || ""}
                />
              </div> */}

              {/* <div className="col-md-12 mb-3">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3"
                >
                  Issue Description
                </label>
                <input
                  type="text"
                  className="main_form  w-100"
                  name="desc"
                  onBlur={handleOnBlur}
                  defaultValue={desc || ""}
                />
              </div> */}
              <div className="col-md-12 mb-3">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3"
                >
                  Status
                </label>
                <select
                  name="status"
                  id="inputState"
                  className="main_form w-100"
                  onBlur={handleOnBlur}
                  defaultValue={user.status}
                >
                  <option value="pending">Pending</option>
                  <option value="process">Process</option>
                  <option value="success">Success</option>
                </select>
              </div>

              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="profile_btn"
                  style={{ width: 220 }}
                >
                  Edit Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Issue;
