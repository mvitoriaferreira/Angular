import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {

  commentFormGroup: FormGroup;
  comment: Comment;
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;

  @ViewChild('cform') feedbackFormDirective;

  formErrors = {
    'rating': '',
    'author': '',
    'comment': '',
    'date': ''
  };

  validationMessages = {
    'rating': '',
    'name': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required': 'Comment is required.',
      'minlength': 'Comment must be at least 5 characters long.',
      'maxlength': 'Comment cannot be more than 25 characters long.'
    },
    'date': ''
  };

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    @Inject('BaseURL') private BaseURL) {

  }

  createForm() {
    this.commentFormGroup = this.formBuilder.group({
      rating: [5, [Validators.required]],
      author: ['', Validators.required, Validators.minLength(2), Validators.maxLength(25)],
      comment: ['', Validators.required, Validators.minLength(5), Validators.maxLength(25)],
      date: '',
    });

    this.commentFormGroup.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentFormGroup) { return; }
    const form = this.commentFormGroup;
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
  onSubmit(): void {
    const timeElapsed = Date.now();
      const today = new Date(timeElapsed);

        let commentForm = {
          rating: this.dish.comments.length,
          comment: this.commentFormGroup.value,
          author: this.commentFormGroup.value,
          date: today.toDateString()
        };

        this.dish.comments.push(commentForm);

        console.log(commentForm.comment);
        this.commentFormGroup.reset({
          name: '',
          comment: ''
        });
        this.feedbackFormDirective.resetForm();
  }
  /*
    onSubmit() {
      const timeElapsed = Date.now();
      const today = new Date(timeElapsed);

        let commentForm = {
          rating: this.dish.comments.length,
          comment: this.commentFormGroup.value,
          author: this.commentFormGroup.value,
          date: today.toDateString()
        };

        this.dish.comments.push(commentForm);

        console.log(commentForm.comment);
        this.commentFormGroup.reset({
          name: '',
          comment: ''
        });
        this.feedbackFormDirective.resetForm();
    }
  */
  /* Não estou conseguindo subir a informação do comentário. Verificar depois.

      onSubmit() {
      this.commentFormGroup.value.date = Date.now().toString();
    this.comment = this.commentFormGroup.value;
    this.dish.comments.push(this.commentFormGroup);
    this.commentFormGroup.reset({
      rating: '',
      comment: '',
      author: '',
      date: '',
    });
    this.feedbackFormDirective.resetForm();
    }

  */
  ngOnInit() {
    this.createForm();
    this.dishService.getDishIds().subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
        errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

}
