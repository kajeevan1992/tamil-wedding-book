
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
//? options: https://canvasjs.com/docs/charts/chart-options/title/
export default function PieChart(props) {
  const options = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light2", // "light1", "dark1", "dark2"
    title: {
      text: "Expenses",
      verticalAlign: "top",
      margin: 20,
      // padding: {
      //   top: 1,
      //   right: 1,
      //   bottom: 2,
      //   left: 2
      // },
    },
    legend: {
      horizontalAlign: "center",

      // markerMargin: 20,
      // dockInsidePlotArea: false,
    },
    data: [{
      type: props.type,
      startAngle: 75,
      toolTipContent: "<b>{label}</b>: {total} ({y}%)",
      showInLegend: "true",
      legendText: "{label} {y}%",
      indexLabelFontSize: 16,
      indexLabel: "{label}: {y}%",
      dataPoints: props.data,
      // [
      //   { label: "Ceremony", y: 20, percentage: 10 },
      //   { label: "Reception", y: 24, percentage: 10 },
      //   { label: "Music", y: 20, percentage: 10 },
      //   { label: "Invitations", y: 14, percentage: 10 },
      //   { label: "Wedding Favours", y: 12, percentage: 10 },
      //   { label: "Flowers and Decoration", y: 10, percentage: 10 },
      //   { label: "Photos and Video", y: 30, percentage: 10 },
      //   { label: "Transport", y: 10, percentage: 10 },
      //   { label: "Jewellery", y: 40, percentage: 10 },
      //   { label: "Bridal accessories", y: 25, percentage: 10 },
      //   { label: "Groom's accessories", y: 50, percentage: 10 },
      //   { label: "Health & Beauty", y: 15, percentage: 10 },
      //   { label: "Honeymoons", y: 30, percentage: 10 },
      //   { label: "Other", y: 10, percentage: 10 }
      // ]
    }]
  }
  return (
    <div>
      <CanvasJSChart options={options}
      /* onRef={ref => this.chart = ref} */
      />
    </div>
  );
}

