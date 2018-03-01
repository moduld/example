import { Injectable } from '@angular/core';
import { UserInterface } from '../../../interfaces';


@Injectable()
export class StorageService {

  private savedCurrentUser: UserInterface = null;
  private savedMonolithUser: BusinessInterface | ProfileInterface = null;
  private savedWebSocketUrl: string = '';
  private selectedContactsArray: any[] = [];

  get currentUser(): UserInterface {
    return this.savedCurrentUser;
  }

  set currentUser(user: UserInterface) {
    this.savedCurrentUser = user;
  }

  get currentMonolithUser(): BusinessInterface | ProfileInterface {
    return this.savedMonolithUser;
  }

  set currentMonolithUser(user: BusinessInterface | ProfileInterface) {
    this.savedMonolithUser = user;
  }

  get savedWebSocket(): string {
    return this.savedWebSocketUrl;
  }

  set savedWebSocket(url: string) {
    this.savedWebSocketUrl = url;
  }

  get selectedContacts(): any[] {
    return this.selectedContactsArray;
  }

  set selectedContacts(contacts: any[]) {
    this.selectedContactsArray = contacts;
  }
}
