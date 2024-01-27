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
import dayjs from "dayjs";

export default function ListFollowup() {

    const theme = useTheme();
    const navigate = useNavigate();
    const colors = tokens(theme.palette.mode);
    const [information, setInformation] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        getFilter();
    }, [])

    const getFilter = async () => {
        setLoading(true);
        await axios(API.followupfilterurl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem('authorization')
            },
            data: JSON.stringify({})
        })
            .then((response) => {
                setInformation(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log('Customer HandleSubmit Error =>', error);
            })


    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const columnVisible = {
        _id: false
    }

    const columns = [
        { field: "_id", headerName: "ID", hideable: false, filterable: false },
        {
            field: "customerid.fullname",
            headerName: "Customer Name",
            hideable: false,
            flex: 1,
            valueGetter: ({ row }) => row.customerid.fullname
        },
        {
            field: "userid.fullname",
            headerName: "User Name",
            flex: 1,
            valueGetter: ({ row }) => row.userid.fullname
        },
        {
            field: "followupdate",
            headerName: "Date",
            flex: 1,
            valueGetter: ({ row }) => dayjs(row.followupdate).format('DD/MM/YYYY'),
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
                        <Button type="submit" onClick={() => { navigate(`/addfollowup/${params.row._id}`); }}>
                            View
                        </Button>
                    </>
                );
            },
        },
    ];

    return (
        <>
            {
                loading ? <Loader /> :


                    <div className="container-fluid">
                        <div className="row">

                            <div className='col-md-12 mt-4' style={{ marginRight: "20px" }}>
                                <div className="row">
                                    <div className="col-6">
                                        <h3> Followup List</h3>
                                    </div>
                                    <div className="col-6 text-end">
                                        <Button variant="outlined" type="submit"
                                            startIcon={<AddIcon />}
                                            onClick={(e) => { e.preventDefault(); navigate("/addfollowup"); }}
                                        >
                                            Add Followup
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
                                            rows={information}
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
