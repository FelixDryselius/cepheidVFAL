import { Component, OnInit } from '@angular/core';

//3rd party and application imports
import { AuthAPIService } from '../../../auth/auth.service';
import { element, logging } from 'protractor';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OperationsService } from '../../../operation/shared/services/operations.service';
import { QueryResponse } from '../../../shared/interfaces/query-response';
import { Scoreboard } from '../../../../assets/interface/scoreboard';
import { Batch } from '../../../shared/interfaces/batch';


@Component({
  selector: 'app-production-accumulated',
  templateUrl: './production-accumulated.component.html',
  styleUrls: ['./production-accumulated.component.css']
})


export class ProductionAccumulatedComponent implements OnInit {

  productionStatistics = [];
  displayDataList = [];
  haveData = false; 

   //Chart here we set options fot the chart
   showLegend = true;
   colorScheme = {
     domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
   };
   showLabels = true;
   showXAxisLabel = true;
   showYAxisLabel = true;
   xAxisLabel = "Time";
   yAxisLabel = 'Accumulated production'
   xAxis=true;
   yAxis=true;
   timeline=false;
 

  constructor(private authAPI:AuthAPIService, private operationsService:OperationsService) { }

  ngOnInit() {
    this.getProductionData()           
  }

  xAxisFormatting(data){
    return data.toLocaleTimeString('sv-SV', { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric'})
  }

  getProductionData()  {
    this.haveData = false;

    //OBS THE OFFSET THING MUST CHANGE
    //Get the latest batch's production_number
    this.operationsService.getBatchDetail('?limit=1&offset=1')  
    .switchMap(batchData =>{
      let batch = (batchData as QueryResponse).results as Batch []
      let tempQuery = '?batch_number='+ batch.pop().batch_number;
      return this.operationsService.getProductionStatistics(tempQuery)
    })
    //populate productionStatistics using this
    .retryWhen(error => this.authAPI.checkHttpRetry(error))
    .subscribe(data =>{
      this.productionStatistics = (data as QueryResponse).results as Scoreboard []

      //populate tempSeries and productionGoalList
      let accumulatedProduction = 0;
      let tempSeries = []
      let productionGoalList = []
      for(let i = this.productionStatistics.length-1; i >= 0; i-- ){
        tempSeries.push(
          {
            "name": new Date(this.productionStatistics[i].time_stamp),
            "value": accumulatedProduction + this.productionStatistics[i].production_quantity
          },
        )
        productionGoalList.push(
          {
            "name": new Date(this.productionStatistics[i].time_stamp),
            "value": 1000 // should be changed to another value
          },
        )
        accumulatedProduction = accumulatedProduction + this.productionStatistics[i].production_quantity
      }
    
      //adding both goal and accumulated production statistics to displayData
      this.displayDataList = [
        {
          'name': this.productionStatistics[0].batch.batch_number +"'s accumulated yield",
          'series': tempSeries
        },
        {
          'name': 'Production goal',
          'series': productionGoalList
        }
      ]      
    });   
    this.haveData=true;      
  }


}