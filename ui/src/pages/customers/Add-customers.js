import React from 'react';
import Button from 'react-bootstrap/Button';
import API from '../../apilist.js';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../shared/Loader.js';


export default function AddCustomers() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [mobile, setMobile] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const HandleSubmit = async (type) => {

        if (type === "save") {

            let URL = id ? API.customerurl + `${id}` : API.customerurl;
            let METHOD = id ? "PATCH" : "POST";
            await axios(URL, {
                method: METHOD,
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem('authorization')
                },
                data: JSON.stringify({
                    fullname: name,
                    property: {
                        email: email,
                        mobile: mobile,
                        address: address
                    }
                })
            })
                .then((response) => {
                    navigate("/customer-list");
                })
                .catch((error) => {
                    navigate("/customer-list");
                    console.log('Customer HandleSubmit Error =>', error);
                })

        } else {
            navigate("/customer-list");
        }

    }

    React.useEffect(() => {

        if (id) {

            getId();
            async function getId() {
                setLoading(true);
                await axios(API.customerurl + `${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": localStorage.getItem('authorization')
                    },
                    data: JSON.stringify({})
                })
                    .then((response) => {
                        setName(response && response.data && response.data.fullname ? response.data.fullname : "");
                        setEmail(response && response.data && response.data.property && response.data.property.email ? response.data.property.email : "");
                        setMobile(response && response.data && response.data.property && response.data.property.mobile ? response.data.property.mobile : "");
                        setAddress(response && response.data && response.data.property && response.data.property.address ? response.data.property.address : "");

                        setLoading(false);
                    })
                    .catch((error) => {
                        console.log('Customer HandleSubmit Error =>', error);
                    })

            }
        }
    }, [id])

    return (
        <>

            {
                loading ? <Loader /> :
                    <div className='container-fluid'>

                        <div className='row justify-content-center align-items-center mt-5'>
                            <div className='col-md-9'>
                                <h3>Add Customer</h3>
                            </div>
                        </div>

                        <div className='row justify-content-center align-items-center mt-4'>

                            <div className='col-md-9'>

                                <div className="col-12 mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text"
                                        className="form-control"
                                        required
                                        value={name}
                                        onChange={(e) => { setName(e.target.value) }} />
                                </div>

                                <div className="col-12" >
                                    <div className='row'>

                                        <div className="col-6 mb-3">
                                            <label htmlFor="mobile" className="form-label">Mobile</label>
                                            <input type="tel"
                                                className="form-control"
                                                required
                                                value={mobile}
                                                onChange={(e) => { setMobile(e.target.value) }} />
                                        </div>

                                        <div className="col-6 mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input type="email"
                                                className="form-control"
                                                required
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value) }} />
                                        </div>
                                    </div>

                                </div>

                                <div className="col-12 mb-3">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <textarea className="form-control" id="exampleFormControlTextarea1" value={address}
                                        onChange={(e) => { setAddress(e.target.value) }} rows="3"></textarea>
                                </div>

                                <div className="col-12 mb-3">
                                    <div className='row flex-row-reverse'>

                                        <div className='col-1'>
                                            <Button className="btn btn-primary mr-3" type="submit" onClick={(e) => { e.preventDefault(); HandleSubmit("save") }}>
                                                Save
                                            </Button>
                                        </div>

                                        <div className='col-1'>
                                            <Button className="btn btn-danger" type="submit" onClick={(e) => { e.preventDefault(); HandleSubmit("cancel") }}>
                                                Cancel
                                            </Button>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
            }

        </>
    );
}