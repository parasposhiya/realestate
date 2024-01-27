import React from 'react';
import { Button, Form } from 'react-bootstrap';
import API from '../../apilist.js';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../shared/Loader.js';
import { Typeahead } from 'react-bootstrap-typeahead';


export default function AddFollowup() {

    const { id } = useParams();
    const navigate = useNavigate();

    let date = new Date();
    const [loading, setLoading] = React.useState(false);

    const [description, setDescription] = React.useState("");
    const [followupdate, setFollowupDate] = React.useState((date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()).toString());

    const [optionsCustomer, setOptionsCustomer] = React.useState([]);
    const [selectedCustomer, setSelectedCustomer] = React.useState({});

    const [optionsUser, setOptionsUser] = React.useState([]);
    const [selectedUser, setSelectedUser] = React.useState({});

    const [optionsStatus, setOptionsStatus] = React.useState([]);
    const [selectedStatus, setSelectedStatus] = React.useState({});


    React.useEffect(() => {

        if (id) {
            getId();

            async function getId() {
                setLoading(true);
                await axios(API.followupurl + `${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": localStorage.getItem('authorization')
                    },
                    data: JSON.stringify({})
                })
                    .then((response) => {
                        setSelectedCustomer(response && response.data && response.data.customerid ? response.data.customerid : {});
                        setSelectedUser(response && response.data && response.data.userid ? response.data.userid : {});
                        setFollowupDate(response && response.data && response.data.followupdate ? (new Date(response.data.followupdate).getFullYear() + "-" + (new Date(response.data.followupdate).getMonth() + 1) + "-" + new Date(response.data.followupdate).getDate()).toString() : "");
                        setSelectedStatus(response && response.data && response.data.status ? { name: response.data.status } : {});
                        setDescription(response && response.data && response.data.property && response.data.property.description ? response.data.property.description : "");

                        setLoading(false);
                    })
                    .catch((error) => {
                        console.log('Customer HandleSubmit Error =>', error);
                    })
            }
        }

        getLookupStatus();
        getCustomer();
        getUser();
    }, [id])

    const getLookupStatus = async () => {
        await axios(API.lookupurl + `/6590ee322368054d59295da8`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem('authorization')
            },
            data: JSON.stringify({})
        })
            .then((response) => {
                setOptionsStatus(response && response.data && response.data.data ? response.data.data : []);
            })
            .catch((error) => {
                console.log('Cusotmer handleSearch Error =>', error);
            })
    }

    const getCustomer = async () => {

        await axios(API.customerdatafilterurl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem('authorization')
            },
            data: JSON.stringify({
                "select": [
                    { "fieldname": "_id", "value": 1 },
                    { "fieldname": "fullname", "value": 1 },
                    { "fieldname": "property.mobile", "value": 1 },
                    { "fieldname": "property.email", "value": 1 },
                ]
            })
        })
            .then((response) => {
                setOptionsCustomer(response && response.data ? response.data : []);
            })
            .catch((error) => {
                console.log('Cusotmer handleSearch Error =>', error);
            })
    }

    const getUser = async () => {

        await axios(API.userfilterurl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem('authorization')
            },
            data: JSON.stringify({
                "select": [
                    { "fieldname": "_id", "value": 1 },
                    { "fieldname": "fullname", "value": 1 },
                    { "fieldname": "property.mobile", "value": 1 },
                    { "fieldname": "property.email", "value": 1 },
                ]
            })
        })
            .then((response) => {
                setOptionsUser(response && response.data ? response.data : []);
            })
            .catch((error) => {
                console.log('Cusotmer handleSearch Error =>', error);
            })
    }

    const HandleSubmit = async (type) => {

        if (type === "save") {

            let URL = id ? API.followupurl + `${id}` : API.followupurl;
            let METHOD = id ? "PATCH" : "POST";
            await axios(URL, {
                method: METHOD,
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem('authorization')
                },
                data: JSON.stringify({
                    customerid: selectedCustomer._id,
                    userid: selectedUser._id,
                    followupdate: followupdate,
                    status: selectedStatus.name,
                    property: {
                        description: description
                    }
                })
            })
                .then((response) => {
                    navigate("/followup-list");
                })
                .catch((error) => {
                    navigate("/followup-list");
                    console.log('Customer HandleSubmit Error =>', error);
                })

        } else {
            navigate("/followup-list");
        }

    }


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
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>Customer</Form.Label>
                                            <Typeahead
                                                id="basic-typeahead-single"
                                                labelKey="fullname"
                                                options={optionsCustomer}
                                                onChange={(value) => setSelectedCustomer(value && value[0] ? value[0] : {})}
                                                placeholder="Customer"
                                                defaultInputValue={selectedCustomer.fullname || ''}
                                                renderMenuItemChildren={(option) => (
                                                    <div>
                                                        {option?.fullname} - {option?.property?.mobile} - {option?.property?.email}
                                                    </div>
                                                )}
                                            />
                                        </Form.Group>
                                    </Form>
                                </div>

                                <div className="col-12 mb-3">
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>User</Form.Label>
                                            <Typeahead
                                                id="basic-typeahead-single"
                                                labelKey="fullname"
                                                options={optionsUser}
                                                onChange={(value) => setSelectedUser(value && value[0] ? value[0] : {})}
                                                placeholder="Customer"
                                                defaultInputValue={selectedUser.fullname || ''}
                                                renderMenuItemChildren={(option) => (
                                                    <div>
                                                        {option?.fullname} - {option?.property?.mobile} - {option?.property?.email}
                                                    </div>
                                                )}
                                            />
                                        </Form.Group>
                                    </Form>
                                </div>

                                <div className="col-12" >
                                    <div className='row'>

                                        <div className="col-6 mb-3">
                                            <Form>
                                                <Form.Group>
                                                    <Form.Label>Status</Form.Label>
                                                    <Typeahead
                                                        id="basic-typeahead-single"
                                                        labelKey="name"
                                                        options={optionsStatus}
                                                        onChange={(value) => setSelectedStatus(value && value[0] ? value[0] : {})}
                                                        placeholder="Status"
                                                        defaultInputValue={selectedStatus.name || ''}
                                                        renderMenuItemChildren={(option) => (
                                                            <div>
                                                                {option?.name}
                                                            </div>
                                                        )}
                                                    />
                                                </Form.Group>
                                            </Form>
                                        </div>

                                        <div className="col-6 mb-3">
                                            <label htmlFor="date" className="form-label">Date</label>
                                            <input type="date"
                                                value={followupdate}
                                                className="form-control"
                                                onChange={(e) => { setFollowupDate(e.target.value) }}
                                                required />
                                        </div>
                                    </div>

                                </div>

                                <div className="col-12 mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea type="text"
                                        className="form-control"
                                        required
                                        value={description}
                                        onChange={(e) => { setDescription(e.target.value) }} />
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