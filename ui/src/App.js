import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login.js';
import MenuSidebar from './shared/Sidebar.js';
import PageNotFound from './shared/PageNotFound.js';
import HomeDashboard from './pages/dashboard/home-dashboard.js';
import ListCustomers from './pages/customers/List-customers.js';
import AddCustomers from './pages/customers/Add-customers.js';
import ListBuysers from './pages/buyers/List-buyers.js';
import AddBuysers from './pages/buyers/Add-buyers.js';
import ListSellers from './pages/sellers/List-sellers.js';
import AddSellers from './pages/sellers/Add-sellers.js';
import ListFollowup from "./pages/followup/List-followup.js";
import AddFollowup from "./pages/followup/Add-followup.js";
import ListDealComplete from "./pages/dealcomplete/List-dealcomplete.js";
import AddDealComplete from "./pages/dealcomplete/Add-dealcomplete.js";


export default function App() {

  return (
    <>
    <div style={{ display: 'flex', height: '100vh' }}>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<><Login /></>} />

          <Route path="/dashboard" element={<> <MenuSidebar/> <HomeDashboard/> </>} />

          <Route path="/customer-list" element={<> <MenuSidebar/> <ListCustomers/></>} />
          <Route path="/addcustomer" element={<> <MenuSidebar/> <AddCustomers/></>} />
          <Route path="/addcustomer/:id" element={<> <MenuSidebar/> <AddCustomers/></>} />

          <Route path="/seller-list" element={<> <MenuSidebar/> <ListSellers/> </>} />
          <Route path="/addseller" element={<> <MenuSidebar/> <AddSellers/></>} />
          <Route path="/addseller/:id" element={<> <MenuSidebar/> <AddSellers/></>} />

          <Route path="/buyer-list" element={<> <MenuSidebar/> <ListBuysers/> </>} />
          <Route path="/addbuyer" element={<> <MenuSidebar/> <AddBuysers/></>} />
          <Route path="/addbuyer/:id" element={<> <MenuSidebar/> <AddBuysers/></>} />

          <Route path="/followup-list" element={<> <MenuSidebar/> <ListFollowup/> </>} />
          <Route path="/addfollowup" element={<> <MenuSidebar/> <AddFollowup/></>} />
          <Route path="/addfollowup/:id" element={<> <MenuSidebar/> <AddFollowup/></>} />

          <Route path="/dealcomplete-list" element={<> <MenuSidebar/> <ListDealComplete/> </>} />
          <Route path="/adddealcomplete" element={<> <MenuSidebar/> <AddDealComplete/></>} />
          <Route path="/adddealcomplete/:id" element={<> <MenuSidebar/> <AddDealComplete/></>} />

          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </BrowserRouter>
      </div>
    </>
  );
}
