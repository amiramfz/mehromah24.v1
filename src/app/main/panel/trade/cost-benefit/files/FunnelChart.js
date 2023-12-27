
import { styled, ThemeProvider, useTheme } from '@mui/material/styles';
import { selectContrastMainTheme } from 'app/store/fuse/settingsSlice';
import { selectCurrentLanguage } from "app/store/i18nSlice";
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';

function FunnelChart(props) {
  const theme = useTheme();
  const chartData = props.chartData
  let title = props.title
  const contrastTheme = useSelector(selectContrastMainTheme(theme.palette.primary.dark));
  let options = {
    series: [
      {
        name: "",
        data: chartData.count_profit,
      },
    ],
    xaxis: chartData.categories,
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
      categories: chartData.categories
    },
    legend: {
      show: false,
    },
  };
  
  return (
    <div className="funnelchart" style={{ width: "35%" }}>
      <Typography className="text-2xl md:text-3xl font-semibold tracking-tight leading-7">
       {title}
      </Typography>
      <br />
      <Chart
        options={options}
        series={options.series}
        type="bar"
        width="100%"
        height="400px"
        colors={contrastTheme.palette.secondary.dark}
      />
    </div>
  );
}

export default FunnelChart;