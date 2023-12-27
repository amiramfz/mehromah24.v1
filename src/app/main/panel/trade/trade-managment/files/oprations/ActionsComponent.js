import { Box, IconButton, styled } from "@mui/material";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect } from "react";
import DataObjectIcon from "@mui/icons-material/DataObject";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { base_url } from "src/app/constant";
import CircularIndeterminate from "src/app/custom-components/CircularProgress";
import { convertToPersianDate } from "./functions";

const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
export const ActionsComponent = (props) => {
  const [actions, setActions] = useState([]);
  function getActions() {
    props.setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/logs", {
        access_token: getAccessToken(),
        action: [
          {
            type: "reference",
            id: props.refrence.serial_id,
          },
        ],
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item Created", response.data);
        setActions(response.data.data);
        props.setShowProgressLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    getActions();
  }, [props.selectedActionsComponent]);
  //for dialog
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const [dataLog, setDataLog] = useState("");
  function handleShowData() {
    handleClickOpenDialog();
  }
  return (
    <>
      {/*  dialog */}
      <div style={{ with: "100%" }}>
        <BootstrapDialog
          onClose={handleCloseDialog}
          aria-labelledby="customized-dialog-title"
          open={openDialog}
          fullWidth={true}
          maxWidth={"xl"}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            داده ها
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>{dataLog}</DialogContent>
        </BootstrapDialog>
      </div>
      {/* end  dialog */}
      {/* start data table for passengers */}
      <div className="card">
        <DataTable
          //   value={props.refrence.pledgers}
          value={actions}
          showGridlines
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            header="#"
            body={(rowData, { rowIndex }) => <span>{rowIndex + 1}</span>}
            style={{ textAlign: "center", fontSize: "14px" }}
          />
          <Column
            body={(rowData) => (
              <div>
                <span>
                  {convertToPersianDate(rowData.created_at)}
                  <br />
                </span>
              </div>
            )}
            style={{ fontSize: "12px", textAlign: "right" }}
            header="زمان"
          ></Column>
          <Column
            field="amount"
            body={(rowData) => (
              <div>
                <span>
                  {rowData.type}
                  <br />
                </span>
              </div>
            )}
            style={{ fontSize: "12px" }}
            header="عملیات"
          ></Column>

          <Column
            body={(rowData) => (
              <div>
                <span>
                  {rowData.first_name +
                    " " +
                    rowData.last_name +
                    " - " +
                    rowData.personnel_id}
                  <br />
                </span>
              </div>
            )}
            style={{ textAlign: "right", fontSize: "12px" }}
            header="کاربر"
          ></Column>
          <Column
            body={(rowData) => (
              <div>
                <span>
                  {rowData.ip}
                  <br />
                </span>
              </div>
            )}
            style={{ fontSize: "12px" }}
            header="ip"
          ></Column>
          <Column
            body={(rowData) => (
              <div>
                <span>
                  {rowData.browser}
                  <br />
                </span>
              </div>
            )}
            style={{ fontSize: "12px" }}
            header="browser"
          ></Column>
          <Column
            body={(rowData) => (
              <Box
                display={"flex"}
                flexDirection={"row"}
                gap={1}
                height={"100%"}
                width="100%"
                justifyContent={"center"}
                alignItems={"center"}
              >
                <IconButton
                  onClick={() => {
                    setDataLog(JSON.parse(rowData.description).toString());
                    handleShowData();
                  }}
                  variant="solid"
                >
                  <DataObjectIcon />
                </IconButton>
              </Box>
            )}
            style={{ textAlign: "right", fontSize: "12px" }}
            header="داده ها"
          ></Column>
        </DataTable>
      </div>
      {/* end data table for passengers */}
    </>
  );
};

const data = [
  {
    id: 1,
    time: "2023-10-15 08:30:45",
    action: "Login",
    user: "جان دو 123",
    ip: "192.168.0.1",
    browser: "Chrome 99.0",
    data: `{"id": "colleague","text": "همکار" }`,
  },
  {
    id: 2,
    time: "2023-10-15 10:15:20",
    action: "Update Profile",
    user: "جین اسمیت 456",
    ip: "10.0.0.2",
    browser: "Firefox 78.0",
    data: `{"id": "colleague","text": "همکار" }`,
  },
  {
    id: 3,
    time: "2023-10-15 12:45:55",
    action: "Logout",
    user: "کاربر 789",
    ip: "192.168.0.10",
    browser: "Safari 15.0",
    data: `{"id": "colleague","text": "همکار" }`,
  },
  // Add more objects as needed
];
