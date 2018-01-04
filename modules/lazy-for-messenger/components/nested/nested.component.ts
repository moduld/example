import {ActivatedRoute, Params, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@pe/common/modules/i18n';
import {RequestService} from '../../services';
import { EventsExchangeService } from '../../shared-module/services/events-exchange.service';
import { ContactsListResponseInterface, PaginationDataInterface, ContactsModel } from '../../../interfaces/lazy-for-messenger.interface';

@Component({
  selector: 'nested',
  templateUrl: './nested.component.html',
  styleUrls: ['./nested.component.scss']
})
export class NestedComponent implements OnInit {

  searchResponse: ContactsListResponseInterface;
  contactsList: ContactsModel[] = [];
  selectedContacts: ContactsModel[] = [];
  currentMonolithUserSlug: string;
  newConversationType: string;
  paginationPage: string = '1';
  contactsDirection: string = 'asc';
  isScrollNotBlocked: boolean = true;
  contactsSortingType: string = 'firstName';

  constructor(private eventsExchangeService: EventsExchangeService,
              private activatedRoute: ActivatedRoute,
              private requestService: RequestService) {

    this.activatedRoute.params
      .subscribe((params: Params) => {
      this.currentMonolithUserSlug = params['slug'];
      this.newConversationType = params['type'];
    });
  }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.requestService.getContactsList(this.currentMonolithUserSlug, this.paginationPage, this.contactsDirection, this.contactsSortingType)
      .subscribe((response: ContactsListResponseInterface) => {
        response.contact_models.forEach((item: ContactsModel) => {
          item['selected'] = false;
        });
        this.searchResponse = response;
        this.paginationPage = response.pagination_data.current;
        this.contactsList = this.contactsList.concat(response.contact_models);
        if (response.contact_models.length) {
          this.isScrollNotBlocked = true;
        }
      })
  }

  contactChangeState(contact: ContactsModel) {
    contact['selected'] = !contact['selected'];
    if (contact['selected']) {
        this.selectedContacts.push(contact);
    } else {
      this.selectedContacts.splice(this.selectedContacts.indexOf(contact, 1));
    }
  }

  sendSelectedContacts(): void {
    this.eventsExchangeService.selectedContactsSent.next(this.selectedContacts);
  }

  unselectSelectedContacts(): void {
    this.selectedContacts.forEach((item: ContactsModel) => {
      item['selected'] = false;
    });
    this.selectedContacts = [];
  }

  loadNextPageOfContacts(): void {
    if (this.isScrollNotBlocked) {
      this.isScrollNotBlocked = false;
      let nextPage: number = parseInt(this.paginationPage) + 1;
      this.paginationPage = nextPage.toString();
      this.loadContacts();
    }
  }

  changeContactsDirection(sortingType: string): void {
    if (sortingType !== this.contactsSortingType) {
      this.contactsSortingType = sortingType;
      this.contactsDirection = 'asc';
    } else {
      this.contactsDirection === 'asc' ? this.contactsDirection = 'desc' : this.contactsDirection = 'asc';
    }
    this.paginationPage = '1';
    this.contactsList = [];
    this.loadContacts();
  }
}
