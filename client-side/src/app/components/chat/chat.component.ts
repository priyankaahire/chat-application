import { Component, OnInit, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem } from '@angular/material';
import { Action } from '../../model/action';
import { Event } from '../../model/event';
import { Message } from '../../model/message';
import { User } from '../../model/user';
import { SocketService } from '../../services/socket.service';
import { UserComponent } from '../user/user.component';
export enum DialogUserType {
  NEW,
  EDIT
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  action = Action;
  userList: boolean = false;
  user: User;
  messages: Message[] = [];
  messageContent: string;
  ioConnection: any;
  currenttime: any;
  dialogRef: MatDialogRef<UserComponent> | null;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Create User',
      dialogType: DialogUserType.NEW
    }
  };
  @ViewChild(MatList, { read: ElementRef }) matList: ElementRef;
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;
  constructor(private socketService: SocketService,
    public dialog: MatDialog) {
     // var dt = new Date();
     // this.currenttime = dt.toUTCString();
      this.currenttime =  Date.now();
     }
    ngOnInit(): void {
      this.initModel();
      this.openUserPopup(this.defaultDialogUserParams);
    }
    ngAfterViewInit(): void {
      this.matListItems.changes.subscribe(elements => {
        this.scrollToBottom();
      });
    }
    private scrollToBottom(): void {
      try {
        this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
      } catch (err) {
      }
    }
  private initModel(): void {
    const randomId = this.getRandomId();
    this.user = {
      id: randomId,
    };
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });


    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  private getRandomId(): number {
    return Math.floor(Math.random() * (1000000)) + 1;
  }

  public onClickUserInfo() {
    this.openUserPopup({
      data: {
        username: this.user.name,
        title: 'Edit Details',
        dialogType: DialogUserType.EDIT
      }
    });
  }

  private openUserPopup(params): void {
    this.dialogRef = this.dialog.open(UserComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }
      this.userList = true;
      this.user.name = paramsDialog.username;
      if (paramsDialog.dialogType === DialogUserType.NEW) {
        this.initIoConnection();
        this.sendNotification(paramsDialog, Action.JOINED);
      } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
        this.sendNotification(paramsDialog, Action.RENAME);
      }
    });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }
    this.socketService.send({
      from: this.user,
      content: message
    });
    this.messageContent = null;
  }

  public sendNotification(params: any, action: Action): void {
    let message: Message;

    if (action === Action.JOINED) {
      message = {
        from: this.user,
        action: action
      }
    } else if (action === Action.RENAME) {
      message = {
        action: action,
        content: {
          username: this.user.name,
          previousUsername: params.previousUsername,
        },
      };
    }

    this.socketService.send(message);
  }
}
