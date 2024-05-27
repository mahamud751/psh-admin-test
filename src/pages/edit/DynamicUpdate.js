import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useParams } from "react-router-dom";
import { TINY_MCE_EDITOR_INIT } from "../../utils/constants";
const ProductUpdate = ({ data }) => {
  console.log(data);
  const [files, setFiles] = useState("");
  const [name, setName] = useState("");
  const [dataAll, setDataAll] = useState([]);
  const [user, setUser] = useState(data);

  const handleOnBlur = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const newInfo = { ...user };
    newInfo[field] = value;
    setUser(newInfo);
  };
  const [details, setDetails] = useState("");
  useEffect(() => {
    fetch(`https://api.psh.com.bd/api/dynamic/${data._id}`)
      .then((res) => res.json())
      .then((data) => setDataAll(data));
  }, [data._id, details]);
  const MySwal = withReactContent(Swal);
  const formRef = useRef(null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data2 = {
      desc: details,
      ...user,
    };
    try {
      await axios.put(`https://api.psh.com.bd/api/dynamic/${data._id}`, data2);
      MySwal.fire("Good job!", "successfully update", "success");
      formRef.current.reset();
    } catch (err) {
      MySwal.fire("Something Error Found.", "warning");
    }
  };
  return (
    <div className="">
      <div
        className="modal fade "
        id={`update${data._id}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ maxWidth: "1000px" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title fs-4" id="staticBackdropLabel">
                Update Property
              </h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body w-100 ">
              <div className="wrapper">
                <div className="col-md-12 form_sub_stream">
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
                    placeholder="Blog Name"
                    onBlur={handleOnBlur}
                    defaultValue={data.name || ""}
                  />
                </div>
                <div className="col-md-12 form_sub_stream">
                  <label htmlFor="inputState" className="profile_label3">
                    Section
                  </label>
                  <select
                    name="section"
                    id="section"
                    className="main_form w-100"
                    required
                    onBlur={handleOnBlur}
                    defaultValue={data.section || ""}
                  >
                    <option value="footer1">Footer 1</option>
                    <option value="footer2">Footer 2</option>
                    <option value="footer3">Footer 3</option>
                  </select>
                </div>
                <div
                  className="content-wrapper ms-0"
                  style={{ background: "unset" }}
                >
                  <div className="registration_div card p-3 ">
                    <form ref={formRef} onSubmit={handleSubmit}>
                      <div className="col-md-12 form_sub_stream">
                        <Editor
                          apiKey="9i9siri6weyxjml0qbccbm35m7o5r42axcf3lv0mbr0k3pkl"
                          initialValue={dataAll?.desc}
                          init={TINY_MCE_EDITOR_INIT}
                          value={details}
                          onEditorChange={(newValue) => setDetails(newValue)}
                        />
                      </div>

                      <div className="d-flex justify-content-center my-5">
                        <button
                          type="submit"
                          className="profile_btn"
                          style={{ width: 175 }}
                        >
                          Update Dynamic
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
