import axios from "axios";
import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/UserProvider";
import { useState } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useRef } from "react";
import { toast } from "react-toastify";

const PropertyUpdate2 = ({ data, refetch }) => {
  const { user } = useContext(AuthContext);

  const [files, setFiles] = useState("");
  const MySwal = withReactContent(Swal);
  const [categories, setCategories] = useState([]);
  const [branch, setBranch] = useState(data?.branch?.name);
  const [seatPhotos, setSeatPhotos] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [commonFacilities, setCommonaFacilities] = useState([]);
  const [categoryName, setCategoryName] = useState(data?.category?.name);
  const [seatOptions, setSeatOptions] = useState([]);

  // Update seatOptions whenever categoryName changes
  useEffect(() => {
    if (categoryName === "Shared Room") {
      setSeatOptions([...data?.seats]);
    } else {
      setSeatOptions([]);
    }
  }, [categoryName, data?.seats]);

  // console.log("seatOptions", seatOptions);
  const formRef = useRef(null);
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
  // const getFacilityImageURL = (facilityId) => {

  //   const facility = facilities.find((facility) => facility._id === facilityId);
  //   return facility?.photos?.[0] || "";
  // };

  //   const handleCategoryChange = (event) => {
  //     const selectedCategoryId = event.target.value;
  //     const selectedCategory = categories.find(
  //       (category) => category._id === selectedCategoryId
  //     );
  //     setCategoryName(selectedCategory?.name || "");
  //   };

  //   console.log(categoryName);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.psh.com.bd/api/facilityCategory"
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
          "https://api.psh.com.bd/api/commonfacility"
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
        seatType: "",
        perDay: "",
        perMonth: "",
        perYear: "",
        photos: [],
        isSeatPublished: "Published",
      },
    ]);
  };
  const handleSeatPhotosChange = (e, index, seatPhoto) => {
    const updatedOptions = [...seatOptions];

    updatedOptions[index].photos =
      e.target.files === "" ? seatPhoto : e.target.files;
    setSeatOptions(updatedOptions);
  };

  const handleRemoveSeatOption = (index) => {
    if (seatOptions.length === 1) {
      MySwal.fire("You must need to select one seat.", "warning");
      return;
    }
    if (data?.seats?.find((seat, indx) => indx === index)) {
      return MySwal.fire("Sorry ! This Seat Not Remove.", "warning");
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
    const selectedSeatOptions = seatOptions?.filter(
      (option) =>
        option.name &&
        option.description &&
        option.seatNumber &&
        option.seatType &&
        option.perDay &&
        option.perMonth &&
        option.photos &&
        option.perYear &&
        option.isSeatPublished
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
      bedType: formData.get("bedType"),
      furnitured: formData.get("furnitured"),
      CCTV: formData.get("CCTV"),
      WiFi: formData.get("WiFi"),
      balcony: formData.get("balcony"),
      meal: formData.get("meal"),
      rules: formData.get("rules"),
      //apartment
      roomCategory: formData.get("roomCategory"),
      additionalFacility: formData.get("additionalFacility"),
      apartmentRent: formData.get("apartmentRent"),
      serviceCharge: formData.get("service"),
      security: formData.get("security"),
      faltPolicy: formData.get("faltPolicy"),
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
        photos: list?.length > 0 ? list : data?.photos,
        seats: seatOptions?.map((option, index) => ({
          ...option,
          photos: seatPhotoList[index],
        })),
      };

      if (product?.photos?.length < 5) {
        return MySwal.fire("Sorry ! Minimum 5 Photo Required.", "warning");
      }

      await axios.put(
        `https://api.psh.com.bd/api/property/${data?._id}`,
        product
      );
      MySwal.fire("successfully Update", "success");
      // formRef.current.reset();
      refetch();
    } catch (err) {
      console.log(err);
      MySwal.fire("Something Error Found.", "warning");
    }
  };

  return (
    <div className="">
      <div
        className="modal fade "
        id={`propertyUpdate${data._id}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ maxWidth: "1000px" }}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="d-flex justify-items-center">
                <h3> Property Update</h3>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body w-100 ">
              {/* Room Details */}

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
                      //   onChange={handleCategoryChange}
                    >
                      <option value={data?.category?._id}>
                        {data?.category?.name}
                      </option>
                    </select>
                  </div>
                  {(user && user.role === "SuperAdmin") ||
                  user.role === "admin" ? (
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
                        <option value={data?.branch?._id}>
                          {data?.branch.name}
                        </option>
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
                      required
                      defaultValue={data?.floor}
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
                          placeholder="Total Room"
                          defaultValue={data?.totalRoom}
                          // required
                        />
                      </div>
                    )}
                  <div className="col-md-3 form_sub_stream mb-5">
                    <label htmlFor="inputState" className="profile_label3">
                      Gender Type
                    </label>
                    <select
                      name="type"
                      className="main_form w-100"
                      defaultValue={"female"}
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <h2 className="profile_label3 profile_bg">Sort Details</h2>
                  <div className="col-md-6 form_sub_stream ">
                    <label
                      htmlFor="inputState"
                      className="form-label profile_label3 "
                    >
                      Room Name
                    </label>
                    <input
                      type="text"
                      className="main_form w-100"
                      name="name"
                      placeholder="Room Name"
                      required
                      defaultValue={data?.name}
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
                      placeholder="Please Type in Sqft"
                      required
                      defaultValue={data?.area}
                    />
                  </div>
                  {categoryName === "Shared Room" ? (
                    ""
                  ) : (
                    <div className="col-md-6 form_sub_stream">
                      <label htmlFor="inputState" className="profile_label3">
                        Total Bedroom
                      </label>
                      <input
                        type="number"
                        className="main_form w-100"
                        name="bedroom"
                        placeholder="Total Bed Room"
                        required
                        defaultValue={data?.bedroom}
                      />
                    </div>
                  )}

                  <div className="col-md-6 form_sub_stream">
                    <label
                      htmlFor="inputState"
                      className="form-label profile_label3 "
                    >
                      Total Bathroom
                    </label>

                    <input
                      type="number"
                      className="main_form w-100"
                      name="bathroom"
                      placeholder="bathroom"
                      required
                      defaultValue={data?.bathroom}
                    />
                  </div>
                  <h2 className="profile_label3 profile_bg mt-5">
                    Key Details
                  </h2>
                  <div className="col-md-12 form_sub_stream">
                    <div className="row p-4">
                      <div className="col-md-4 form_sub_stream mt-3">
                        <label htmlFor="inputState" className="profile_label3">
                          Balcony
                        </label>
                        <select
                          name="balcony"
                          id="furnitured"
                          className="main_form w-100"
                          required
                          defaultValue={data?.balcony}
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div className="col-md-4 form_sub_stream mt-3">
                        <label
                          htmlFor="inputState"
                          className="form-label profile_label3 "
                        >
                          Bed Type
                        </label>
                        {/* <input
                      type="text"
                      className="main_form w-100"
                      name="bedType"
                      placeholder="Bed Type"
                      required
                    /> */}

                        <select
                          name="bedType"
                          id="inputState"
                          className="main_form w-100"
                          required
                          defaultValue={data?.bedType}
                        >
                          <option value="Bunk Bed">Bunk Bed</option>
                          <option value="Single Bed">Single Bed</option>
                          <option value="Queen Size Bed">Queen Size Bed</option>
                          <option value="King Size Bed">King Size Bed</option>
                          <option value="Semi-Double Bed">
                            Semi-Double Bed
                          </option>
                          <option value="Bunk Bed & Single Bed">
                            Bunk Bed & Single Bed
                          </option>
                        </select>
                      </div>
                      <div className="col-md-4 form_sub_stream mt-3">
                        <label htmlFor="inputState" className="profile_label3">
                          Recommended
                        </label>
                        <select
                          name="recommended"
                          id="inputState"
                          className="main_form w-100"
                          required
                          defaultValue={data?.recommended}
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div className="col-md-4 form_sub_stream">
                        <label htmlFor="inputState" className="profile_label3">
                          Furnished
                        </label>
                        <select
                          name="furnitured"
                          id="furnitured"
                          className="main_form w-100"
                          required
                          defaultValue={data?.furnitured}
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div className="col-md-4 form_sub_stream">
                        <label htmlFor="inputState" className="profile_label3">
                          CCTV
                        </label>
                        <select
                          name="CCTV"
                          id="inputState"
                          className="main_form w-100"
                          required
                          defaultValue={data?.CCTV}
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div className="col-md-4 form_sub_stream">
                        <label htmlFor="inputState" className="profile_label3">
                          WiFi
                        </label>
                        <select
                          name="WiFi"
                          id="furnitured"
                          className="main_form w-100"
                          required
                          defaultValue={data?.WiFi}
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <h2 className="profile_label3 profile_bg mt-4">Facility</h2>
                    <div className="p-4">
                      <div className="row">
                        <h2 className="profile_label3  mt-4">Regular</h2>
                        <div>
                          {commonFacilities.map((facility) => {
                            const selectedCommon = data?.commonfacility?.find(
                              (check) => check._id === facility._id
                            );

                            return (
                              <>
                                <input
                                  type="checkbox"
                                  id={facility._id}
                                  name="commonfacility[]"
                                  value={facility._id}
                                  multiple
                                  key={facility._id}
                                  className="me-1"
                                  defaultChecked={selectedCommon ? true : false}
                                />
                                <label
                                  className="ms-2 mt-1"
                                  htmlFor={facility._id}
                                >
                                  {facility.name ? facility.name : ""}
                                </label>
                                <img
                                  src={
                                    facility.photos ? facility.photos[0] : ""
                                  }
                                  alt=""
                                  style={{ width: 20 }}
                                  className="mx-3"
                                />
                              </>
                            );
                          })}
                        </div>
                      </div>

                      {categoryName === "Private Room" ||
                      categoryName === "Shared Room" ? (
                        <>
                          {/* facility */}
                          <div className="row">
                            {facilities.map((facility) => (
                              <>
                                {facility.name === "Common" ? ( // Add this condition to check the facility name
                                  <>
                                    <h2 className="profile_label3">
                                      {facility.name}
                                    </h2>

                                    <div>
                                      {facility.facility.map((pd) => {
                                        const selectedFacility =
                                          data?.facility?.find(
                                            (check) => check._id === pd._id
                                          );
                                        return (
                                          <>
                                            <input
                                              type="checkbox"
                                              id={pd._id}
                                              name="facility[]"
                                              value={pd._id}
                                              multiple
                                              key={pd._id}
                                              className="me-1"
                                              defaultChecked={
                                                selectedFacility ? true : false
                                              }
                                            />

                                            <label
                                              className="ms-2 mt-1"
                                              htmlFor={pd._id}
                                            >
                                              {pd.name ? pd.name : ""}
                                            </label>
                                            <img
                                              src={
                                                pd.photos ? pd.photos[0] : ""
                                              }
                                              alt=""
                                              style={{ width: 20 }}
                                              className="mx-3"
                                            />
                                          </>
                                        );
                                      })}
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
                                <h2 className="profile_label3">
                                  {facility.name}
                                </h2>

                                <div>
                                  {facility.facility.map((pd) => {
                                    const selectedFacility =
                                      data?.facility?.find(
                                        (check) => check._id === pd._id
                                      );
                                    return (
                                      <>
                                        <input
                                          type="checkbox"
                                          id={pd._id}
                                          name="facility[]"
                                          value={pd._id}
                                          multiple
                                          key={pd._id}
                                          className="me-1"
                                          defaultChecked={
                                            selectedFacility ? true : false
                                          }
                                        />

                                        <label
                                          className="ms-2 mt-1"
                                          htmlFor={pd._id}
                                        >
                                          {pd.name ? pd.name : ""}
                                        </label>
                                        <img
                                          src={pd.photos ? pd.photos[0] : ""}
                                          alt=""
                                          style={{ width: 20 }}
                                          className="mx-3"
                                        />
                                      </>
                                    );
                                  })}
                                </div>
                              </>
                            ) : null}
                          </>
                        ))}
                      </div>
                    </div>
                  </div>

                  {categoryName !== "Shared Room" && (
                    <>
                      <h2 className="profile_label3 profile_bg mt-5 mb-4">
                        Rent Details
                      </h2>
                      <div className="col-md-12 form_sub_stream">
                        <div className="row p-4">
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
                              required
                              defaultValue={data?.perDay}
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
                              required
                              defaultValue={data?.perMonth}
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
                              required
                              defaultValue={data?.perYear}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
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
                          defaultValue={data?.roomNumber}
                        />
                      </div>
                    </>
                  )}

                  {data?.category?.name === "Shared Room" && (
                    <>
                      <h2 className="profile_label3 profile_bg">
                        Seat Details
                      </h2>

                      <div className=" card_div p-4">
                        {seatOptions.map((option, index) => (
                          <>
                            <div className="row">
                              <h2 className="profile_label3 profile_bg">
                                Seat
                              </h2>
                              <div className="col-md-6 form_sub_stream">
                                <label className="profile_label3">
                                  Seat Name
                                </label>
                                <input
                                  type="text"
                                  className="main_form w-100"
                                  // value={option.name}
                                  onChange={(e) => {
                                    const updatedOptions = [...seatOptions];
                                    updatedOptions[index].name = e.target.value;

                                    setSeatOptions(updatedOptions);
                                  }}
                                  placeholder="Seat Name"
                                  required
                                  defaultValue={option?.name}
                                />
                              </div>

                              <div className="col-md-6 form_sub_stream">
                                <label className="profile_label3">
                                  Seat Number
                                </label>
                                <input
                                  type="text"
                                  className="main_form w-100"
                                  // value={option.seatNumber}
                                  onChange={(e) => {
                                    const updatedOptions = [...seatOptions];
                                    updatedOptions[index].seatNumber =
                                      e.target.value;
                                    setSeatOptions(updatedOptions);
                                  }}
                                  placeholder="Seat Number"
                                  required
                                  defaultValue={option?.seatNumber}
                                />
                              </div>
                              <div className="col-md-3 form_sub_stream">
                                <label className="profile_label3">
                                  Seat Type
                                </label>
                                {/* <input
                          type="text"
                          className="main_form w-100"
                          value={option.seatNumber}
                        /> */}

                                <select
                                  name="WiFi"
                                  id="furnitured"
                                  className="main_form w-100"
                                  required
                                  // value={option.seatType}
                                  onChange={(e) => {
                                    const updatedOptions = [...seatOptions];
                                    updatedOptions[index].seatType =
                                      e.target.value;
                                    setSeatOptions(updatedOptions);
                                  }}
                                  defaultValue={option?.seatType}
                                >
                                  <option value="Upper Bed">Upper Bed</option>
                                  <option value="Lower Bed">Lower Bed</option>
                                  <option value="Single Bed">Single Bed</option>
                                </select>
                              </div>

                              <div className="col-md-3 form_sub_stream">
                                <label className="profile_label3">
                                  Per Day
                                </label>
                                <input
                                  type="text"
                                  className="main_form w-100"
                                  // value={option.perDay}
                                  onChange={(e) => {
                                    const updatedOptions = [...seatOptions];
                                    updatedOptions[index].perDay =
                                      e.target.value;
                                    setSeatOptions(updatedOptions);
                                  }}
                                  defaultValue={option?.perDay}
                                  placeholder="Per Day Price"
                                  required
                                />
                              </div>
                              <div className="col-md-3 form_sub_stream">
                                <label className="profile_label3">
                                  Per Month
                                </label>
                                <input
                                  type="text"
                                  className="main_form w-100"
                                  // value={option.perMonth}
                                  onChange={(e) => {
                                    const updatedOptions = [...seatOptions];
                                    updatedOptions[index].perMonth =
                                      e.target.value;
                                    setSeatOptions(updatedOptions);
                                  }}
                                  defaultValue={option?.perMonth}
                                  placeholder="Per Month Price"
                                  required
                                />
                              </div>
                              <div className="col-md-3 form_sub_stream">
                                <label className="profile_label3">
                                  Per Year
                                </label>
                                <input
                                  type="text"
                                  className="main_form w-100"
                                  // value={option.perYear}
                                  onChange={(e) => {
                                    const updatedOptions = [...seatOptions];
                                    updatedOptions[index].perYear =
                                      e.target.value;
                                    setSeatOptions(updatedOptions);
                                  }}
                                  defaultValue={option?.perYear}
                                  placeholder="Per Year Price"
                                  required
                                />
                              </div>
                              {/* <div className="col-md-4 form_sub_stream">
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
                      </div> */}
                              <div
                                className="col-md-4 form_sub_stream"
                                key={index}
                              >
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
                                  onChange={(e) =>
                                    handleSeatPhotosChange(
                                      e,
                                      index,
                                      option?.photos
                                    )
                                  }
                                  multiple
                                  required={
                                    option?.photos?.length > 0 ? false : true
                                  }
                                />
                              </div>
                              <div className="col-md-3 form_sub_stream">
                                <label className="profile_label3">Status</label>

                                <select
                                  name="WiFi"
                                  id="furnitured"
                                  className="main_form w-100"
                                  required
                                  // value={option.seatType}
                                  onChange={(e) => {
                                    const updatedOptions = [...seatOptions];
                                    updatedOptions[index].isSeatPublished =
                                      e.target.value;
                                    setSeatOptions(updatedOptions);
                                  }}
                                  defaultValue={option?.isSeatPublished}
                                >
                                  <option value="Published">Published</option>
                                  <option value="Unpublished">
                                    Unpublished
                                  </option>
                                </select>
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
                            </div>
                          </>
                        ))}
                      </div>
                    </>
                  )}

                  {categoryName === "Apartment" && (
                    <>
                      <h2 className="profile_label3 profile_bg mt-5 mb-4">
                        Rent Policy
                      </h2>
                      <div className="col-md-12 form_sub_stream">
                        <div className="row p-4">
                          <div className="col-md-4 form_sub_stream">
                            <label
                              htmlFor="inputState"
                              className="form-label profile_label3 "
                            >
                              Rent Per Month
                            </label>

                            <input
                              type="text"
                              className="main_form w-100"
                              name="apartmentRent"
                              placeholder="Rent Per Month"
                              required
                            />
                          </div>
                          <div className="col-md-4 form_sub_stream">
                            <label
                              htmlFor="inputState"
                              className="form-label profile_label3 "
                            >
                              Service Charge
                            </label>

                            <input
                              type="text"
                              className="main_form w-100"
                              name="serviceCharge"
                              placeholder="Service Charge"
                            />
                          </div>
                          <div className="col-md-4 form_sub_stream">
                            <label
                              htmlFor="inputState"
                              className="form-label profile_label3 "
                            >
                              Security Deposit
                            </label>

                            <input
                              type="text"
                              className="main_form w-100"
                              name="security"
                              defaultValue="2 month’s rent"
                            />
                          </div>
                          <div className="col-md-4 form_sub_stream">
                            <label
                              htmlFor="inputState"
                              className="form-label profile_label3 "
                            >
                              Flat Release Policy
                            </label>

                            <input
                              type="text"
                              className="main_form w-100"
                              name="faltPolicy"
                              defaultValue="2 months earlier notice required"
                            />
                          </div>
                        </div>
                      </div>
                      <h2 className="profile_label3 profile_bg">Details</h2>
                      <div className="row p-4">
                        <div className="row">
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
                        </div>
                        <div className="col-md-12 form_sub_stream">
                          <label
                            htmlFor="inputState"
                            className="form-label profile_label3 "
                          >
                            Room Category
                          </label>
                          <textarea
                            className="form-control"
                            name="roomCategory"
                            rows="2"
                            defaultValue={`Example : 3 Large Bed rooms with 3 Balcony, Spacious Drawing Room, Dining & Family Living Room, Highly Decorated Kitchen with a Store Room and Servant room with Attached Toilet.`}
                          ></textarea>
                        </div>

                        <div className="col-md-12 form_sub_stream">
                          <label
                            htmlFor="inputState"
                            className="form-label profile_label3 "
                          >
                            Additional Facilities
                          </label>
                          <textarea
                            className="form-control"
                            name="additionalFacility"
                            rows="6"
                            defaultValue={`Example :  
                      1. Electricity with full time Generator Service.
                      2. Available 24/7 Gas. 
                      3. Car Parking with 1 Driver’s Accommodation.
                      4. Roof TOp Beautified Garden and Grassy Ground.
                      5. Full Building Covered by CCTV.`}
                          ></textarea>
                        </div>
                      </div>
                    </>
                  )}

                  <h2 className="profile_label3 profile_bg mt-5 mb-4">
                    Room Rules
                  </h2>
                  <div className="col-md-12 form_sub_stream">
                    <label
                      htmlFor="inputState"
                      className="form-label profile_label3 "
                    >
                      Room Rules
                    </label>
                    <textarea
                      className="form-control"
                      name="rules"
                      rows="6"
                      defaultValue={`Example :  
                      1. Keep your living space, common areas, and bathrooms clean and organized..
                      2. Engage in hostel activities, meetings, and events. Active participation can enhance your social experience and create a sense of community. 
                    `}
                    ></textarea>
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
                      // required
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
                    Update Property
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyUpdate2;
