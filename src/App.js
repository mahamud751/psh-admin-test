import "bootstrap-4-react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/SignIn";
import Add_Category from "./pages/Add_Category";
import Category from "./pages/Category";
import Property from "./pages/Property";
import Orders from "./pages/Orders";
import Add_property from "./pages/Add_property";
import Promo from "./pages/Promo";
import Add_Promo from "./pages/Add_Promo";
import Add_Recommended from "./pages/Add_Recommended";
import Recommended from "./pages/Recommended";
import PrivateRoute from "./Routes/PrivateRoute/PrivateRoute";
import AdminRoute from "./Routes/AdminRoute/AdminRoute";
import Add_Manager from "./pages/Add_manager";
import Manager from "./pages/Manager";
import Add_Branch from "./pages/Add_Branch";
import Branch from "./pages/Branch";
import Add_Facility from "./pages/Add_Facility";
import Facility from "./pages/Facility";
import Add_Seat from "./pages/Add_Seat";
import Seat from "./pages/Seat";
import Issue from "./pages/issue";
import AdminOrders from "./pages/AdminOrders";
import Review from "./pages/Review";
import Issues from "./pages/Issues";
import Admin_issue from "./pages/Admin_issue";
import Admin_seat from "./pages/Admin_seat";
import Invoice from "./pages/details/Invoice";
import Add_Facility_Category from "./pages/Add_Facility_Category";
import Facility_Category_list from "./components/Facility/Facility_Category_list";
import Add_Banner from "./pages/Add_Banner";
import Banner from "./pages/Banner";
import LeasePropertyList from "./components/LeaseProperty/LeasePropertyList";
import Partner_list from "./components/Manager/Partner_list";
import Partner_property_list from "./components/Property/Partner_property_list";
import ExtraCharge from "./pages/ExtraCharge/ExtraCharge";
import TransactionAdmin from "./pages/Transaction/TransactionAdmin";
import UserManage from "./pages/UserMange/UserManage";
import TransactionManager from "./pages/Transaction/TransactionManager";
import Add_CommonFacility from "./pages/Add_CommonFacility";
import CommonFacility from "./pages/CommonFacility";
import Add_Privacy from "./components/Pages/Add_Privacy";
import Pages from "./pages/Pages";
import Terms_list from "./components/Pages/Terms_list";
import Add_Terms from "./components/Pages/Add_Terms";
import Privacy_list from "./components/Pages/Privacy_list";
import Update_Terms from "./components/Pages/Update_Terms";
import Update_Privacy from "./components/Pages/Update_Privacy";
import Add_Dynamic from "./pages/Add_Dynamic";
import Dynamic from "./pages/Dynamic";
import Finance from "./pages/Finance/Finance";
import Add_Event from "./pages/Add_Event";
import Event from "./pages/Event";
import AdjustmentList from "./components/Promo/AdjustmentList";
import UsedPromoList from "./components/Promo/UsedPromoList";
import Homes from "./components/Homes/Homes";
import ContactUs from "./pages/ContactUs/ContactUs";
import RoomRent from "./pages/RoomRent/RoomRent";
import RoomVisit from "./pages/RoomVisit/RoomVisit";
import RoomVisitAdmin from "./pages/RoomVisit/RoomVisitAdmin";
import PropertyReports from "./components/Property/PropertyReports";
import FeaturedRoom from "./pages/Featured/FeaturedRoom";
import AdminPropertyList from "./components/Property/AdminPropertyList";
import SubcriptionList from "./pages/Subscription/SubcriptionList";
import SubscriptionOrder from "./pages/Subscription/SubscriptionOrder";

function App() {
  return (
    <div className="">
      <Routes>
        <Route element={<SignIn />}>
          <Route path="/signup" element={<SignIn />} />
        </Route>

        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Homes />} />
        </Route>
        <Route path="/" element={<AdminRoute />}>
          <Route path="/" element={<Homes />} />

          <Route path="add_manager" element={<Add_Manager />} />
          <Route path="manager_list" element={<Manager />} />
          <Route path="partner_list" element={<Partner_list />} />

          <Route path="add_category" element={<Add_Category />} />
          <Route path="category_list" element={<Category />} />
          <Route path="add_branch" element={<Add_Branch />} />
          <Route path="branch_list" element={<Branch />} />
          <Route path="add_dynamic" element={<Add_Dynamic />} />
          <Route path="dynamic_list" element={<Dynamic />} />
          <Route path="add_event" element={<Add_Event />} />
          <Route path="event_list" element={<Event />} />
          <Route path="subscription-list" element={<SubcriptionList />} />
          <Route path="subscription-order" element={<SubscriptionOrder />} />
          <Route
            path="add_facility_category"
            element={<Add_Facility_Category />}
          />
          <Route
            path="facility_category_list"
            element={<Facility_Category_list />}
          />
          <Route path="add_facility" element={<Add_Facility />} />
          <Route path="facility_list" element={<Facility />} />
          <Route path="add_commonfacility" element={<Add_CommonFacility />} />
          <Route path="commonfacility_list" element={<CommonFacility />} />
          <Route path="add_seat" element={<Add_Seat />} />
          <Route path="seat_list_m" element={<Seat />} />
          <Route path="seat_list" element={<Admin_seat />} />
          <Route path="add_property" element={<Add_property />} />
          <Route path="property_list_m" element={<Property />} />
          <Route path="property_list_p" element={<Partner_property_list />} />
          <Route path="property_list" element={<AdminPropertyList />} />
          <Route path="property-report" element={<PropertyReports />} />
          <Route path="add-promo" element={<Add_Promo />} />
          <Route path="promo_list" element={<Promo />} />
          <Route path="adjustmen-list" element={<AdjustmentList />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="used-promo" element={<UsedPromoList />} />
          <Route path="add_banner" element={<Add_Banner />} />
          <Route path="banner_list" element={<Banner />} />
          <Route path="add_recommended" element={<Add_Recommended />} />
          <Route path="recommended_list" element={<Recommended />} />
          <Route path="orders_m" element={<Orders />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="transaction" element={<TransactionAdmin />} />
          <Route path="transaction-m" element={<TransactionManager />} />
          <Route path="finance" element={<Finance />} />
          <Route path="corporate-housing" element={<RoomRent />} />
          <Route path="visitingRequest-a" element={<RoomVisitAdmin />} />
          <Route path="visitingRequest" element={<RoomVisit />} />
          <Route path="user-manage" element={<UserManage />} />

          <Route path="issue" element={<Issue />} />
          <Route path="issues_m" element={<Issues />} />
          <Route path="issues" element={<Admin_issue />} />
          <Route path="review" element={<Review />} />
          <Route path="lease-property" element={<LeasePropertyList />} />
          <Route path="extra-charge" element={<ExtraCharge />} />
          <Route path="invoice/:id" element={<Invoice />} />

          <Route path="pages" element={<Pages />} />
          <Route path="featured" element={<FeaturedRoom />} />
          <Route path="add_privacy" element={<Add_Privacy />} />
          <Route path="privacy_list" element={<Privacy_list />} />
          <Route path="add_terms" element={<Add_Terms />} />
          <Route path="terms_list" element={<Terms_list />} />
          <Route path="update_terms/:id" element={<Update_Terms />} />
          <Route path="update_privacy/:id" element={<Update_Privacy />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
