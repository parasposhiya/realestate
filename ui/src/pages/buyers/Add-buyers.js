import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Loader from '../../shared/Loader.js';
import API from '../../apilist.js';
import Form from 'react-bootstrap/Form';
import { useNavigate, useParams } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';

export default function AddBuyers() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);

  const [optionsCustomer, setOptionsCustomer] = React.useState([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState({});

  const [optionsFacing, setOptionsFacing] = React.useState([]);
  const [selectedFacing, setSelectedFacing] = React.useState({});

  const [coveredArea, setCoveredArea] = React.useState(0);

  React.useEffect(() => {

    if (id) {
      getId();

      async function getId() {
        setLoading(true);
        await axios(API.buyerurl + `${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem('authorization')
          },
          data: JSON.stringify({})
        })
          .then((response) => {
            setSelectedCustomer(response && response.data && response.data.customerid ? response.data.customerid : {});
            setSelectedFacing(response && response.data && response.data.property && response.data.property.facing ? { name: response.data.property.facing } : {});
            setCoveredArea(response && response.data && response.data.property && response.data.property.coveredarea ? response.data.property.coveredarea : 0);
            setLoading(false);
          })
          .catch((error) => {
            console.log('Seller HandleSubmit Error =>', error);
          })
      }
    }
    getLookupStatus();
    getCustomer();

  }, [id])

  const getLookupStatus = async () => {
    await axios(API.lookupurl + `/658907b69abf7703fd3ce680`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": localStorage.getItem('authorization')
      },
      data: JSON.stringify({})
    })
      .then((response) => {
        setOptionsFacing(response && response.data && response.data.data ? response.data.data : []);
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

  const HandleSubmit = async (type) => {

    if (type === "save") {
      let URL = id ? API.buyerurl + `${id}` : API.buyerurl;
      let METHOD = id ? "PATCH" : "POST";
      await axios(URL, {
        method: METHOD,
        headers: {
          "Content-Type": "application/json",
          "authorization": localStorage.getItem('authorization')
        },
        data: JSON.stringify({
          customerid: selectedCustomer._id,
          property: {
            facing: selectedFacing.name,
            coveredarea: coveredArea
          }
        })
      })
        .then((response) => {
          navigate("/buyer-list");
        })
        .catch((error) => {
          navigate("/buyer-list");
          console.log('Customer HandleSubmit Error =>', error);
        })
    } else {
      navigate("/buyer-list");
    }

  }

  return (
    <>
      {
        loading ? <Loader /> :

          <div className='container-fluid'>

            <div className='row justify-content-center align-items-center mt-5'>
              <div className='col-md-9'>
                <h3>Add Buyer</h3>
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

                <div className="col-12" >
                  <div className='row'>

                    <div className="col-6 mb-3">
                      <Form>
                        <Form.Group>
                          <Form.Label>Facing</Form.Label>
                          <Typeahead
                            id="basic-typeahead-single"
                            labelKey="name"
                            options={optionsFacing}
                            onChange={(value) => setSelectedFacing(value && value[0] ? value[0] : {})}
                            placeholder="Status"
                            defaultInputValue={selectedFacing.name || ''}
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
                      <label htmlFor="number" className="form-label">Covered Area (sqft)</label>
                      <input type="number"
                        className="form-control"
                        required
                        value={coveredArea}
                        onChange={(e) => { setCoveredArea(e.target.value) }} />
                    </div>
                  </div>

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
