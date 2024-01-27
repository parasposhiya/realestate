import React from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../shared/theme.js";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import API from "../../apilist.js";
import axios from "axios";
import Loader from "../../shared/Loader.js";

export default function ListCustomers() {

    const theme = useTheme();
    const navigate = useNavigate();
    const colors = tokens(theme.palette.mode);
    const [customerData, setCustomerData] = React.useState([]);
    const [customerDataLoader, setCustomerDataLoader] = React.useState(true);

    React.useEffect(() => {
        getFilter();
    }, [])

    const getFilter = async () => {
        setCustomerDataLoader(true);
        await axios(API.customerdatafilterurl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem('authorization')
            },
            data: JSON.stringify({})
        })
            .then((response) => {
                setCustomerData(response.data);
                setCustomerDataLoader(false);
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
            field: "memberno",
            headerName: "Customer No",
            hideable: false,
            flex: 1,
        },
        {
            field: "fullname",
            headerName: "Name",
            flex: 1,
        },
        {
            field: "property.mobile",
            headerName: "Mobile",
            flex: 1,
            valueGetter: ({ row }) => row.property.mobile
        },
        {
            field: "property.email",
            headerName: "Email",
            flex: 1,
            valueGetter: ({ row }) => row.property.email
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
                        <Button type="submit" onClick={() => { navigate(`/addcustomer/${params.row._id}`); }}>
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
                customerDataLoader ? <Loader /> :


                    <div className="container-fluid">
                        <div className="row">

                            <div className='col-md-12 mt-4' style={{ marginRight: "20px" }}>
                                <div className="row">
                                    <div className="col-6">
                                        <h3> Customer List</h3>
                                    </div>
                                    <div className="col-6 text-end">
                                        <Button variant="outlined" type="submit"
                                            startIcon={<AddIcon />}
                                            onClick={(e) => { e.preventDefault(); navigate("/addcustomer"); }}
                                        >
                                            Add Customer
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
                                            rows={customerData}
                                            columns={columns}
                                            density="compact"
                                            getRowId={(row) => row._id}
                                            components={{ Toolbar: GridToolbar }}
                                            columnVisibilityModel={columnVisible}
                                            // rowsPerPageOptions={[10, 20, 50]}
                                            // pageSize={pageSize}
                                            // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                            // pagination
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
