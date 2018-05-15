import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AuthAPIService } from './auth/auth.service';
import { AuthGuard } from './auth/auth-guard.service';
import { AuthComponent } from './auth/auth.component';
import { AuthLogoutComponent } from './auth-logout/auth-logout.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrentBatchInfoComponent } from './operation/current-batch-info/current-batch-info.component';
import { TokenInterceptor } from './auth/token.interceptor';
import { OperationModule } from './operation/operation.module';
import { OperationsService } from './operation/shared/services/operations.service';
import { RoleGuard } from './auth/role-guard.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

//Third party imports:
import { CookieService } from 'ngx-cookie-service';
import { NotFoundComponent } from './not-found/not-found.component';
import { SubmitIfValidDirective } from './shared/directives/submit-if-valid.directive';
import { CommentService } from './shared/application-services/comment.service';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    AuthLogoutComponent,
    CurrentBatchInfoComponent,
    NotFoundComponent,
    SubmitIfValidDirective,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    //OperationModule,
    AppRoutingModule,
  ],
  providers: [
    AuthGuard,
    RoleGuard,
    AuthAPIService,
    CommentService,
    OperationsService,
    CookieService,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
    },
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }

