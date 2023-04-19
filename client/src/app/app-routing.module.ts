import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { FeedComponent } from './feed/feed.component';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { AuthGuard } from './_gaurds/auth.guard';
import { PreventUnsavedChangesGuard } from './_gaurds/prevent-unsaved-changes.guard';
import { LoggedInGuard } from './_gaurds/logged-in.guard';

const routes: Routes = [
  {path: "", component: HomeComponent, canActivate: [LoggedInGuard]},
  {path: "",
  runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    children: [
      {path: "users", component: UserListComponent},
      {path: "user/edit", component: UserEditComponent, canDeactivate: [PreventUnsavedChangesGuard]},
      {path: "users/:username", component: UserDetailComponent},
      {path: "feed", component: FeedComponent},
      {path: "messages", component: MessagesComponent},
      {path: "posts/create", component: PostCreateComponent},
    ]
  },
  {path: "errors", component: TestErrorComponent},
  {path: "not-found", component: NotFoundComponent},
  {path: "server-error", component: ServerErrorComponent},
  {path: "**", component: NotFoundComponent, pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
