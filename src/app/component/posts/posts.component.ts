import {Component, Input, OnInit, Signal} from '@angular/core';
import {Post} from "../../models/models";
import {PostsService} from "../../services/posts.service";
import {Observable} from "rxjs";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {StoreService} from "../../store/store.service";
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit{

  editForm: FormGroup = this.fb.group({
    postId: [0],
    editTitle: ['', Validators.required],
    editCcontent: ['', Validators.required]
  });

  posts$: Observable<Post[]>;
  newPost: any = { title: '', body: '' };

  searchStr!: string;

  constructor(private postsService:PostsService,
              private storeService:StoreService,
              private fb: FormBuilder) {
    this.posts$ = postsService.getPosts();
  }

  ngOnInit(): void {
    initFlowbite();
  }

  addPost() {
    let user = this.storeService.getUser();
    if (user.id !== undefined && this.newPost.title.trim() !== '' && this.newPost.content.trim() !== '') {
      this.newPost.userId = user.id;
      this.postsService.addPost(this.newPost).subscribe((data) => {
        this.posts$ = this.postsService.getPosts();
      });
    }

  }

  search() {
    this.posts$ = this.postsService.serchPosts(this.searchStr);
  }

  like(post:Post) {
    if(this.storeService.getUser().id != undefined && this.storeService.getUser().id !== post.userId) {
      post.likes += 1;
    }
  }

  delete(post: Post) {
    if(this.storeService.getUser().id != undefined && this.storeService.getUser().id === post.userId){
      this.postsService.deletePost(post).subscribe(e => {
        // Todo optimize this
        this.posts$ = this.postsService.getPosts();
      });
    }
  }

  submitEditForm() {
    this.postsService.updatePost(this.editForm.getRawValue()).subscribe(
      e=> {
        // Todo optimize this
        this.posts$ = this.postsService.getPosts();
      }
    );
  }

  setPost(post: Post) {
    this.editForm.patchValue({
      postId: post.id,
      editTitle: post.title,
      editCcontent: post.content,
    });
  }
}
