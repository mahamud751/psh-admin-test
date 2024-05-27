import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { useEffect } from "react";

const Property = ({ data }) => {
  console.log(data);

  const [user, setUser] = useState(data);
  const [files, setFiles] = useState("");
  const [categories, setCategories] = useState([]);
  const [branch, setBranch] = useState([]);
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.psh.com.bd/api/category");
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.psh.com.bd/api/branch");
        setBranch(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.psh.com.bd/api/facility");
        setFacilities(response.data);
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
    newInfo[field] = value;
    setUser(newInfo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const selectedFacilities = [];
    facilities.forEach((facility) => {
      if (formData.getAll("facility[]").includes(facility._id)) {
        selectedFacilities.push(facility.name);
      }
    });
    const data2 = {
      categoryId: formData.get("category"),
      branchId: formData.get("branch"),
      facility: selectedFacilities,
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
        `https://api.psh.com.bd/api/property/${user._id}`,
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
            <div className="card-body row">
              <div className="col-md-12 form_sub_stream ">
                <label htmlFor="inputState" className="profile_label3">
                  Type
                </label>
                <select
                  name="category"
                  id="inputState"
                  className="main_form w-100"
                >
                  <option disabled>Select Type</option>
                  {categories.map((pd) => (
                    <option key={pd._id} value={pd._id}>
                      {pd.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 form_sub_stream ">
                <label htmlFor="inputState" className="profile_label3">
                  Branch
                </label>
                <select
                  name="branch"
                  id="inputState"
                  className="main_form w-100"
                  required
                >
                  <option disabled>Select Type</option>
                  {branch.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 form_sub_stream">
                <label className="profile_label3">Facility</label>

                <div className="row mt-5">
                  {facilities.map((facility) => (
                    <div className="col-md-4" key={facility._id}>
                      <input
                        type="checkbox"
                        id={facility._id}
                        name="facility[]"
                        value={facility._id}
                        multiple
                      />
                      <label className="ms-2" htmlFor={facility._id}>
                        {facility.name}
                      </label>
                      <img
                        src={facility.photos[0]}
                        alt=""
                        className="facility_img"
                      />
                    </div>
                  ))}
                </div>
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
                  defaultValue={user.name || ""}
                />
              </div>
              <div className="col-md-6 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  City
                </label>
                <input
                  type="text"
                  className="main_form w-100"
                  name="city"
                  defaultValue={user.city || ""}
                />
              </div>
              <div className="col-md-6 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Short Description
                </label>
                <input
                  type="text"
                  className="main_form w-100"
                  name="desc"
                  defaultValue={user.desc || ""}
                />
              </div>
              <div className="col-md-6 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Full Description
                </label>
                <input
                  type="text"
                  className="main_form w-100"
                  name="fulldesc"
                  defaultValue={user.fulldesc || ""}
                />
              </div>
              <div className="col-md-4 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Bedroom
                </label>

                <input
                  type="number"
                  className="main_form w-100"
                  name="bedroom"
                  defaultValue={user.bedroom || ""}
                />
              </div>
              <div className="col-md-4 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Bathroom
                </label>

                <input
                  type="number"
                  className="main_form w-100"
                  name="bathroom"
                  defaultValue={user.bathroom || ""}
                />
              </div>
              <div className="col-md-4 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Car
                </label>

                <input
                  type="number"
                  className="main_form w-100"
                  name="car"
                  defaultValue={user.car || ""}
                />
              </div>
              <div className="col-md-4 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Bike
                </label>

                <input
                  type="number"
                  className="main_form w-100"
                  name="bike"
                  defaultValue={user.bike || ""}
                />
              </div>
              <div className="col-md-4 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Pet
                </label>

                <input
                  type="number"
                  className="main_form w-100"
                  name="pet"
                  defaultValue={user.pet || ""}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3"
                >
                  Per Day
                </label>
                <input
                  type="text"
                  className="main_form  w-100"
                  name="perDay"
                  onBlur={handleOnBlur}
                  defaultValue={user.perDay || ""}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3"
                >
                  Per Month
                </label>
                <input
                  type="text"
                  className="main_form  w-100"
                  name="perMonth"
                  onBlur={handleOnBlur}
                  defaultValue={user.perMonth || ""}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3"
                >
                  Per Year
                </label>
                <input
                  type="text"
                  className="main_form  w-100"
                  name="perYear"
                  onBlur={handleOnBlur}
                  defaultValue={user.perYear || ""}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3"
                >
                  Avaliblilty
                </label>
                <input
                  type="text"
                  className="main_form  w-100"
                  name="availble"
                  onBlur={handleOnBlur}
                  defaultValue={user.availble || ""}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3"
                >
                  Rating
                </label>
                <input
                  type="text"
                  className="main_form  w-100"
                  name="rating"
                  onBlur={handleOnBlur}
                  defaultValue={user.rating || ""}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3"
                >
                  Property Picture
                </label>
                <input
                  type="file"
                  id="file"
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
                  Edit Property
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Property;
