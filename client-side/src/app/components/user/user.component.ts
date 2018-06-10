import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  usernameFormControl = new FormControl('', [Validators.required]);
  previousUsername: string;
  constructor(public thisDialogRef: MatDialogRef<UserComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.previousUsername = data.username ? data.username : undefined;
   }

  ngOnInit() {
  }
  public onSave(): void {
    this.thisDialogRef.close({
      username: this.data.username,
      dialogType: this.data.dialogType,
      previousUsername: this.previousUsername
    });
  }
}

