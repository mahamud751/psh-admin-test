import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import axios from "axios";

const Managers = ({ data }) => {
  const { _id, name, role } = data;
  const [user, setUser] = useState(data);
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

    const newPost = {
      ...user,
    };
    try {
      const product = {
        ...newPost,
      };

      await axios.patch(
        `https://api.psh.com.bd/api/users/admin/${_id}`,
        product
      );
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
              <div className="col-md-12 mb-3">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3"
                >
                  Name
                </label>
                <input
                  type="text"
                  className="main_form  w-100"
                  name="firstName"
                  onBlur={handleOnBlur}
                  defaultValue={user.firstName || ""}
                />
              </div>
              <div className="col-md-6 form_sub_stream ">
                <label htmlFor="inputState" className="profile_label3">
                  Branch
                </label>
                <select
                  name="branch"
                  id="inputState"
                  className="main_form w-100"
                  onBlur={handleOnBlur}
                  defaultValue={user.branch || ""}
                >
                  <option disabled>Select Branch</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-12 mb-3">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3"
                >
                  Role
                </label>
                <select
                  name="role"
                  id="inputState"
                  className="main_form w-100"
                  onBlur={handleOnBlur}
                  defaultValue={user.role}
                >
                  <option value="manager">Manager</option>
                  <option value="partner">Partner</option>
                </select>
              </div>
              <div className="col-md-12 mb-3">
                <label htmlFor="inputState" className="">
                  Status ({data?.userStatus})
                </label>
                <br />
                <select
                  name="userStatus"
                  id="inputState"
                  className="main_form"
                  style={{ width: "450px" }}
                  onBlur={handleOnBlur}
                  defaultValue={user.userStatus}
                >
                  <option value="Active">Active</option>
                  <option value="Deactive">Deactive</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="profile_btn"
                  style={{ width: 220 }}
                >
                  Update Role
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Managers;
