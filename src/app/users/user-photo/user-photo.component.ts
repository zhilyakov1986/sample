import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FileItem, FileLikeObject } from 'ng2-file-upload';

import { UserService } from '../user.service';
import { MtPhotoComponent } from '@mt-ng2/photo-control';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user-photo',
  templateUrl: './user-photo.component.html',
})
export class UserPhotoComponent implements OnInit {

  @Input() user: any;
  @Input() canEdit: any;

  @ViewChild('photoComponent') photoComponent: MtPhotoComponent;

  isEditing: boolean;
  canSave: boolean;
  errorMessage: string;
  imagePath: string;
  file: FileItem;

  constructor(
    private notificationsService: NotificationsService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.imagePath = environment.imgPath;
    this.isEditing = false;
    this.photoComponent.allowedMimeType = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/zip'];
    this.photoComponent.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);
    this.photoComponent.uploader.onAfterAddingFile = (item) => this.afterPhotoAdded(item);
  }

  edit(): void {
    if (this.canEdit) {
      this.isEditing = true;
    }
  }

  onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any): void {
    switch (filter.name) {
      case 'fileSize':
        this.errorMessage = `Maximum upload size exceeded (${item.size} of ${this.photoComponent.maxFileSize} allowed)`;
        break;
      case 'mimeType':
        const allowedTypes = this.photoComponent.allowedMimeType.join();
        this.errorMessage = `Type "${item.type} is not allowed. Allowed types: "${allowedTypes}"`;
        break;
      default:
        this.errorMessage = `Unknown error (filter is ${filter.name})`;
    }
    this.notificationsService.error(this.errorMessage);
  }

  afterPhotoAdded(file: FileItem): void {
    this.canSave = true;
    this.file = file;
  }

  savePhoto(): any {
    if (this.photoComponent.croppedFile) {
      const fileQueueLength = this.photoComponent.uploader.queue.length;
      this.photoComponent.croppedFile.name = this.photoComponent.uploader.queue[fileQueueLength - 1].file.name;
      this.userService.savePhoto(this.user.Id, this.photoComponent.croppedFile)
      .subscribe((answer) => {
        this.user.Image = answer.Image;
        this.user.Version = answer.Version;
        this.isEditing = false;
        this.notificationsService.success('User Photo Saved Successfully');
      });
    }
  }

  deletePhoto(): void {
    this.userService.deletePhoto(this.user.Id)
    .subscribe((answer) => {
      this.user.Image = null;
      this.isEditing = false;
      this.notificationsService.success('User Photo Deleted Successfully');
  });
  }
}
