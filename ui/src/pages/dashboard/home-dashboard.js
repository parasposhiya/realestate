import React from "react";
import axios from "axios";
import Loader from "../../shared/Loader.js";
import API from "../../apilist.js";
import Card from 'react-bootstrap/Card';


export default function HomeDashboard() {

  const [dashboardData, setDashboardData] = React.useState([]);
  const [dashboardDataLoadinng, setDashboardDataLoading] = React.useState(true);

  React.useEffect(() => {

    getDashboardData();
    async function getDashboardData() {
      setDashboardDataLoading(true);
      setDashboardData([]);
      await axios(API.dashboardurl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": localStorage.getItem('authorization')
        },
        data: JSON.stringify({})
      })
        .then((response) => {
          setDashboardData(response.data);
          setDashboardDataLoading(false);
        })
        .catch((error) => {
          console.log('Customer HandleSubmit Error =>', error);
        })


    }
  }, [])

  return (
    <>
      {dashboardDataLoadinng ? <Loader /> :

        <div className="container-fuild" style={{ marginLeft: "2%" }}>

          <div className="row mt-3">

            <div className="col-md-12" style={{ display: "flex", flex: 1 }}>
              {
                dashboardData.map((data, key) => {
                  return (
                    <div key={key}>
                      <Card style={{ marginLeft: "11px" }}>
                        <Card.Body>
                          <Card.Title>{data.title}</Card.Title>
                          <Card.Text>
                            {data.total}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                  )
                })
              }
            </div>

          </div>

        </div>

      }
    </>
  );
}
