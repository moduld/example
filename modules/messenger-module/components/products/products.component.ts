import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

    products:any[] = [];
    addedProducts: any[] = [];
    search_field: string = "";
    opened_input: boolean = false;
    @HostBinding('class.show_products') smoothClass: boolean = false;

    constructor() {}

    changedModel(prod: any): void {

      if (prod.state){
          this.addedProducts.push(prod)
      } else {
          this.addedProducts.splice(this.addedProducts.indexOf(prod, 1))
      }
    }

  ngOnInit() {

      for (let i = this.prods.length; i--; this.prods[i]['state'] = false){}
      this.products = this.prods;
      let timeout = setTimeout(()=>{
          this.smoothClass = true;
          clearTimeout(timeout)
      }, 0)

  }

    prodFormSubmit(): void {

    }

    searchButtonClick(): void {

      if (!this.search_field){
          this.opened_input = !this.opened_input
      } else {
          this.opened_input = false;
          this.search_field = ""
      }
    }

    filterProducts(event: Event): void {

      event.preventDefault()
    }

    prods: any = [
        {
          id: 1,
          name: "Click Metal 1",
          img: "http://dl3.joxi.net/drive/2017/10/11/0025/1628/1676892/92/3959ca73e3.png"
        },
        {
            id: 2,
            name: "Click Metal 2",
            img: "http://dl3.joxi.net/drive/2017/10/11/0025/1628/1676892/92/3959ca73e3.png"
        },
        {
            id: 3,
            name: "Click Metal 3",
            img: "http://dl3.joxi.net/drive/2017/10/11/0025/1628/1676892/92/3959ca73e3.png"
        },
        {
            id: 4,
            name: "Click Metal 4",
            img: "http://dl3.joxi.net/drive/2017/10/11/0025/1628/1676892/92/3959ca73e3.png"
        },
        {
            id: 5,
            name: "Click Metal 5",
            img: "http://dl3.joxi.net/drive/2017/10/11/0025/1628/1676892/92/3959ca73e3.png"
        },
        {
            id: 6,
            name: "Click Metal 6",
            img: "http://dl3.joxi.net/drive/2017/10/11/0025/1628/1676892/92/3959ca73e3.png"
        },
        {
            id: 7,
            name: "Click Metal 7",
            img: "http://dl3.joxi.net/drive/2017/10/11/0025/1628/1676892/92/3959ca73e3.png"
        },
        {
            id: 8,
            name: "Click Metal 8",
            img: "http://dl3.joxi.net/drive/2017/10/11/0025/1628/1676892/92/3959ca73e3.png"
        },
        {
            id: 9,
            name: "Click Metal 9",
            img: "http://dl3.joxi.net/drive/2017/10/11/0025/1628/1676892/92/3959ca73e3.png"
        }
    ]

}
