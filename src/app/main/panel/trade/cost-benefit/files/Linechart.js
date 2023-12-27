import Chart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';

function Linechart(props) {

    const chartData = props.chartData
    const title = props.title
    useEffect(() => {
        console.log("line operators", chartData);
    }, [])
    const [state] = useState({
        options: {
            xaxis: {
                categories: chartData.categories
            },
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
            }
        },

        series: [
            {
                name: 'سود و زیان',
                data: chartData.count_references
            },
            {
                name: 'تعداد مسافرین',
                data: chartData.count_passengers
            },
            {
                name: 'تعداد رفرنس',
                data: chartData.count_profit
            }
        ]
    });

    return (
        <div className="area" style={{ width: "70%" }}>
            <Typography className="text-2xl md:text-3xl font-semibold tracking-tight leading-7">
               {title}
            </Typography>
            <Typography>(سود بر حسب میلیون تومان می باشد)</Typography>
            <br />
            <Chart
                options={state.options}
                series={state.series}
                type="area"
                width="100%"
                height="400px"
            />
        </div>
    );
}

export default Linechart;