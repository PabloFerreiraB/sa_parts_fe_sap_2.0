import { CommonModule } from '@angular/common';
import { OnInit, SimpleChange } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnChanges, OnInit {
  @Input() show!: boolean;
  @Input() message!: string;

  public hideControl = false;
  public loadingUrl!: string;

  constructor() { }

  ngOnInit(): void {
    this.loadingUrl = `${location.protocol}//${location.hostname}:${location.port}/assets/logo/loading.gif`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentItem: SimpleChange = changes['show'];
    if (!currentItem.currentValue) {
      setTimeout(() => this.hideControl = false, 1000);
    } else {
      this.hideControl = true;
    }
  }

}
