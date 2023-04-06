import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { AuthGuard } from './_gaurds/auth.guard';
import { PreventUnsavedChangesGuard } from './_gaurds/prevent-unsaved-changes.guard';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "",
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    children: [
      {path: "users", component: UserListComponent},
      {path: "user/edit", component: UserEditComponent, canDeactivate: [PreventUnsavedChangesGuard]},
      {path: "users/:username", component: UserDetailComponent},
      {path: "lists", component: ListsComponent},
      {path: "messages", component: MessagesComponent},
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
