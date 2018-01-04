import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { EventsExchangeService as ContactsEventsSubscribe} from '../../../lazy-for-messenger/shared-module/services';
import { ContactsModel } from '../../../interfaces/lazy-for-messenger.interface';
import { CreateNewConversationRequestBodyInterface, ConversationInterface } from '../../../../interfaces';
import { RequestService, StorageService, EventsExchangeService } from '../../services';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-add-employee-modal',
  templateUrl: './add-employee-modal.component.html',
  styleUrls: ['./add-employee-modal.component.scss']
})
export class AddEmployeeModalComponent implements OnInit, OnDestroy {

  newConversationForm : FormGroup;
  activatedConversationType: string;
  activatedGroup: string;
  contactsEventsSubscription: Subscription;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private requestService: RequestService,
              private storageService: StorageService,
              private eventsExchangeService: EventsExchangeService,
              private contactsEventsSubscribe: ContactsEventsSubscribe,
              @Inject(DOCUMENT) private document: any) {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.activatedConversationType = params['type'];
      this.activatedGroup = params['group'];
    });
  }

  ngOnInit() {
    // remove after bug fix of modal module
    setTimeout(()=> {
      this.document.querySelector('.modal-backdrop').remove()
    }, 0)

    this.contactsEventsSubscription = this.contactsEventsSubscribe.selectedContactsSent
      .subscribe((contacts: ContactsModel[]) => {
      this.createConversation(contacts);
    });

      this.newConversationForm = new FormGroup({
        "name": new FormControl("", [
          Validators.required
        ]),
      });
  }

  ngOnDestroy(): void {
    this.contactsEventsSubscription.unsubscribe();
  }

  createConversation(participants: ContactsModel[]): void {
    const requestData: CreateNewConversationRequestBodyInterface = {
      type: this.activatedGroup,
      owner: this.storageService.currentUser.uuid,
      participants: []
    };
    participants.forEach((participant: ContactsModel) => {
      requestData['participants'].push({
        type: 'contact',
        uuid: participant.id,
        name: `${participant.first_name} ${participant.last_name}`
      })
    });
    if (this.activatedConversationType === 'group') {
      if (this.newConversationForm.valid) {
        requestData['name'] = this.newConversationForm.value.name;
        this.makeRequest(requestData);
      }
    } else {
      this.makeRequest(requestData);
    }
  }

  makeRequest(requestData: CreateNewConversationRequestBodyInterface): void {
    this.requestService.createNewConversation(requestData)
      .subscribe((data: ConversationInterface) => {
        this.eventsExchangeService.newConversationCreated.next(data);
        this.back();
    })
  }

  back() {
    this.router.navigate([{outlets: {contacts_outlet: null}}], {relativeTo: this.activatedRoute.parent})
  }
}
