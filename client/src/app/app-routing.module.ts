import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { AuthGuard } from './_gaurds/auth.guard';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "",
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    children: [
      {path: "users", component: UserListComponent},
      {path: "users/:id", component: UserDetailComponent},
      {path: "lists", component: ListsComponent},
      {path: "messages", component: MessagesComponent},
    ]
  },
  {path: "**", component: HomeComponent, pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
