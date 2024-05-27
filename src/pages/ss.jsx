import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AuthContext } from "../contexts/UserProvider";
import { useContext } from "react";
const Add_property = () => {
  const { user } = useContext(AuthContext);

  const [files, setFiles] = useState("");
  const MySwal = withReactContent(Swal);
  const [categories, setCategories] = useState([]);
  const [branch, setBranch] = useState([]);
  const [seatPhotos, setSeatPhotos] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [commonFacilities, setCommonaFacilities] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [seatOptions, setSeatOptions] = useState([
    {
      name: "",
      description: "",
      seatNumber: "",
      perDay: "",
      perMonth: "",
      perYear: "",
      photos: [],
    },
  ]);

  const formRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://psh-server-test.onrender.com/api/category"
        );
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  // const getFacilityImageURL = (facilityId) => {

  //   const facility = facilities.find((facility) => facility._id === facilityId);
  //   return facility?.photos?.[0] || "";
  // };

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    const selectedCategory = categories.find(
      (category) => category._id === selectedCategoryId
    );
    setCategoryName(selectedCategory?.name || "");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://psh-server-test.onrender.com/api/branch"
        );
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
        const response = await axios.get(
          "https://psh-server-test.onrender.com/api/facilityCategory"
        );
        setFacilities(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://psh-server-test.onrender.com/api/commonfacility"
        );
        setCommonaFacilities(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  const handleAddSeatOption = () => {
    setSeatOptions([
      ...seatOptions,
      {
        name: "",
        description: "",
        seatNumber: "",
        perDay: "",
        perMonth: "",
        perYear: "",
        photos: [],
      },
    ]);
  };
  const handleSeatPhotosChange = (e, index) => {
    const updatedOptions = [...seatOptions];
    updatedOptions[index].photos = e.target.files;
    setSeatOptions(updatedOptions);
  };

  const handleRemoveSeatOption = (index) => {
    if (seatOptions.length === 1) {
      MySwal.fire("You must need to select one seat.", "warning");
      return;
    }
    const updatedOptions = seatOptions.filter((_, idx) => idx !== index);
    setSeatOptions(updatedOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    // const selectedFacilities = [];

    // facilities.forEach((pd) => {
    //   pd.facility.forEach((facility) => {
    //     if (formData.getAll("facility[]").includes(facility._id)) {
    //       selectedFacilities.push({
    //         name: facility.name,
    //         photos: facility.photos, // Assuming you have the URLs of the photos in an array here
    //       });
    //     }
    //   });
    // });
    const selectedFacilities = formData.getAll("facility[]");
    const selectedCommonFacilities = formData.getAll("commonfacility[]");
    const selectedSeatOptions = seatOptions.filter(
      (option) =>
        option.name &&
        option.description &&
        option.seatNumber &&
        option.perDay &&
        option.perMonth &&
        option.photos &&
        option.perYear
    );

    const data2 = {
      name: formData.get("name"),
      type: formData.get("type"),
      city: formData.get("city"),
      floor: formData.get("floor"),
      roomNumber: formData.get("roomNumber"),
      builtYear: formData.get("builtYear"),
      area: formData.get("area"),
      totalRoom: formData.get("totalRoom"),
      totalPerson: formData.get("totalPerson"),
      available: formData.get("available"), // Corrected typo
      rating: formData.get("rating"),
      perDay: formData.get("perDay"),
      desc: formData.get("desc"),
      fulldesc: formData.get("fulldesc"),
      bedroom: formData.get("bedroom"),
      bathroom: formData.get("bathroom"),
      car: formData.get("car"),
      bike: formData.get("bike"),
      pet: formData.get("pet"),
      perMonth: formData.get("perMonth"),
      perYear: formData.get("perYear"),
      categoryId: formData.get("category"),
      branchId: formData.get("branch"),
      recommended: formData.get("recommended"),
      // bedType: formData.get("bedType"),
      furnitured: formData.get("furnitured"),
      CCTV: formData.get("CCTV"),
      WiFi: formData.get("WiFi"),
      balcony: formData.get("balcony"),
      meal: formData.get("meal"),
      occupanct: formData.get("occupanct"),
      facility: selectedFacilities,
      commonfacility: selectedCommonFacilities,
      seats: selectedSeatOptions,
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
      const seatPhotoList = await Promise.all(
        seatOptions.map(async (option) => {
          const photos = option.photos;
          const photoUrls = await Promise.all(
            Object.values(photos).map(async (file) => {
              const data = new FormData();
              data.append("file", file);
              data.append("upload_preset", "upload");
              const uploadRes = await axios.post(
                "https://api.cloudinary.com/v1_1/dtpvtjiry/image/upload",
                data
              );

              const { url } = uploadRes.data;
              return url;
            })
          );
          return photoUrls;
        })
      );

      const product = {
        ...data2,
        photos: list,
        seats: seatOptions.map((option, index) => ({
          ...option,
          photos: seatPhotoList[index],
        })),
      };

      await axios.post(
        "https://psh-server-test.onrender.com/api/property",
        product
      );
      MySwal.fire("Good job!", "successfully added", "success");
      formRef.current.reset();
    } catch (err) {
      console.log(err);
      MySwal.fire("Something Error Found.", "warning");
    }
  };
  return (
    <div className="wrapper">
      <div className="content-wrapper" style={{ background: "unset" }}>
        <div className="customize registration_div card p-3 ms-4">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 form_sub_stream ">
                <label htmlFor="inputState" className="profile_label3">
                  Property Type
                </label>
                <select
                  name="category"
                  id="inputState"
                  className="main_form w-100"
                  onChange={handleCategoryChange}
                >
                  <option>Select Type</option>
                  {categories.map((pd) => (
                    <option key={pd._id} value={pd._id}>
                      {pd.name}
                    </option>
                  ))}
                </select>
              </div>
              {user && user.role === "admin" ? (
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
                    <option value="">Select Type</option>
                    {branch.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
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
                    <option value={user?.branch?._id}>
                      {user?.branch?.name}
                    </option>
                  </select>
                </div>
              )}
              <div className="col-md-3 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Floor Number
                </label>
                <input
                  type="text"
                  className="main_form w-100"
                  name="floor"
                  placeholder="Name"
                />
              </div>
              {categoryName !== "Private Room" &&
                categoryName !== "Shared Room" && (
                  <div className="col-md-3 form_sub_stream">
                    <label
                      htmlFor="inputState"
                      className="form-label profile_label3 "
                    >
                      Total Room
                    </label>
                    <input
                      type="text"
                      className="main_form w-100"
                      name="totalRoom"
                      placeholder="  Total Room"
                    />
                  </div>
                )}

              <div className="col-md-3 form_sub_stream mb-5">
                <label htmlFor="inputState" className="profile_label3">
                  Gender Type
                </label>
                <select name="type" className="main_form w-100">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="row">
                <h2 className="profile_label3">Regular</h2>

                <div>
                  {commonFacilities.map((facility) => (
                    <>
                      <input
                        type="checkbox"
                        id={facility._id}
                        name="commonfacility[]"
                        value={facility._id}
                        multiple
                        key={facility._id}
                        className="me-1"
                      />
                      <label className="ms-2 mt-1" htmlFor={facility._id}>
                        {facility.name ? facility.name : ""}
                      </label>
                      <img
                        src={facility.photos ? facility.photos[0] : ""}
                        alt=""
                        style={{ width: 20 }}
                        className="mx-3"
                      />
                    </>
                  ))}
                </div>
              </div>

              {categoryName === "Private Room" ||
              categoryName === "Shared Room" ? (
                <>
                  <div className="row">
                    {facilities.map((facility) => (
                      <>
                        {facility.name === "Common" ? ( // Add this condition to check the facility name
                          <>
                            <h2 className="profile_label3">{facility.name}</h2>

                            <div>
                              {facility.facility.map((pd) => (
                                <>
                                  <input
                                    type="checkbox"
                                    id={pd._id}
                                    name="facility[]"
                                    value={pd._id}
                                    multiple
                                    key={pd._id}
                                    className="me-1"
                                  />

                                  <label className="ms-2 mt-1" htmlFor={pd._id}>
                                    {pd.name ? pd.name : ""}
                                  </label>
                                  <img
                                    src={pd.photos ? pd.photos[0] : ""}
                                    alt=""
                                    style={{ width: 20 }}
                                    className="mx-3"
                                  />
                                </>
                              ))}
                            </div>
                          </>
                        ) : null}
                      </>
                    ))}
                  </div>
                </>
              ) : (
                ""
              )}
              <div className="row mt-2">
                {facilities.map((facility) => (
                  <>
                    {facility.name !== "Common" ? ( // Add this condition to check the facility name
                      <>
                        <h2 className="profile_label3">{facility.name}</h2>

                        <div>
                          {facility.facility.map((pd) => (
                            <>
                              <input
                                type="checkbox"
                                id={pd._id}
                                name="facility[]"
                                value={pd._id}
                                multiple
                                key={pd._id}
                                className="me-1"
                              />

                              <label className="ms-2 mt-1" htmlFor={pd._id}>
                                {pd.name ? pd.name : ""}
                              </label>
                              <img
                                src={pd.photos ? pd.photos[0] : ""}
                                alt=""
                                style={{ width: 20 }}
                                className="mx-3"
                              />
                            </>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </>
                ))}
              </div>

              {(categoryName === "Private Room" ||
                categoryName === "Shared Room") && (
                <>
                  <div className="col-md-12 form_sub_stream mb-5">
                    <label htmlFor="inputState" className="profile_label3">
                      Room Number
                    </label>
                    <input
                      type="text"
                      className="main_form w-100"
                      name="roomNumber"
                      placeholder="Room Number"
                    />
                  </div>
                </>
              )}

              {categoryName === "Shared Room" && (
                <>
                  <div className="row card_div">
                    <p className="profile_label3 p-3">Seat Options</p>

                    {seatOptions.map((option, index) => (
                      <>
                        <div className="col-md-2 form_sub_stream" key={index}>
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
                        <div className="col-md-2 form_sub_stream">
                          <label className="profile_label3">Description</label>
                          <input
                            type="text"
                            className="main_form w-100"
                            value={option.description}
                            onChange={(e) => {
                              const updatedOptions = [...seatOptions];
                              updatedOptions[index].description =
                                e.target.value;
                              setSeatOptions(updatedOptions);
                            }}
                          />
                        </div>

                        <div className="col-md-2 form_sub_stream">
                          <label className="profile_label3">Seat Number</label>
                          <input
                            type="text"
                            className="main_form w-100"
                            value={option.seatNumber}
                            onChange={(e) => {
                              const updatedOptions = [...seatOptions];
                              updatedOptions[index].seatNumber = e.target.value;
                              setSeatOptions(updatedOptions);
                            }}
                          />
                        </div>
                        <div className="col-md-2 form_sub_stream">
                          <label className="profile_label3">Per Day</label>
                          <input
                            type="text"
                            className="main_form w-100"
                            value={option.perDay}
                            onChange={(e) => {
                              const updatedOptions = [...seatOptions];
                              updatedOptions[index].perDay = e.target.value;
                              setSeatOptions(updatedOptions);
                            }}
                          />
                        </div>
                        <div className="col-md-2 form_sub_stream">
                          <label className="profile_label3">Per Month</label>
                          <input
                            type="text"
                            className="main_form w-100"
                            value={option.perMonth}
                            onChange={(e) => {
                              const updatedOptions = [...seatOptions];
                              updatedOptions[index].perMonth = e.target.value;
                              setSeatOptions(updatedOptions);
                            }}
                          />
                        </div>
                        <div className="col-md-2 form_sub_stream">
                          <label className="profile_label3">Per Year</label>
                          <input
                            type="text"
                            className="main_form w-100"
                            value={option.perYear}
                            onChange={(e) => {
                              const updatedOptions = [...seatOptions];
                              updatedOptions[index].perYear = e.target.value;
                              setSeatOptions(updatedOptions);
                            }}
                          />
                        </div>

                        <div className="col-md-2 form_sub_stream" key={index}>
                          <label
                            htmlFor={`seatPhotos-${index}`}
                            className="form-label profile_label3"
                          >
                            Seat Photos
                          </label>
                          <input
                            type="file"
                            id={`seatPhotos-${index}`}
                            className="main_form w-100 p-0"
                            name={`seatPhotos-${index}`}
                            onChange={(e) => handleSeatPhotosChange(e, index)}
                            multiple
                          />
                        </div>

                        <div
                          className="col-md-2 form_sub_stream"
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
                    ))}
                  </div>
                </>
              )}

              <div className="col-md-6 form_sub_stream mt-3">
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
                  placeholder="Name"
                />
              </div>

              <div className="col-md-6 form_sub_stream mt-3">
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
                  placeholder="city"
                />
              </div>

              <div className="col-md-6 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Room Area
                </label>
                <input
                  type="text"
                  className="main_form w-100"
                  name="area"
                  placeholder="Area"
                />
              </div>
              {categoryName === "Apartment" && (
                <div className="col-md-6 form_sub_stream">
                  <label
                    htmlFor="inputState"
                    className="form-label profile_label3 "
                  >
                    Build Year
                  </label>
                  <input
                    type="text"
                    className="main_form w-100"
                    name="builtYear"
                    placeholder=" Build Year"
                  />
                </div>
              )}

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
                  placeholder="Short Description"
                />
              </div>
              {/* <div className="col-md-6 form_sub_stream">
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
                  placeholder="Full Description"
                />
              </div> */}
              {/* <div className="col-md-6 form_sub_stream mt-5">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Bed Type
                </label>
                <input
                  type="text"
                  className="main_form w-100"
                  name="bedType"
                  placeholder="Full Description"
                />
              </div> */}
              <div className="col-md-6 form_sub_stream mt-5">
                <label htmlFor="inputState" className="profile_label3">
                  Recommended
                </label>
                <select
                  name="recommended"
                  id="inputState"
                  className="main_form w-100"
                  required
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="col-md-6 form_sub_stream">
                <label htmlFor="inputState" className="profile_label3">
                  Furnitured
                </label>
                <select
                  name="furnitured"
                  id="furnitured"
                  className="main_form w-100"
                  required
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="col-md-6 form_sub_stream">
                <label htmlFor="inputState" className="profile_label3">
                  CCTV
                </label>
                <select
                  name="CCTV"
                  id="inputState"
                  className="main_form w-100"
                  required
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="col-md-6 form_sub_stream">
                <label htmlFor="inputState" className="profile_label3">
                  WiFi
                </label>
                <select
                  name="WiFi"
                  id="furnitured"
                  className="main_form w-100"
                  required
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="col-md-6 form_sub_stream">
                <label htmlFor="inputState" className="profile_label3">
                  balcony
                </label>
                <select
                  name="balcony"
                  id="furnitured"
                  className="main_form w-100"
                  required
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="col-md-6 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Available
                </label>

                <input
                  type="text"
                  className="main_form w-100"
                  name="available"
                  placeholder="Available"
                />
              </div>
              {/* <div className="col-md-6 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Rating
                </label>

                <input
                  type="text"
                  className="main_form w-100"
                  name="rating"
                  placeholder="Rating"
                />
              </div> */}
              {/* <div className="col-md-6 form_sub_stream">
                <label className="profile_label3">Occupancy</label>
                <input
                  type="text"
                  className="main_form w-100"
                  name="occupanct"
                  placeholder="Occupancy"
                />
              </div> */}
              <div className="col-md-6 form_sub_stream">
                <label className="profile_label3">Meal</label>
                <input
                  type="text"
                  className="main_form w-100"
                  name="meal"
                  placeholder="Meal"
                />
              </div>

              <div className="col-md-6 form_sub_stream">
                <label htmlFor="inputState" className="profile_label3">
                  Bedroom
                </label>
                <select
                  name="bedroom"
                  id="inputState"
                  className="main_form w-100"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="Bunker">Bunker</option>
                </select>
              </div>

              <div className="col-md-6 form_sub_stream">
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
                  placeholder="bathroom"
                />
              </div>

              <div className="col-md-4 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Per Day
                </label>

                <input
                  type="text"
                  className="main_form w-100"
                  name="perDay"
                  placeholder="Per Day"
                />
              </div>
              <div className="col-md-4 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Per Month
                </label>

                <input
                  type="text"
                  className="main_form w-100"
                  name="perMonth"
                  placeholder="Per Month"
                />
              </div>
              <div className="col-md-4 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Per Year
                </label>

                <input
                  type="text"
                  className="main_form w-100"
                  name="perYear"
                  placeholder="Per Year"
                />
              </div>

              <div className="col-md-12 form_sub_stream">
                <label
                  htmlFor="inputState"
                  className="form-label profile_label3 "
                >
                  Image
                </label>
                <input
                  type="file"
                  id="file"
                  className="main_form w-100 p-0"
                  name="photos"
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
                onSubmit={handleSubmit}
              >
                Add Property
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add_property;
