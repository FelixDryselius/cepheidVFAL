import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Pipe } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common'

//3rd part and application imports
import { Batch } from '../shared/interfaces/batch';
import { OperationsService } from '../operation/shared/services/operations.service'
import { tap } from 'rxjs/operators';
import { CommentService } from '../shared/application-services/comment.service';
import { QueryResponse } from '../shared/interfaces/query-response';


@Component({
  selector: 'app-batch-history-detail',
  templateUrl: './batch-history-detail.component.html',
  styleUrls: ['./batch-history-detail.component.css']
})
export class BatchHistoryDetailComponent implements OnInit {
  private batchDetail: Batch; // might not need
  private batchDetailForm: FormGroup;
  private batchDetailID: string;
  private batchObservable: Observable<any>;
  private batchSub: any;
  private commentObservable: Observable<any>;
  private commentSub: any;
  private statisticsObservable
  private statisticsSub

  comments: {};
  statistics: {};

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private location: Location,
    private operationsService: OperationsService,
    private commentService: CommentService,
  ) { }

  ngOnInit() {


    this.batchDetailID = this.route.snapshot.paramMap.get('id')

    //TODO: MAKE THIS PAGE GREAT AND REMOVE COMMENTS ETC. MORE INFO ON:
    // https://coryrylan.com/blog/using-angular-forms-with-async-data

    this.batchDetailForm = this.formBuilder.group({
      order_number: [],
      article_number: [],
      start_date: [],
      end_date: [],
      scrap: [],
      production_yield: [],
      hmi1_good: [],
      hmi1_bad: [],
      hmi2_good: [],
      hmi2_bad: [],
      rework_date: [],
      applied_labels: [],
      label_print_time: [],
      rework_time: [],
    })

    this.batchObservable = this.operationsService.getBatchDetail(this.batchDetailID)
    this.batchSub = this.batchObservable.subscribe(data => {
      let batch = data as Batch
      let order = data['order_number']
      delete data['order_number']
      data['order_number'] = order['order_number']
      data['article_number'] = order['article_number']
      this.batchDetailForm.patchValue(data)
    })

    this.commentObservable = this.commentService.getComment(this.batchDetailID)
    this.commentSub = this.commentObservable.subscribe(data => {
      this.comments = (data as QueryResponse).results
      console.log(this.comments)
    })

    this.statisticsObservable = this.commentService.getComment(this.batchDetailID)
    this.statisticsSub = this.commentObservable.subscribe(data => {
      this.statistics = (data as QueryResponse).results
      console.log(this.comments)
    })



  }

  submitBatchDetails($theEvent, batchForm) {
    console.log(batchForm)
    delete batchForm['article_number']
    delete batchForm['order_number']
    batchForm['batch_number'] = this.batchDetailID
    console.log(batchForm)
    this.operationsService.updateBatch(batchForm as Batch).subscribe()
  }
  // submitEndBatch($theEvent,batchForm){  
  //   // TODO:  add these attributes so the whole batch kan close:
  //   // scrap, rework_date, applied_labels, label_print_time, rework_time, yield_2
  //   let batchInfo = {}
  //   console.log("submit end runned");
  //   if(this.prodActive){ 
  //     batchInfo = {
  //       batch_number: this.prodInfo.batch_number,
  //       end_date: new Date(),
  //       production_yield: batchForm.yield_1,
  //       hmi1_bad: batchForm.hmi1_bad,
  //       hmi2_bad: batchForm.hmi2_bad,
  //       hmi1_good: batchForm.hmi1_good,
  //       hmi2_good: batchForm.hmi2_good,
  //     } 
  //     this.operationsService.updateBatch(batchInfo as Batch).subscribe() 
  //   }

  //   this.operationsService.changeProdStatus(false) 
  //   this.operationsService.changeProdInfo(null)

  //   this.router.navigate(['/home'])
  // }
  goBack() {
    this.location.back()
  }

}

