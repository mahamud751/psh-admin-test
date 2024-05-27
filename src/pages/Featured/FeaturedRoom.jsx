import React, { useEffect, useState } from "react";

import { useQuery } from "react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

const FeaturedRoom = (props) => {
  const [data, setData] = useState([]);
  const [roomId, setRoomId] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterFeatured, setIsFilterFeatured] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);

  const [categories, setCategories] = useState([]);

  const [branches, setBranches] = useState([]);
  const [selectCategory, setSelectCategory] = useState("All");
  const [selectBranch, setSelectBranch] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  useEffect(() => {
    let featuredRooms = [];
    let featuredFilterRooms = [];

    featuredRooms = data
      ?.filter((room) => room.Featured === "yes")
      .map((room) => room._id);

    setRoomId(featuredRooms);
    if (isFilter) {
      featuredFilterRooms = filterData?.filter(
        (room) => room.Featured === "yes"
      );
    }
    setIsFilterFeatured(featuredFilterRooms);
  }, [data, filterData, isFilter]);

  const { refetch: categoryList } = useQuery(["categoryList"], async () => {
    try {
      const response = await axios.get(`https://api.psh.com.bd/api/category`, {
        mode: "cors",
      });

      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  });
  const { refetch: branchList } = useQuery(["branchList"], async () => {
    try {
      const response = await axios.get(`https://api.psh.com.bd/api/branch`, {
        mode: "cors",
      });

      setBranches(response.data);
    } catch (error) {
      console.error(error);
    }
  });

  // Get Properties
  const { refetch } = useQuery(["propertyList"], async () => {
    try {
      const response = await axios.get("https://api.psh.com.bd/api/property", {
        mode: "cors",
      });

      setData(response.data); // Return data from the async function
    } catch (error) {
      console.error(error);
      throw error; // Throw the error to handle it in the caller
    }
  });

  const handleSearch = async () => {
    setIsLoading(true);
    setIsFilter(true);

    try {
      const response = await axios.get("https://api.psh.com.bd/api/property", {
        params: {
          sCategory: selectCategory !== "All" ? selectCategory : undefined,
          sBranch: selectBranch !== "All" ? selectBranch : undefined,
          roomNumber: roomNumber.toUpperCase(),
        },
        mode: "cors",
      });

      setFilterData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeaturedRoom = (e) => {
    const roomIdToAddOrRemove = e.target.value;

    if (e.target.checked) {
      // Checkbox is checked, add the room ID to the state if it doesn't already exist
      if (!roomId.includes(roomIdToAddOrRemove)) {
        setRoomId((prevRoomIds) => [...prevRoomIds, roomIdToAddOrRemove]);
      }
    } else {
      // Checkbox is unchecked, remove the room ID from the state
      setRoomId((prevRoomIds) =>
        prevRoomIds.filter((id) => id !== roomIdToAddOrRemove)
      );
    }
  };

  const updateFeatured = {
    roomId: roomId,
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `https://api.psh.com.bd/api/property/featured`,
        updateFeatured
      );
      toast.success(response.data.message);
      refetch();
    } catch (err) {
      toast.success("Something Error");
    }
  };

  return (
    <div className="wrapper">
      <div className="content-wrapper" style={{ background: "unset" }}>
        <section className="content customize_list">
          <div className="container-fluid">
            <h3>Featured</h3>

            <h4>
              Availble Rooms : {isFilter ? filterData?.length : data?.length}
            </h4>
            <div className="d-flex">
              <h5
                className="rounded"
                style={{
                  backgroundColor: "#35b0a7",
                  color: "white",
                  padding: "5px 10px",
                }}
              >
                Featured Rooms :{" "}
                {isFilter ? filterFeatured?.length : roomId?.length}
              </h5>
            </div>

            <div className="row">
              <div className="d-flex justify-content-end ">
                <div>
                  <div>
                    <label htmlFor="Category">Category: </label>
                  </div>
                  <select
                    onChange={(e) => setSelectCategory(e.target.value)}
                    style={{
                      height: "30px",
                    }}
                  >
                    <option value="All">All</option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category?.name}>
                        {category?.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginLeft: 10 }}>
                  <div>
                    <label htmlFor="branch">Branch</label>
                  </div>

                  <select
                    onChange={(e) => setSelectBranch(e.target.value)}
                    style={{
                      height: "30px",
                    }}
                  >
                    <option value="All">All</option>
                    {branches?.map((branch) => (
                      <option key={branch._id} value={branch?.name}>
                        {branch?.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginLeft: 10 }}>
                  <label htmlFor="">Room No. </label> <br />
                  <input
                    type="text"
                    list="roomNumber"
                    placeholder="Type Room Number"
                    onChange={(e) => setRoomNumber(e.target.value)}
                    style={{
                      width: "200px",
                    }}
                  />
                </div>
                <div style={{ marginLeft: 10, marginTop: 30 }}>
                  <button
                    onClick={handleSearch}
                    className="btn text-white mb-5"
                    style={{
                      backgroundColor: "#35b0a7",
                      height: "32px",
                      padding: "0 10px",
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <p
                style={{ margin: "150px 0" }}
                className="text-center text-danger fw-bold"
              >
                Please Wait...
                <Spinner size="sm" animation="grow" />
              </p>
            ) : data?.length > 0 || filterData?.length > 0 ? (
              <div>
                <h5>Choose one Room for Featured: </h5>
                <form onSubmit={handleSubmit}>
                  <div className="row mt-3">
                    {isFilter
                      ? filterData?.map((room, index) => (
                          <div
                            className="col-lg-3 col-md-3 col-sm-6"
                            key={index}
                          >
                            <input
                              type="checkbox"
                              name=""
                              id={`checkbox-${index}`}
                              onChange={handleFeaturedRoom}
                              value={room?._id}
                              defaultChecked={
                                room?.Featured === "yes" ? true : false
                              }
                            />
                            <label
                              htmlFor={`checkbox-${index}`}
                              className="ms-3"
                            >
                              Room No: {room?.roomNumber}
                            </label>
                          </div>
                        ))
                      : data?.map((room, index) => (
                          <div
                            className="col-lg-3 col-md-3 col-sm-6"
                            key={index}
                          >
                            <input
                              type="checkbox"
                              name=""
                              id={`checkbox-${index}`}
                              onChange={handleFeaturedRoom}
                              value={room?._id}
                              defaultChecked={
                                room?.Featured === "yes" ? true : false
                              }
                              disabled={
                                room?.isPartner === "yes" ? true : false
                              }
                            />
                            <label
                              htmlFor={`checkbox-${index}`}
                              className="ms-3"
                              style={{
                                color:
                                  room?.isPartner === "yes"
                                    ? "#9e9e9e"
                                    : "black",
                              }}
                            >
                              Room No: {room?.roomNumber}{" "}
                              {room?.isPartner === "yes" ? "(PSH Partner)" : ""}
                            </label>
                          </div>
                        ))}
                  </div>
                  <input
                    type="submit"
                    className="btn text-white mt-4"
                    style={{
                      backgroundColor: "#35b0a7",
                      height: "32px",
                      padding: "0 10px",
                    }}
                    value="Submit"
                  />
                </form>
              </div>
            ) : (
              <p className="text-center text-danger fw-bold">
                Finding Rooms...
                <Spinner size="sm" animation="grow" />
              </p>
            )}
          </div>
        </section>
      </div>
      <ToastContainer className="toast-position" position="top-center" />
    </div>
  );
};

export default FeaturedRoom;
