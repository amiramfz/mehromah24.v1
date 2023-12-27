import { useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { selectWidgets } from '../../../store/widgetsSlice';
import { localeConfigurationObject } from '@fuse/default-settings';

function YearlyExpensesWidget() {
  const widgets = useSelector(selectWidgets);
  const { amount, series, labels } = widgets?.yearlyExpenses;
  const theme = useTheme();

  const chartOptions = {
    chart: {
      locales: [...localeConfigurationObject],
      defaultLocale: 'fa',
      animations: {
        enabled: false,
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '100%',
      type: 'line',
      sparkline: {
        enabled: true,
      },
    },
    colors: [theme.palette.error.main],
    stroke: {
      curve: 'smooth',
    },
    tooltip: {
      theme: 'dark',
    },
    xaxis: {
      type: 'category',
      categories: labels,
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${val}`,
      },
    },
  };
  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="text-lg font-medium tracking-tight leading-6 truncate">هزینه های سالانه</div>
        <div className="ml-8 -mt-8 -mr-12">
          <IconButton>
            <FuseSvgIcon size={20}>heroicons-solid:dots-vertical</FuseSvgIcon>
          </IconButton>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className="flex flex-col">
          <div className="text-3xl font-semibold tracking-tight leading-tight">
            {/* {amount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })} */}
            {amount.toLocaleString()}&nbsp;<small>تومان</small>
          </div>
          <div className="flex items-center">
            <FuseSvgIcon className="mr-4 text-red-500" size={20}>
              heroicons-solid:trending-up
            </FuseSvgIcon>
            <Typography className="font-medium text-sm text-secondary leading-none whitespace-nowrap">
              <span className="text-red-500">2%</span>
              <span> بالاتر از انتظار</span>
            </Typography>
          </div>
        </div>
        <div className="flex flex-col flex-auto ml-32">
          <ReactApexChart
            className="flex-auto w-full h-64"
            options={chartOptions}
            series={series}
            type={chartOptions.chart.type}
            height={chartOptions.chart.height}
          />
        </div>
      </div>
    </Paper>
  );
}

export default YearlyExpensesWidget;
