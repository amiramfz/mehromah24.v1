import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Typography from '@mui/material/Typography';


const formatInputWithCommas = (input) => {
    if (!input) {
        return input;
    }
    const cleanValue = input.toString().replace(/[^\d]/g, "");
    const formattedValue = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedValue;
};

const Table = (props) => {

    const chartData = props.chartData
    const totlal = props.chartDataTotal
    const title = props.title


    return (<>
        {/* {"TableOfOperators"} */}

        <div className="card" style={{ width: "100%" }}>
            <Typography className="text-2xl md:text-3xl font-semibold tracking-tight leading-7">
                {title}
            </Typography>
            <br />
            <DataTable value={chartData} tableStyle={{ Width: '100%', fontSize: "1.2rem", textAlign: "center", justifyContent: "center" }} rows={10} >
                <Column
                    header="#"
                    body={(rowData, { rowIndex }) => <span>{rowIndex + 1}</span>}
                    style={{ textAlign: "center", fontSize: "14px" }}
                />
                <Column
                    style={{ width: '15%', fontSize: "14px", direction: "rtl" }}
                    header="اپراتور"
                    body={(rowData) => (
                        <div>
                            <span
                                style={{
                                    lineHeight: "26px",
                                    fontSize: "1.3rem",
                                    display: "flex",
                                    textAlign: "right",
                                    fontWeight: "700",
                                }}
                            >
                                {rowData.Title}
                            </span>
                        </div>
                    )}
                />
                <Column
                    field="refrences"
                    style={{ width: '5%', fontSize: "14px" }}
                    header="رفرنس ها"
                    body={(chartData) => (
                        <div>
                            <span
                                style={{
                                    fontSize: "1.4rem",
                                    lineHeight: "26px",
                                }}
                            >
                                {chartData.Financial.CountReferences}
                            </span>
                        </div>
                    )}
                    footer={formatInputWithCommas(
                        totlal.References.toString()
                    )}
                />
                <Column
                    style={{ width: '5%', fontSize: "14px", justifyContent: "center" }}
                    header="نفرات"
                    body={(chartData) => (
                        <div>
                            <span
                                style={{
                                    lineHeight: "26px",
                                    fontSize: "1.3rem",
                                }}
                            >
                                {chartData.Financial.TotalPassenger}
                            </span>
                        </div>
                    )}
                    footer={formatInputWithCommas(
                        totlal.Passenger.toString()
                    )}
                />
                <Column
                    field="refrences"
                    style={{ width: '8%', fontSize: "14px" }}
                    header=" خرید"
                    body={(chartData) => (
                        <div>
                            <span
                                style={{
                                    lineHeight: "26px",
                                    fontSize: "1.3rem",
                                }}
                            >
                                {
                                    formatInputWithCommas(
                                        chartData.Financial.TotalBuy.toString()
                                    )}
                            </span>
                        </div>
                    )}
                    footer={formatInputWithCommas(
                        totlal.Buy.toString()
                    )}
                />
                <Column
                    style={{ width: '8%', fontSize: "14px" }}
                    header="فروش"
                    body={(chartData) => (
                        <div>
                            <span
                                style={{
                                    lineHeight: "26px",
                                }}
                            >{
                                    formatInputWithCommas(
                                        chartData.Financial.TotalSale.toString()
                                    )}
                            </span>
                        </div>
                    )}
                    footer={formatInputWithCommas(
                        totlal.Sale.toString()
                    )}
                />
                <Column
                    field="refrences"
                    style={{ width: '10%', fontSize: "14px" }}
                    header="سود/زیان ناخالص"
                    body={(chartData) => (
                        <div>
                            <span
                                style={{
                                    color: "green",
                                    display:
                                        chartData.Financial.TotalProfit > 0 ? "" : "none",
                                }}
                            >{
                                    formatInputWithCommas(
                                        chartData.Financial.TotalProfit.toString()
                                    )}
                            </span>
                            <span
                                style={{
                                    lineHeight: "26px",
                                    color: "red",
                                    display:
                                        chartData.Financial.TotalProfit <= 0 ? "" : "none",
                                }}
                            >
                                {
                                    formatInputWithCommas(
                                        chartData.Financial.TotalProfit.toString()
                                    )}
                            </span>
                        </div>
                    )}
                    footer={(chartData) => (
                        <div>
                            <span
                                style={{
                                    lineHeight: "26px",
                                    color: "green",
                                    display:
                                        totlal.Profit > 0 ? "" : "none",
                                }}
                            >
                                {formatInputWithCommas(
                                    totlal.Profit.toString()
                                )}
                            </span>
                            <span
                                style={{
                                    color: "red",
                                    display:
                                        totlal.Profit <= 0 ? "" : "none",
                                }}
                            >{formatInputWithCommas(
                                totlal.Profit.toString()
                            )}
                            </span>
                        </div>
                    )}
                />
                <Column
                    field="refrences"
                    style={{ width: '10%', fontSize: "14px" }}
                    header="سود/زیان خالص"
                    body={(chartData) => (
                        <div>

                            <span
                                style={{
                                    lineHeight: "26px",
                                    color: "green",
                                    display:
                                        chartData.Financial.TotalProfit - chartData.Financial.TotalWage > 0 ? "" : "none",
                                }}
                            >{
                                    formatInputWithCommas(
                                        chartData.Financial.TotalProfit - chartData.Financial.TotalWage.toString()
                                    )}
                            </span>
                            <span
                                style={{
                                    color: "red",
                                    display:
                                        chartData.Financial.TotalProfit - chartData.Financial.TotalWage <= 0 ? "" : "none",
                                }}
                            >{
                                    formatInputWithCommas(
                                        chartData.Financial.TotalProfit - chartData.Financial.TotalWage.toString()
                                    )}
                            </span>
                        </div>
                    )}
                    footer={(chartData) => (
                        <div>
                            <span
                                style={{
                                    lineHeight: "26px",
                                    color: "green",
                                    display:
                                        (totlal.Profit - totlal.Wage) > 0 ? "" : "none",
                                }}
                            >
                                {formatInputWithCommas(
                                    (totlal.Profit - totlal.Wage).toString()
                                )}
                            </span>
                            <span
                                style={{
                                    color: "red",
                                    display:
                                        (totlal.Profit - totlal.Wage) <= 0 ? "" : "none",
                                }}
                            >{formatInputWithCommas(
                                (totlal.Profit - totlal.Wage).toString()
                            )}
                            </span>
                        </div>
                    )}
                />
                <Column
                    field="profit"
                    style={{ width: '5%', fontSize: "14px" }}
                    header="درصد سود"
                    body={(chartData) => (
                        <div>
                            <span
                                style={{
                                    lineHeight: "26px",
                                    color: "green",
                                    display:
                                        Math.round((chartData.Financial.TotalSale - chartData.Financial.TotalBuy) / (chartData.Financial.TotalBuy) * 100) > 0 ? "" : "none",
                                }}
                            >
                                {
                                    Math.round((chartData.Financial.TotalSale - chartData.Financial.TotalBuy) / (chartData.Financial.TotalBuy) * 100)
                                }%
                            </span>
                            <span
                                style={{
                                    color: "red",
                                    display:
                                        (Math.round((chartData.Financial.TotalSale - chartData.Financial.TotalBuy) / (chartData.Financial.TotalBuy) * 100)) <= 0 ? "" : "none",
                                }}
                            >{
                                    Math.round((chartData.Financial.TotalSale - chartData.Financial.TotalBuy) / (chartData.Financial.TotalBuy) * 100)
                                }%
                            </span>
                        </div>
                    )}
                    footer={(chartData) => (
                        <div>
                            <span
                                style={{
                                    lineHeight: "26px",
                                    color: "green",
                                    display:
                                        Math.round((totlal.Sale - totlal.Buy) / (totlal.Buy) * 100) > 0 ? "" : "none",
                                }}
                            >
                                {
                                    Math.round((totlal.Sale - totlal.Buy) / (totlal.Buy) * 100)
                                }%
                            </span>
                            <span
                                style={{
                                    color: "red",
                                    display:
                                        (Math.round((totlal.Sale - totlal.Buy) / (totlal.Buy) * 100)) <= 0 ? "" : "none",
                                }}
                            >{
                                    Math.round((totlal.Sale - totlal.Buy) / (totlal.Buy) * 100)
                                }%
                            </span>
                        </div>
                    )}
                />
                <Column
                    style={{ width: '2%', fontSize: "14px" }}
                    header="کارمزد خدمات"
                    body={(chartData) => (
                        <div>
                            <span
                                style={{
                                    lineHeight: "26px",

                                }}
                            >{
                                    formatInputWithCommas(
                                        chartData.Financial.TotalDebit.toString()
                                    )}
                            </span>
                        </div>
                    )}
                    footer={formatInputWithCommas(
                        totlal.Buy.toString()
                    )}
                />
                <Column
                    field="Payments"
                    style={{ width: '10%', fontSize: "14px" }}
                    header="پرداخت ها"
                    body={(chartData) => (
                        <div>
                            <span
                                style={{
                                    lineHeight: "26px",
                                }}
                            >{
                                    formatInputWithCommas(
                                        chartData.Financial.TotalDebit.toString()
                                    )}
                            </span>
                        </div>
                    )}
                    footer={formatInputWithCommas(
                        totlal.Debit.toString()
                    )}
                />
                <Column
                    style={{ width: '10%', fontSize: "14px" }}
                    header="دریافتی ها"
                    body={(chartData) => (
                        <div>
                            <span
                                style={{
                                    lineHeight: "26px",
                                }}
                            >
                                {
                                    formatInputWithCommas(
                                        chartData.Financial.TotalCredit.toString()
                                    )}
                            </span>
                        </div>
                    )}
                    footer={formatInputWithCommas(
                        totlal.Credit.toString()
                    )}
                />
            </DataTable>
        </div>
    </>
    );
};

export default Table;

















