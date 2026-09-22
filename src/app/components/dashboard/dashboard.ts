import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import 'highcharts/modules/map';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(private router: Router) {
    (async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = await fetch('https://www.highcharts.com/samples/data/world-population-density.json')
        .then(response => response.json());

    // Prevent logarithmic errors in color calculation
    data.forEach(function (p:any) {
        p.value = (p.value < 1 ? 1 : p.value);
    });

    // Initialize the chart
    (Highcharts as any).mapChart('container', {
        chart: {
          map: topology,
          backgroundColor: '#EEF2F7' 
      },

        title: {
            text: '',
            align: 'left'
        },

        mapNavigation: {
            enabled: false,
            enableDoubleClickZoomTo: false,
            legend: {
              enabled: false  ,
            }
            // buttonOptions: {
            //     verticalAlign: 'bottom'
            // }
        },

        mapView: {
            fitToGeometry: {
                type: 'MultiPoint',
                coordinates: [
                    // Morocco west
                    [-17, 38],
                    // Oman east
                    [60, 12],
                    // Syria north
                    [42, 37],
                    // Yemen south
                    [45, 12]
                ]            
              }
        },

        colorAxis: {
            min: 10,
            max: 1000,
            type: 'logarithmic',
            minColor: '#D5D5D5',
            maxColor: '#9E9E9E',
            showInLegend: false
        },

        series: [{
          data: data.map((p: any) => {
              if (p.code3 === 'ISR') p['name'] = 'Palestine';
              return p;
          }),
          joinBy: ['iso-a3', 'code3'],
          name: 'Population density',
          tooltip: { valueSuffix: '/km²' },
          nullColor: '#E2E5EC',        
          borderColor: '#ffffff',      
          borderWidth: 1.5,
      
          states: {
              hover: {
                  color: '#1A3A6E'    
              }
          }
      }, {
          type: 'mappoint',
          name: 'Locations',
          enableMouseTracking: false,
          shadow: {
              color: 'rgba(0,0,0,0.15)',
              offsetX: 0,
              offsetY: 3,
              width: 5
          },
          data: [
              // 1. Turkey (top-most): large dark grey dot
              { lat: 39.9, lon: 32.8, color: '#3E4043', marker: { radius: 10, lineColor: '#ffffff', lineWidth: 3 } },
              // 2. Iraq/Syria (top-center): medium orange dot
              { lat: 33.3, lon: 44.3, color: '#ee8c3a', marker: { radius: 8, lineColor: '#ffffff', lineWidth: 3 } },
              // 3. Northeast Iran (top-right): medium orange dot
              { lat: 35.7, lon: 51.3, color: '#ee8c3a', marker: { radius: 8, lineColor: '#ffffff', lineWidth: 3 } },
              // 4. Egypt (left-center): small dark grey dot
              { lat: 30.0, lon: 31.2, color: '#3E4043', marker: { radius: 6, lineColor: '#ffffff', lineWidth: 2.5 } },
              // 5. Saudi Arabia (center-right): large dark grey dot
              { lat: 24.0, lon: 45.0, color: '#3E4043', marker: { radius: 12, lineColor: '#ffffff', lineWidth: 3.5 } },
              // 6. Sudan (lower-left): medium orange dot
              { lat: 15.5, lon: 32.5, color: '#ee8c3a', marker: { radius: 8, lineColor: '#ffffff', lineWidth: 3 } },
              // 7. Yemen (lower-right): small dark grey dot
              { lat: 15.3, lon: 44.2, color: '#3E4043', marker: { radius: 6, lineColor: '#ffffff', lineWidth: 2.5 } },
              // 8. Oman (east): medium orange dot
              { lat: 22.0, lon: 57.0, color: '#ee8c3a', marker: { radius: 7, lineColor: '#ffffff', lineWidth: 2.5 } },
              // 9. Far East (tiny dark grey dot)
              { lat: 30.0, lon: 60.0, color: '#3E4043', marker: { radius: 4, lineColor: '#ffffff', lineWidth: 2 } }
          ]
      }]
    });
  (Highcharts as any).mapChart('container-chart', {
  chart: {
    type: 'spline',
    backgroundColor: '#ffffff'
  },
  title: { text: '' },
  subtitle: { text: '' },

  xAxis: {
    categories: ['يناير','فبراير','مارس','ابريل','مايو','يونيو','يوليو','اغسطس','سبتمبر','اكتوبر','نوفمبر','ديسمبر'],
    reversed: true,
    lineColor: 'transparent',
    tickColor: 'transparent',
    labels: {
      style: { color: '#999', fontSize: '12px' }
    }
  },

  yAxis: {
    title: { text: '' },
    opposite: true,       
    gridLineDashStyle: 'Dot',
    gridLineColor: '#cccccc',
    labels: {
      style: { color: '#999' }
    }
  },

  legend: {
    enabled: true,
    align: 'center',
    verticalAlign: 'bottom',
    symbolWidth: 30,
    itemStyle: { color: '#555', fontWeight: 'normal' }
  },

  tooltip: { enabled: false },

  plotOptions: {
    spline: {
      lineWidth: 5.5,
      marker: { enabled: false },
      shadow: {
        color: 'rgba(0,0,0,0.15)',
        offsetX: 0,
        offsetY: 4,
        opacity: 0.3,
        width: 8
      }
    }
  },

  series: [
    {
      name: 'الايرادات',
      color: '#E8923A',
      data: [15, 105, 30, 130, 70, 80, 100, 160, 90, 100, 95,115]
    },
    {
      name: 'اجمالي المبيعات',
      color: '#1B3A6B',
      data: [7, 30, 90, 55, 80, 80, 90, 75, 35, 75, 60, 50]
    }
]
});
})();



  }

  goToAgent(id: string): void {
    this.router.navigate(['/agents', id]);
  }
}
