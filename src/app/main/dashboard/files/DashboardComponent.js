import { useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "src/app/constant";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import CircularIndeterminate from "src/app/custom-components/CircularProgress";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { styled, ThemeProvider, useTheme } from '@mui/material/styles';
import { selectContrastMainTheme } from 'app/store/fuse/settingsSlice';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import TableHead from '@mui/material/TableHead';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


// const getAccessToken = () => {
//   return window.localStorage.getItem("jwt_access_token");
// };

const DashboardComponent = () => {
    const theme = useTheme();
    const contrastTheme = useSelector(selectContrastMainTheme(theme.palette.primary.dark));
    let data = {
        topCards: {
            firstCard: {
                title: "فروش های یک هفته گذشته",
                amount: 0,
                percent: 10
            },
            secondCard: {
                title: "تماس های امروز",
                amount: 0,
                percent: 50
            },
            thirdCard: {
                title: "مشتریان جدید امروز",
                amount: 0,
                percent: 30
            }
        },
        lineChart: {
            options: {
                xaxis: {
                    categories: [
                        "امیرحسین مالکی پور اصفهانی",
                        "مائده بهرامی",
                        "محسن چراغی",
                        "سمیه اداوی",
                        "احمد کاغذگران",
                        "فاطمه کیانی",
                        "لیلا فروردین",
                        "سمیه حجازی",
                        "احمد صالحی",
                        "انیسه حق شناس",
                        "ندا رحمانی",
                        "سمیه ابراهیمی",
                        "زهرا افشار",
                    ],
                    chart: {
                        fontFamily: 'inherit',
                        foreColor: 'inherit',
                    }
                },
                series: [
                    {
                        name: 'سود و زیان',
                        data: [1, 38, 59, 16, 50, 1, 6, 158, 49, 188, 11, 120, 17]
                    },
                    {
                        name: 'تعداد مسافرین',
                        data: [1, 18, 22, 6, 23, 1, 3, 80, 19, 97, 5, 37, 8]
                    },
                    {
                        name: 'تعداد رفرنس',
                        data: [-0.69, 50.82, 24.02, 10.59, 36.45, 0.29, 4.82, 59.84, -0.59, 111.63, 24.61, 63.5, 32.15]
                    }
                ],
                fill: {
                    colors: [contrastTheme.palette.secondary.dark],
                }

            }

        },
        options: {
            series: [
                {
                    name: "",
                    data: [-0.69, 50.82, 24.02, 10.59, 36.45, 0.29, 4.82, 59.84, -0.59, 111.63, 24.61, 63.5, 32.15],
                },
            ],
            xaxis: ['امیرحسین مالکی پور اصفهانی'
                , 'مائده بهرامی'
                , 'محسن چراغی'
                , 'سمیه اداوی'
                , 'احمد کاغذگران'
                , 'فاطمه کیانی'
                , 'لیلا فروردین'
                , 'سمیه حجازی'
                , 'احمد صالحی'
                , 'انیسه حق شناس'
                , 'ندا رحمانی'
                , 'سمیه ابراهیمی'
                , 'زهرا افشار'
            ],
            chart: {
                type: 'bar',
                height: 350,
                fontFamily: 'inherit',
                foreColor: 'inherit',
            },
            plotOptions: {
                bar: {
                    borderRadius: 0,
                    horizontal: true,
                    distributed: true,
                    barHeight: '80%',
                    isFunnel: true,
                },
            },
            colors: [
                '#F44F5E',
                '#E55A89',
                '#D863B1',
                '#CA6CD8',
                '#B57BED',
                '#8D95EB',
                '#62ACEA',
                '#4BC3E6',
            ],
            dataLabels: {
                enabled: true,
                formatter: function (val, opt) {
                    return opt.w.globals.labels[opt.dataPointIndex]
                },
                dropShadow: {
                    enabled: true,
                },
            },
            xaxis: {
                categories: ['امیرحسین مالکی پور اصفهانی'
                    , 'مائده بهرامی'
                    , 'محسن چراغی'
                    , 'سمیه اداوی'
                    , 'احمد کاغذگران'
                    , 'فاطمه کیانی'
                    , 'لیلا فروردین'
                    , 'سمیه حجازی'
                    , 'احمد صالحی'
                    , 'انیسه حق شناس'
                    , 'ندا رحمانی'
                    , 'سمیه ابراهیمی'
                    , 'زهرا افشار'
                ],
            },
            legend: {
                show: false,
            },
        },
        calls: [
            {
                title: "آقای شاه کوچکی",
                part: "داخلی(124)",
                number: 256,
                position: "دحال مکالمه",
                time: 26
            },
            {
                title: "خانم حق شناس",
                part: "انفورماتیک(124)",
                number: 256,
                position: "پایان یافته",
                time: 26
            },
            {
                title: "آقای مرادی",
                part: "پرواز(124)",
                number: 256,
                position: "دریافتی",
                time: 26
            }
        ],
        SpecialPrices: {
            active: {
                flight: 12,
                hotel: 1,
                train: 5
            },
            prcent: {
                flight: 12,
                hotel: 18,
                train: 20,
            },
            table: [
                {
                    title: "ترکیه",
                    Changes: 10,
                    price: 3000
                },
                {
                    title: "تهران",
                    Changes: 25,
                    price: 500
                },
                {
                    title: "برلین",
                    Changes: 80,
                    price: 100
                }
            ]

        },
        lasts: {
            lastSell: [
                {
                    first: 12,
                    second: 24,
                    third: 19
                },
                {
                    first: 48,
                    second: 36,
                    third: 75
                },
                {
                    first: 25,
                    second: 48,
                    third: 96
                }],
            lastBuy: [
                {
                    first: 12,
                    second: 24,
                    third: 19
                },
                {
                    first: 48,
                    second: 36,
                    third: 75
                },
                {
                    first: 25,
                    second: 48,
                    third: 96
                }],
            lastTraffic: [
                {
                    first: 12,
                    second: 24,
                    third: 19
                },
                {
                    first: 48,
                    second: 36,
                    third: 75
                },
                {
                    first: 25,
                    second: 48,
                    third: 96
                }]
        }


    }
    console.log("haloo", data);
    //   const langDirection = useSelector(selectCurrentLanguage);
    const [showProgressLoading, setShowProgressLoading] = useState(false);
    //   const [data, setData] = useState([])
    //   function getData() {
    //     setShowProgressLoading(true)
    //     axios.post(base_url + "/v2/trade/", {
    //       lang: langDirection,
    //       access_token: getAccessToken(),
    //       json: JSON.stringify({

    //       })
    //     })
    //       .then((response) => {
    //         setData(response.data)
    //       })
    //       .catch((error) => console.log(error));
    //   }
    //   useEffect(() => {
    //     getData();
    //   }, []);
    //   useEffect(() => {
    //     if (data.data)
    //       console.log("data", data.data.income);
    //   }, [data])

    return <> {/* {"DashbordComponent"} */}
        {showProgressLoading && <CircularIndeterminate />}
        <div style={{ width: "100%" }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                {data.length !== 0 &&
                    <Card sx={{
                        width: "30%", padding: "15px",
                        boxSizing: "border-box"
                    }}>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {data.topCards.firstCard.title}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {data.topCards.firstCard.amount}
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: data.topCards.firstCard.percent < 0 ? "red" : "green", }} color="text.secondary" gutterBottom>
                            {data.topCards.firstCard.percent}%
                            <ArrowDownwardIcon
                                sx={{
                                    display: data.topCards.firstCard.percent < 0 ? "" : "none",
                                }}
                            />
                            <ArrowUpwardIcon
                                sx={{
                                    display: data.topCards.firstCard.percent >= 0 ? "" : "none",
                                }}
                            />
                        </Typography>
                    </Card>}
                {data.length !== 0 &&
                    <Card sx={{
                        width: "30%", padding: "15px",
                        boxSizing: "border-box"
                    }}>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {data.topCards.secondCard.title}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {data.topCards.secondCard.amount}
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: data.topCards.firstCard.percent < 0 ? "red" : "green", }} color="text.secondary" gutterBottom>
                            {data.topCards.secondCard.percent}%
                            <ArrowDownwardIcon
                                sx={{
                                    display: data.topCards.firstCard.percent < 0 ? "" : "none",
                                }}
                            />
                            <ArrowUpwardIcon
                                sx={{
                                    display: data.topCards.firstCard.percent >= 0 ? "" : "none",
                                }}
                            />
                        </Typography>
                    </Card>}
                {data.length !== 0 &&
                    <Card sx={{
                        width: "30%", padding: "15px",
                        boxSizing: "border-box"
                    }}>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {data.topCards.thirdCard.title}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {data.topCards.thirdCard.amount}
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: data.topCards.firstCard.percent < 0 ? "red" : "green", }} color="text.secondary" gutterBottom>
                            {data.topCards.thirdCard.percent}%
                            <ArrowDownwardIcon
                                sx={{
                                    display: data.topCards.firstCard.percent < 0 ? "" : "none",
                                }}
                            />
                            <ArrowUpwardIcon
                                sx={{
                                    display: data.topCards.firstCard.percent >= 0 ? "" : "none",
                                }}
                            />
                        </Typography>
                    </Card>}
            </div>
            <br />
            {data.length !== 0 && <div style={{ display: "flex" }}>
                <div className="area" style={{ width: "70%" }}>
                    <Typography className="text-2xl md:text-3xl font-semibold tracking-tight leading-7">
                        نمودار به تفکیک
                    </Typography>
                    <Typography>  (سود بر حسب میلیون تومان می باشد)</Typography>
                    <br />
                    <Chart
                        options={data.lineChart.options}
                        series={data.lineChart.options.series}
                        type="area"
                        width="100%"
                        height="400px"
                    />
                </div>
                <div className="funnelchart" style={{ width: "35%" }}>
                    <Typography className="text-2xl md:text-3xl font-semibold tracking-tight leading-7">
                        نمودار میزان سود/زیان
                    </Typography>
                    <br />
                    <Chart
                        options={data.options}
                        series={data.options.series}
                        type="bar"
                        width="100%"
                        height="400px"
                        colors={contrastTheme.palette.secondary.dark}
                    />
                </div>
            </div>}
            {data.length !== 0 && <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row-reverse" }}>
                <Card sx={{
                    width: "49%", padding: "15px",
                    boxSizing: "border-box",
                }}><div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row-reverse",
                    alignItems: "center",
                }}>
                        <Typography color="text.secondary">
                            <a href=""> مشاهده همه</a>
                        </Typography>
                        <Typography sx={{ fontWeight: 'bold' }} variant="h5" component="div">
                            مرکز تماس
                        </Typography></div><br />
                    <hr />

                    {data.calls ? <Table sx={{ minHeight: "300px" }} aria-label="simple table">
                        <TableBody >
                            {data.calls.map((row) => (
                                <TableRow
                                // key={row.name}
                                // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                fontWeight: 'bold'
                                            }} component="div">
                                            {row.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                            color="text.secondary" component="div">
                                            {row.part}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right" >
                                        <a style={{
                                            borderRadius: "",
                                            backgroundColor: "#17a2b8",
                                            color: "#efefef",
                                            textDecoration: "none",
                                            padding: "2px 3px 0px 3px",
                                            borderRadius: "6px",
                                        }}>
                                            {row.number}
                                        </a>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                flexDirection: " row-reverse",
                                            }} component="div">
                                            <div style={{
                                                textAlign: "-webkit-left",
                                                borderRadius: "5px",
                                                width: "fit-content",
                                                padding: "2px",
                                                fontSize: "1.2rem",
                                                backgroundColor: "#6c757d",
                                                color: "white",
                                                fontWeight: 'bold',
                                            }}>{row.position}</div>

                                        </Typography>
                                        <Typography
                                            sx={{

                                            }} color="text.secondary" component="div">
                                            {row.time}ثانیه
                                        </Typography>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody> </Table> : <div style={{ minHeight: "300px" }}>
                        <PhoneDisabledIcon sx={{ color: "rgb(0 0 0 / 34%)", width: "100%", height: "200px" }} />
                        <p style={{
                            textAlign: "center",
                            color: "rgb(0 0 0 / 34%)",
                            marginTop: "2%",
                        }}>کلیه ی خطوط آزاد می باشند</p>
                    </div>}


                </Card>

                <Card sx={{
                    width: "49%", padding: "15px",
                    boxSizing: "border-box"
                }}>
                    <Typography sx={{ fontWeight: 'bold' }} variant="h5" component="div">
                        قیمت های ویژه
                    </Typography><br />
                    <hr />
                    <br />
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                    }}>
                        <div style={{ textAlign: "center" }}>
                            <Typography sx={{ fontWeight: 'bold' }} color="text.secondary" component="div">
                                پرواز های فعال
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold' }} variant="h5" component="div">
                                {data.SpecialPrices.active.flight}
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold', color: data.topCards.firstCard.percent < 0 ? "red" : "green" }} color="text.secondary" component="div">
                                {data.SpecialPrices.prcent.flight}%
                                <ArrowDownwardIcon
                                    sx={{
                                        display: data.topCards.firstCard.percent < 0 ? "" : "none",
                                    }}
                                />
                                <ArrowUpwardIcon
                                    sx={{
                                        display: data.topCards.firstCard.percent >= 0 ? "" : "none",
                                    }} />
                            </Typography>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <Typography sx={{ fontWeight: 'bold' }} color="text.secondary" component="div">
                                هتل های فعال
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold' }} variant="h5" component="div">
                                {data.SpecialPrices.active.train}
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold', color: data.topCards.firstCard.percent < 0 ? "red" : "green" }} color="text.secondary" component="div">
                                {data.SpecialPrices.prcent.train}%
                                <ArrowDownwardIcon
                                    sx={{
                                        display: data.topCards.firstCard.percent < 0 ? "" : "none",
                                    }}
                                />
                                <ArrowUpwardIcon
                                    sx={{
                                        display: data.topCards.firstCard.percent >= 0 ? "" : "none",
                                    }} />
                            </Typography>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <Typography sx={{ fontWeight: 'bold' }} color="text.secondary" component="div">
                                قطار های فعال
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold' }} variant="h5" component="div">
                                {data.SpecialPrices.active.train}
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold', color: data.topCards.firstCard.percent < 0 ? "red" : "green" }} color="text.secondary" component="div">
                                {data.SpecialPrices.prcent.train}%
                                <ArrowDownwardIcon
                                    sx={{
                                        display: data.topCards.firstCard.percent < 0 ? "" : "none",
                                    }}
                                />
                                <ArrowUpwardIcon
                                    sx={{
                                        display: data.topCards.firstCard.percent >= 0 ? "" : "none",
                                    }} />
                            </Typography>
                        </div>
                    </div>
                    <br /><hr /><br />
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold", color: "black" }}>عنوان</TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "black" }} align="right">تغیرات</TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "black" }} align="right">قیمت</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.SpecialPrices.table.map((row) => (
                                <TableRow>
                                    <TableCell >{row.title}</TableCell>
                                    <TableCell align="right">{row.Changes}%</TableCell>
                                    <TableCell align="right">{row.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>}
            <br />

            <div style={{ display: "flex", justifyContent: "space-around", }}>
                <Card sx={{
                    width: "32%", padding: "15px",
                    minHeight: "200px",
                    boxSizing: "border-box"
                }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: "16px", }} component="div">
                        آخرین فروش ها
                    </Typography><br /><hr />
                    {data.length !== 0 && <div>
                        <Table  aria-label="simple table">
                            <TableBody>
                                {data.lasts.lastSell.map((row) => (
                                     <TableRow>
                                     <TableCell >
                                         <p>{row.first}</p>
                                         <p style={{color:"#0000005e",}}>{row.second}</p>
                                     </TableCell>
                                     <TableCell align="right">{row.third}</TableCell>
                                 </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>}
                </Card>
                <Card sx={{
                    width: "32%", padding: "15px",
                    minHeight: "200px",
                    boxSizing: "border-box"
                }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: "16px", }} component="div">
                        آخرین خریدها
                    </Typography><br /><hr />
                    {data.length !== 0 && <div>
                        <Table  aria-label="simple table">
                            <TableBody>
                                {data.lasts.lastBuy.map((row) => (
                                     <TableRow>
                                     <TableCell >
                                         <p>{row.first}</p>
                                         <p style={{color:"#0000005e",}}>{row.second}</p>
                                     </TableCell>
                                     <TableCell align="right">{row.third}</TableCell>
                                 </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>}
                </Card>
                <Card sx={{
                    width: "32%", padding: "15px",
                    minHeight: "200px",
                    boxSizing: "border-box"
                }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: "16px", }} component="div">
                        آخرین ترددها
                    </Typography><br /><hr />
                    {data.length !== 0 && <div>
                        <Table  aria-label="simple table">
                            <TableBody>
                                {data.lasts.lastTraffic.map((row) => (
                                    <TableRow >
                                       <TableCell >
                                         <p>{row.first}</p>
                                         <p style={{color:"#0000005e",}}>{row.second}</p>
                                     </TableCell>
                                        <TableCell align="right">{row.third}
                                        <ArrowForwardIcon  sx={{color:"green"}}/>
                                        <ArrowBackIcon sx={{color:"red"}}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>}
                </Card>
            </div>


        </div >
    </>
};



export default DashboardComponent;