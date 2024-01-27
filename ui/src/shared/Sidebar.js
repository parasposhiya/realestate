import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { FaUser, FaIdeal } from "react-icons/fa";
import { FaSellsy, FaGripLines } from "react-icons/fa6";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { RiChatFollowUpLine } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

export default function MenuSidebar() {

    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('authorization') && localStorage.getItem('authorization') !== null ? true : false;
    const [collapsed, setCollapsed] = React.useState(false);

    const handleToggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const Logout = () => {
        localStorage.clear();
        navigate("/");
    }

    let dashboardmenu = (window.location.href.toString().search("dashboard") > 0) ? true : false;
    let customermenu = (window.location.href.toString().search("customer-list") > 0) ? true : false;
    let sellermenu = (window.location.href.toString().search("seller-list") > 0) ? true : false;
    let buyermenu = (window.location.href.toString().search("buyer-list") > 0) ? true : false;
    let followupmenu = (window.location.href.toString().search("followup-list") > 0) ? true : false;
    let dealcompletemenu = (window.location.href.toString().search("dealcomplete-list") > 0) ? true : false;

    return (
        <>
            <div style={{ display: 'flex', height: '100vh' }} >
                <Sidebar collapsed={collapsed}>
                    <Menu 
                    menuItemStyles={{
                        button: ({ active }) => {
                                return {
                                    backgroundColor: active ? "#c3c6fd" : undefined,
                                };
                        },
                    }}
                    >

                        <MenuItem icon={<FaGripLines onClick={handleToggleSidebar} />} className='menu1'> <h2>Real Estate</h2> </MenuItem>

                        <MenuItem active={dashboardmenu} icon={<MdDashboard />} component={isLoggedIn ? <Link to="/dashboard" /> : <Link to="/" />}> Dashboard </MenuItem>
                        <MenuItem active={customermenu} icon={<FaUser />} component={isLoggedIn ? <Link to="/customer-list" /> : <Link to="/" />}> Customer </MenuItem>
                        <MenuItem active={sellermenu} icon={<FaSellsy />} component={isLoggedIn ? <Link to="/seller-list" /> : <Link to="/" />}> Seller </MenuItem>
                        <MenuItem active={buyermenu} icon={<BiSolidPurchaseTag />} component={isLoggedIn ? <Link to="/buyer-list" /> : <Link to="/" />}> Buyer </MenuItem>
                        <MenuItem active={followupmenu} icon={<RiChatFollowUpLine />} component={isLoggedIn ? <Link to="/followup-list" /> : <Link to="/" />}> Followup </MenuItem>
                        <MenuItem active={dealcompletemenu} icon={<FaIdeal />} component={isLoggedIn ? <Link to="/dealcomplete-list" /> : <Link to="/" />}> Deal Complete </MenuItem>

                        <MenuItem icon={<TbLogout />} onClick={Logout} > Logout </MenuItem>

                    </Menu>
                </Sidebar>
            </div>
        </>
    );

}
