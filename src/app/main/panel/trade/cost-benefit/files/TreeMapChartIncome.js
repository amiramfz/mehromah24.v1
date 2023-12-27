
import { styled, ThemeProvider, useTheme } from '@mui/material/styles';
import { selectContrastMainTheme } from 'app/store/fuse/settingsSlice';
import { selectCurrentLanguage } from "app/store/i18nSlice";
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';


function TreeMapChartIncome(props) {

	const chartData = props.chartData.chart.income.treemap


	useEffect(() => {
		console.log("halooo", chartData);
	}, [])

	// useEffect(() => {
	//     console.log("useEffect")
	//     props.fetchSensor(props.dataChart)
	//   }, [props.dataChart])
	//   console.log(props.dataChart)


	const langDirection = useSelector(selectCurrentLanguage);
	const theme = useTheme();
	const contrastTheme = useSelector(selectContrastMainTheme(theme.palette.primary.dark));
	let options = {
		series: [chartData.internal, chartData.international],
		options: {
			legend: {
				show: true
			},
			chart: {
				height: 350,
				type: 'treemap'
			}
		},
		colors: [contrastTheme.palette.info.dark, contrastTheme.palette.secondary.dark],
		dataLabels: {
			enabled: true,
			formatter: function (text, op) {
				return [text, op.value]
			},
			offsetY: -4
		},
		fill: {
			colors: [contrastTheme.palette.secondary.light, contrastTheme.palette.info.light],
		},
		chart: {
			fontFamily: 'inherit',
			foreColor: 'inherit',
		}
	};




	return (
		<div className="treemap">
			<Chart
				options={options}
				series={options.series}
				type="treemap"
				width="100%"
				height="400px"
				colors={contrastTheme.palette.secondary.light}
			/>
		</div>
	);
}

export default TreeMapChartIncome;