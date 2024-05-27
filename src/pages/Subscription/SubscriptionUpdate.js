import axios from "axios";
import React from "react";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";

const SubscriptionUpdate = ({
  setShowEdit,
  showEdit,
  subscription,
  refetch,
}) => {
  const handleClose = () => setShowEdit(false);

  const handleExtraCharge = async (e) => {
    e.preventDefault();

    const subcripitonData = {
      packageName: e.target.packageName.value,
      packageDuration: e.target.packageDuration.value,
      packagePrice: e.target.packagePrice.value,
      addedTotalRoom: e.target.addedTotalRoom.value,
      totalFeaturedRoom: e.target.totalFeaturedRoom.value,
    };

    try {
      const response = await axios.patch(
        `https://psh-server-test.onrender.com/api/subscription/${subscription?._id}`,
        subcripitonData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);
      refetch();
    } catch (error) {
      return toast.error(error.response?.data?.message);
    }
  };
  return (
    <div>
      <Modal
        show={showEdit}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Subscription Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleExtraCharge}>
            <div className=" ">
              <label htmlFor="">Package Name :</label>
              <br />

              <input
                type="text"
                name="packageName"
                placeholder="Package Name"
                style={{ width: "65%", height: "30px" }}
                required
                defaultValue={subscription?.packageName}
              />
            </div>

            <div className=" mt-2">
              <label htmlFor="">
                Package Duration (Ex: Input 1 = 1 month ):
              </label>
              <br />

              <input
                type="Number"
                placeholder="Package Duration"
                name="packageDuration"
                className=""
                style={{ width: "65%", height: "30px" }}
                required
                defaultValue={subscription?.packageDuration}
              />
            </div>
            <div className=" mt-2">
              <label htmlFor="">Package Price:</label>
              <br />

              <input
                type="number"
                placeholder="Package Price"
                name="packagePrice"
                className=""
                style={{ width: "65%", height: "30px" }}
                required
                defaultValue={subscription?.packagePrice}
              />
            </div>
            <div className=" mt-2">
              <label htmlFor="">How many rooms can be added ?</label>
              <br />

              <input
                type="text"
                placeholder="How many rooms can be added"
                name="addedTotalRoom"
                className=""
                style={{ width: "65%", height: "30px" }}
                required
                defaultValue={subscription?.addedTotalRoom}
              />
            </div>
            <div className=" mt-2">
              <label htmlFor="">How many can be added to the feature ?</label>
              <br />

              <input
                type="text"
                placeholder="How many can be added to the feature"
                name="totalFeaturedRoom"
                className=" "
                style={{ width: "65%", height: "30px" }}
                required
                defaultValue={subscription?.totalFeaturedRoom}
              />
            </div>

            <input
              type="submit"
              value="Update"
              style={{
                marginLeft: "328px",
                backgroundColor: "#27B3B1",
                border: "none",
              }}
              className="mt-2 text-white px-4 py-2"
            />
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SubscriptionUpdate;
