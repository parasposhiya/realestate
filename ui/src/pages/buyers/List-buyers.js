import React from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../shared/theme.js";
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Loader from "../../shared/Loader.js";
import axios from "axios";
import API from "../../apilist.js";

export default function ListBuyers() {

  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);

  const [buyerDataLoader, setBuyerDataLoader] = React.useState(true);
  const [buyerData, setBuyerData] = React.useState(true);


  React.useEffect(() => {
    getFilter();
  }, [])

  const getFilter = async () => {
    setBuyerDataLoader(true);
    await axios(API.buyerfilterurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": localStorage.getItem('authorization')
      },
      data: JSON.stringify({})
    })
      .then((response) => {
        setBuyerData(response.data);
        setBuyerDataLoader(false);
      })
      .catch((error) => {
        console.log('Customer HandleSubmit Error =>', error);
      })
  }

  const columnVisible = {
    _id: false
  }

  const columns = [
    { field: "_id", headerName: "ID", hideable: false, filterable: false },
    {
      field: "customerid.fullname",
      headerName: "Name",
      flex: 1,
      valueGetter: ({ row }) => row.customerid.fullname
    },
    {
      field: "property.facing",
      headerName: "Facing",
      flex: 1,
      valueGetter: ({ row }) => row.property.facing
    },
    {
      field: "property.coveredarea",
      headerName: "Covered Area (sqft)",
      flex: 1,
      valueGetter: ({ row }) => row.property.coveredarea
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      valueGetter: ({ row }) => capitalizeFirstLetter(row.status)
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Button type="submit" onClick={() => { navigate(`/addbuyer/${params.row._id}`); }}>
              View
            </Button>
          </>
        );
      },
    },
  ];

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <>
      {
        buyerDataLoader ? <Loader /> :

          <div className="container-fluid">
            <div className="row">

              <div className='col-md-12 mt-4' style={{ marginRight: "20px" }}>
                <div className="row">
                  <div className="col-6">
                    <h3> Buyer List</h3>
                  </div>
                  <div className="col-6 text-end">
                    <Button variant="outlined" type="submit"
                      startIcon={<AddIcon />}
                      onClick={(e) => { e.preventDefault(); navigate("/addbuyer"); }}
                    >
                      Add Buyer
                    </Button>
                  </div>
                </div>
              </div>

              <div className='col-md-12 mt-2'>
                <Box>
                  <Box
                    m="5px 11px 11px 6px"
                    height="87%"
                    position={"absolute"}
                    width="81%"
                    sx={{
                      "& .MuiDataGrid-root": {
                        border: "none",
                      },
                      "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                      },
                      "& .name-column--cell": {
                        color: colors.greenAccent[300],
                      },
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                      },
                      "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                      },
                      "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                      },
                      "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                      },
                    }}
                  >
                    <DataGrid
                      disableColumnMenu
                      rows={buyerData}
                      columns={columns}
                      density="compact"
                      getRowId={(row) => row._id}
                      components={{ Toolbar: GridToolbar }}
                      columnVisibilityModel={columnVisible}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                          printOptions: { disableToolbarButton: true }
                        },
                      }}

                    />
                  </Box>
                </Box>
              </div>
            </div>
          </div>
      }
    </>
  );
}
