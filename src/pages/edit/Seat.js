import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import "./Main_steam.css";
import axios from "axios";

const Seat = ({ data }) => {
  const { _id, name, seatNumber, desc } = data;
  const [user, setUser] = useState(data);
  const [files, setFiles] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://psh-server-test.onrender.com/api/property"
        );
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  console.log(categories);
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
    const formData = new FormData(e.target);

    const data2 = {
      propertyId: formData.get("property"),
    };
    const newPost = {
      ...user,
      ...data2,
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
        ...newPost,
        photos: list,
      };

      await axios.put(
        `https://psh-server-test.onrender.com/api/seat/${_id}`,
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
              <div className="col-md-12 form_sub_stream ">
                <label htmlFor="inputState" className="profile_label3">
                  Room
                </label>
                <select
                  name="property"
                  id="inputState"
                  className="main_form w-100"
                >
                  <option>Select Room</option>
                  {categories.map((pd) => (
                    <option key={pd._id} value={pd._id}>
                      {pd.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-12 mb-3">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3"
                >
                  Seat Name
                </label>
                <input
                  type="text"
                  className="main_form  w-100"
                  name="name"
                  onBlur={handleOnBlur}
                  defaultValue={name || ""}
                />
              </div>
              <div className="col-md-12 mb-3">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3"
                >
                  Seat Number
                </label>
                <input
                  type="text"
                  className="main_form  w-100"
                  name="seatNumber"
                  onBlur={handleOnBlur}
                  defaultValue={seatNumber || ""}
                />
              </div>
              <div className="col-md-12 mb-3">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3"
                >
                  Seat Description
                </label>
                <input
                  type="text"
                  className="main_form  w-100"
                  name="desc"
                  onBlur={handleOnBlur}
                  defaultValue={desc || ""}
                />
              </div>
              <div className="col-md-12 mb-3">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3"
                >
                  Seat Picture
                </label>
                <input
                  type="file"
                  className="main_form w-100 p-0"
                  name="img"
                  onChange={(e) => setFiles(e.target.files)}
                  multiple
                />
              </div>

              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="profile_btn"
                  style={{ width: 220 }}
                >
                  Edit Seat
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Seat;
