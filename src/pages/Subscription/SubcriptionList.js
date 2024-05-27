import React from "react";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { BiSolidEdit } from "react-icons/bi";
// import ExtraChargeEditModal from "./ExtraChargeEditModal";
// import useExtraCharge from "../../hooks/useExtraCharge";

import { Toaster } from "react-hot-toast";
import useSubscription from "../../hooks/useSubscription";
import AddSubscription from "./AddSubscription";
import SubscriptionUpdate from "./SubscriptionUpdate";
const SubcriptionList = () => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [showEdit, setShowEdit] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  const handleShowEdit = (subscription) => {
    setShowEdit(true);
    setCurrentSubscription(subscription);
  };

  const [subsCriptions, refetch] = useSubscription();

  return (
    <div className="wrapper">
      <div className="content-wrapper">
        <section className="content customize_list">
          <div className="container-fluid">
            <div className="d-flex justify-content-between justify-items-ceneter">
              <h3 className=" mb-3">Subscription List</h3>
              <div className=" mb-3">
                <button onClick={handleShow} className="college_btn2 ms-4 p-3">
                  Add New Subscription
                </button>
              </div>
            </div>
            <AddSubscription show={show} setShow={setShow} refetch={refetch} />
          </div>
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>Package Name</th>
                <th>Package Duration</th>
                <th>Package Price</th>
                <th>How many rooms can be added</th>
                <th>How many can be added to the feature</th>

                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subsCriptions.map((subscription) => (
                <React.Fragment key={subscription?._id}>
                  <tr>
                    <td>{subscription?.packageName}</td>
                    <td>{subscription?.packageDuration} months</td>
                    <td>Tk {subscription?.packagePrice}</td>
                    <td>{subscription?.addedTotalRoom}</td>
                    <td>{subscription?.totalFeaturedRoom}</td>

                    <td>
                      <span onClick={() => handleShowEdit(subscription)}>
                        <BiSolidEdit
                          style={{
                            width: "30px",
                            height: "30px",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </td>
                  </tr>

                  <SubscriptionUpdate
                    subscription={currentSubscription}
                    refetch={refetch}
                    showEdit={showEdit}
                    setShowEdit={setShowEdit}
                  />
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </section>
      </div>
      <Toaster
        containerStyle={{ top: 100 }}
        toastOptions={{ position: "top-center" }}
      ></Toaster>
    </div>
  );
};

export default SubcriptionList;
