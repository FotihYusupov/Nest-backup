import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import backupDatabase from 'src/common/utils/backup';

@Injectable()
export class BackupService {
  constructor() { }

  @Cron('* * * * *')
  handleCron() {
    console.log('Starting the backup process...');
    backupDatabase();
  }
}
