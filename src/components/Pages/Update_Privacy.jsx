import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import { TINY_MCE_EDITOR_INIT } from "../../utils/constants";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useParams } from "react-router-dom";

const Update_Privacy = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);

  const [details, setDetails] = useState("");
  useEffect(() => {
    fetch(`https://api.psh.com.bd/api/privacy/${id}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [id, details]);
  const MySwal = withReactContent(Swal);
  const formRef = useRef(null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data2 = {
      desc: details,
    };
    try {
      await axios.put(`https://api.psh.com.bd/api/privacy/${id}`, data2);
      MySwal.fire("Good job!", "successfully added", "success");
      formRef.current.reset();
    } catch (err) {
      MySwal.fire("Something Error Found.", "warning");
    }
  };
  return (
    <div className="wrapper">
      <div className="content-wrapper" style={{ background: "unset" }}>
        <div className="customize registration_div card">
          <label htmlFor="details" className="form-label profile_label3">
            Privacy
          </label>

          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="col-md-12 form_sub_stream">
              <Editor
                apiKey="9i9siri6weyxjml0qbccbm35m7o5r42axcf3lv0mbr0k3pkl"
                initialValue={data?.desc}
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
                Update Privacy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Update_Privacy;
