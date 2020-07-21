import { Component } from '@angular/core'
import { ApiService } from './api/api.service'
import { MatDialog } from '@angular/material/dialog'

import { PostDialogComponent } from './post-dialog/post-dialog.component'
import Post from './models/Post'
import User from './models/User'

interface UserMap {
  [key: number] : User
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  posts: Post[]
  users: UserMap = {}
  
  constructor(private apiService: ApiService, public dialog: MatDialog) {}

  ngOnInit() {
    this.apiService.getUsers().subscribe( (users: User[]) => {
      users.forEach( user => {
        this.users[user.id] = user
      })
    })
    this.apiService.getPosts().subscribe( (posts: Post[]) => {
      this.posts = posts
    })
  }

  newPostDialog() {
    const dialogRef = this.dialog.open(PostDialogComponent, {
      width: '50%',
      data: {
        title: 'Ingresa un nuevo post'
      }
    })

    dialogRef.afterClosed().subscribe( (post: Post) => {
      if (post) {
        post.userId = 999
        this.apiService.addPost(post).subscribe( (savedPost: Post) => {
          this.posts.push(savedPost)
        })
      }
    })
  }

  editPostDialog(id: number) {
    const dialogRef = this.dialog.open(PostDialogComponent, {
      width: '50%',
      data: {
        title: 'Edita el post',
        post: this.posts.find(post => post.id == id)
      }
    })

    dialogRef.afterClosed().subscribe( (post: Post) => {
      if (post) {
        this.apiService.editPost(post).subscribe( (savedPost: Post) => {
          this.posts.splice(
            this.posts.findIndex(post => post.id === savedPost.id),
            1,
            savedPost
          )
        })
      }
    })
  }

  deletePost(id: number) {
    this.apiService.deletePost(id).subscribe( result => {
      this.posts.splice(
        this.posts.findIndex(post => post.id === id),
        1
      )
    })
  }
}
