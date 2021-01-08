import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../data.service';

@Component({
  selector: 'app-demo-view',
  templateUrl: './demo-view.component.html',
  styleUrls: ['./demo-view.component.scss']
})
export class DemoViewComponent implements OnInit {

  constructor(
    public readonly data: DataService
  ) {}

  ngOnInit(): void {
  }

}
