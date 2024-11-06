declare interface TaskTypes {
  id: string;
  title: string;
  createdAt: Date;
  pined: boolean;
  tags: string[];
  notificationId?: string;
  notificationDate?: string | number | Date;
}
