import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Feedback, ContactType } from '../shared/feedback';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs';
import { visibility, flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})

export class ContactComponent implements OnInit {

  errMess: string;
  feedbackForm: FormGroup;
  feedback: Feedback;
  feedcopy: Feedback;
  contactType = ContactType;
  isLoading: boolean;
  showResponse: boolean;
  @ViewChild('fform') feedbackFormDirective;
  feedbackResult: any;

  isShown = false;
  fadeInOut(): void {
    this.isShown = !this.isShown;
  }


  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required': 'First Name is required.',
      'minlength': 'First Name must be at least 2 characters long.',
      'maxlength': 'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required': 'Last Name is required.',
      'minlength': 'Last Name must be at least 2 characters long.',
      'maxlength': 'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required': 'Tel. number is required.',
      'pattern': 'Tel. number must contain only numbers.'
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email not in valid format.'
    },
  };

  constructor(private fb: FormBuilder,
    public feedbackService: FeedbackService,
    public route: ActivatedRoute,
    public location: Location,
    public cmt: FormBuilder,
    @Inject('BaseURL') public BaseURL) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm(): void {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(_data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    this.feedbackService.postFeedback(this.feedback)
    .subscribe(feedback => {
      this.feedback = feedback
    }),errmess => this.errMess = <any>errmess;

    this.feedbackService.getFeedback().subscribe(feedbackResult => this.feedbackResult = feedbackResult);
      this.route.params
      .pipe(switchMap((_params: Params) => {  return this.feedbackService.getFeedback() }));

      this.feedbackService.getFeaturedFeedback()
        .subscribe(feedback => this.feedback = feedback);

    this.feedbackForm.reset({
    firstname: '',
    lastname: '',
    telnum: 0,
    email: '',
    agree: false,
    contacttype: 'None',
    message: ''
    });
    this.isShown;
    this.feedbackFormDirective.resetForm();
  }

}
