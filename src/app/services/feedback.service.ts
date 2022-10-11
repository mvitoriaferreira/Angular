import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(public http: HttpClient,
    public processHTTPMsgService: ProcessHTTPMsgService) { }

  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(baseURL + 'feedbacks')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeedback(id: string): Observable<Feedback> {
    return this.http.get<Feedback>(baseURL + 'feedbacks/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedFeedback(): Observable<Feedback> {
    return this.http.get<Feedback[]>(baseURL + 'feedbacks?featured=true').pipe(map(feedbacks => feedbacks[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeedbackIds(): Observable<string[] | any> {
    return this.getFeedbacks().pipe(map(feedbacks => feedbacks.map(feedback => feedback)))
      .pipe(catchError(error => error));
  }

  postFeedback(_feedback: Feedback): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<Feedback>(baseURL + 'feedbacks/' + Feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));

  }
}
