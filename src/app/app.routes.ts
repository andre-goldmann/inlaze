import { Routes } from '@angular/router';
import {UsersComponent} from "./component/users/users.component";
import {LogoutComponent} from "./component/logout/logout.component";
import {DashboardComponent} from "./component/dashboard/dashboard.component";
import {PostsComponent} from "./component/posts/posts.component";
import {RegistrationComponent} from "./component/users/registration/registration.component";
import {EditComponent} from "./component/users/edit/edit.component";

export const APP_ROUTES: Routes = [
  { path: '', component: DashboardComponent,
    children: [
      { path: 'posts', component: PostsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'edit', component: EditComponent },
      { path: 'logout', component: LogoutComponent },
    ]
  }
];
