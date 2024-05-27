import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Terms_list from "./Terms_list";
import Privacy_list from "./Privacy_list";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Pages_list = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className="wrapper">
      <div className="content-wrapper" style={{ background: "unset" }}>
        <section className="content customize_list">
          <div className="col-md-12">
            <div className="corporate_addNew_btn">
              <Link to={"/add_terms"}>
                <button className="college_btn ms-4 " style={{ width: 220 }}>
                  Add Terms & Conditions
                </button>
              </Link>
              <Link to={"/add_privacy"}>
                <button
                  className="college_btn ms-4 new_state_btn mt-4"
                  style={{ width: 150 }}
                >
                  Add Privacy
                </button>
              </Link>
            </div>
          </div>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              TabIndicatorProps={{
                style: { background: "#463196", height: 4 },
              }}
            >
              <Tab
                label="Terms & Conditions"
                {...a11yProps(0)}
                sx={{ textTransform: "initial", fontWeight: 600 }}
              />
              <Tab
                label="Privacy"
                {...a11yProps(1)}
                sx={{ textTransform: "initial", fontWeight: 600 }}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Terms_list />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Privacy_list />
          </TabPanel>
        </section>
      </div>
    </div>
  );
};

export default Pages_list;
