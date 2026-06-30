
import CanvasJSReact from '@canvasjs/react-charts';


var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function DataLabelChart() {
  const options = {
    // title: {
    //   text: "Basic Column Chart"
    // },
    axisY: {
      // title: "axisY Title",
      // interlacedColor: "red",
      // tickLength: 0,
      // interval: 7,
      // minimum: 0,
      // maximum: 100,
      includeZero: true
    },
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "column",

        dataPoints: [
          { label: "June", y: 12, color: '#eb2327' },
          { label: "July", y: 67, color: '#eb2327' },
          { label: "August", y: 78, color: '#eb2327' },
          { label: "September", y: 98, color: '#eb2327' },
          { label: "October", y: 45, color: '#eb2327' }
        ]
      }
    ]
  }
  return (
    <div>
      <CanvasJSChart options={options}
      /* onRef={ref => this.chart = ref} */
      /* containerProps={{ width: '100%', height: '300px' }} */
      />


    </div>
  );
}

