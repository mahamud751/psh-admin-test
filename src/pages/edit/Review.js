import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import "./Main_steam.css";
import axios from "axios";

const Review = ({ data }) => {
  const { _id, comment } = data;
  const [user, setUser] = useState(data);

  const MySwal = withReactContent(Swal);

  const handleOnBlur = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const newInfo = { ...user };
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

      await axios.put(
        `https://psh-server-test.onrender.com/api/review/${_id}`,
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
                  Status
                </label>
                <select
                  name="status"
                  id="inputState"
                  className="main_form w-100"
                  onBlur={handleOnBlur}
                  defaultValue={user.status}
                >
                  <option value="active">Active</option>
                  <option value="inActive">InActive</option>
                </select>
              </div>

              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="profile_btn"
                  style={{ width: 220 }}
                >
                  Edit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Review;
