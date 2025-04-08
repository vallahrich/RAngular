import { Component, Input } from '@angular/core';
import { User } from '../model/user';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  @Input() user?: User;

  mode = 0; // 0 = div view, 1 = table view
}

