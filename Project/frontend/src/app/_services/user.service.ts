import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {sha256} from 'js-sha256';
import {SurpriseService} from './surprise.service';
import {AppComponent} from '../app.component';
import {FeedbackService, stages} from "./feedback.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(public httpClient: HttpClient) {
    UserService.httpClient = httpClient;
  }
  static httpClient: HttpClient;
  static router: Router;

  static user: User;
  static loggedIn = false;

  /**
   * returns all unapproved users
   */
  static getAllUnapproved(){
    return this.httpClient.get(AppComponent.backendUrl+'/login/unapproved', {withCredentials: true});
  }

  /**
   * changes password of a user
   * @param id of the user to change the pw
   * @param oldPassword
   * @param newPassword
   */
  static changePassword(id: string, salt:string, newPassword: string): Observable<Object>{
    newPassword = this.hashPassword(newPassword, salt);
    return UserService.httpClient.put(AppComponent.backendUrl + '/login/' + id + '/' + newPassword, '[]', {withCredentials: true});
  }

  /**
   * returns a new salt for a user
   * use case: register a new user or change the password
   * @param id: User ID who needs a new salt
   */
  static getNewSalt(id: string){
    return UserService.httpClient.get( AppComponent.backendUrl + '/login/salt/' + id, {withCredentials: true});
  }

  /**
   *
   * @param id: id of the user who needs to be updated
   * @param user: updated User instance
   */
  static updateUser(id: number, user: User) {
    return UserService.httpClient.put(AppComponent.backendUrl + '/login/'+id, {
      'id': user.id,
      'name': user.name,
      'password': '',
      'salt': '',
      'email': user.email,
      'role': user.role,
      'approved': user.approved,
      'address': user.address,
      'description': user.description
    }, {withCredentials: true});
  }

  /**
   * returns the instance of the user with the id
   * @param id: user ID of the user who needs to be returned
   */
  static getUserById(id: string): Observable<Object>{
    return this.httpClient.get(AppComponent.backendUrl + '/login/company/' + id, {withCredentials: true});
  }

  /**
   * return all users
   */
  static getAllUsers(): Observable<Object>{
    return this.httpClient.get(AppComponent.backendUrl + '/login', {withCredentials: true});
  }

  /**
   * hashes the password with the given salt
   *
   * @param password: password which needs to be hashed
   * @param salt: user-individual salt, with which the password should be hashed
   */
  static hashPassword(password: string, salt: string){
    return sha256.create().update(password + salt).hex();
  }

  /**
   * return the instance of the user where the email matches
   *
   * use case: login
   *
   * @param email: email of the user whose instance is needed
   */
  static getUserByEmail(email: string) {
    return this.httpClient.get(AppComponent.backendUrl + '/login/' + email, {withCredentials: true});
  }

  /**
   * checks the password
   *
   * use case: login
   *
   * @param id: id of the user, whose password should be compared
   * @param password: the entered password, which has to be validated
   */
  static checkPassword(id: number, password: string){
   return this.httpClient.get(AppComponent.backendUrl + '/login/' + id + '/' + password, {withCredentials: true});
  }

  /**
   * deletes a user and all his jobs
   *
   * @param user: the user, which should be deleted
   */
  static delete(user: User){
    FeedbackService.addMessage('blabla',stages.success);
    return this.httpClient.delete(AppComponent.backendUrl + '/login/' + user.id, {withCredentials: true});
  }

  /**
   * registers a new user
   *
   * @param user: instance of the user who needs to be registered
   *
   */
  static register(user: User){
    return this.httpClient.post(AppComponent.backendUrl + '/login/',  {
      withCredentials: true,
      'id': user.id,
      'name': user.name,
      'password': user.password,
      'salt': user.salt,
      'email': user.email,
      'role': user.role,
      'approved': user.approved
    }, {withCredentials: true});
  }

  /**
   * logs the user out
   *
   * destroys the session and sets the currentuser to null
   */
  static logout () {
    this.httpClient.get(AppComponent.backendUrl + '/login/logout', {withCredentials: true}).subscribe((instance: any) => {
    });
    this.loggedIn = false;
    this.user = null;
  }

  /**
   * checks the session, checks if a user is logged in
   *
   * use case: after page reload, check if a user was logged in
   */
  static checkSession(){
    this.httpClient.get(AppComponent.backendUrl + '/login/session', {withCredentials: true}).subscribe(
      (instance: any) => {
        if (instance !== null) {
          this.loggedIn = true;
          this.user = new User(instance.id,instance.name,'','',instance.email,instance.role,instance.approved,instance.address,instance.description);

        } else {
          this.loggedIn = true;
          this.user = null;
        }
        SurpriseService.init(this.httpClient, UserService.user);
      });
  }

  /**
   * checks, if there is a connection to the backend server
   */
  static connectionTest(): Observable<Object>{
    return this.httpClient.get(AppComponent.backendUrl + '/login/connTest');
  }

  /**
   * checks if the password is emtpy,
   * if it is empty, it returns false and displays an error message
   * if i has less then 6 characters, it shows a warning but accepts the password
   *
   * @param password: the password to be checked
   */
  static passwordValidation(password: string): boolean {
    if (password === null || password === '') {
      FeedbackService.addMessage("Passwort darf nicht leer sein", stages.error);
      return false;
    }
    if (password.length < 6){
      FeedbackService.addMessage("Es werden mindestens 6 Zeichen als Password empfohlen", stages.warning);
    }
    return true;
  }

  /**
   * checks, whether the email has an @ character in it
   * if not, it returns false and displays an error message
   * else, it returns true
   *
   * @param email: email to be checked
   */
  static emailValidation(email: string): boolean {
    if (!email.includes('@')){
      FeedbackService.addMessage("Bitte eine gültige Email-Adresse angeben", stages.error);
      return false;
    }
    if (email === null || email === ''){
      FeedbackService.addMessage("Email kann nicht leer sein", stages.error);
      return false;
    }
    return true;
  }

  /**
   * return the actual logged in user
   */
  getUser(): User {
    return UserService.user;
  }

  /**
   * returns true, if a user is logged in, false otherwise
   */
  getLoginStatus(): boolean {
    return UserService.loggedIn;
  }
}
