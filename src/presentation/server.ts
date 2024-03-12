import { envs } from '../config/plugins/envs.plugin';
import { CheckService } from '../domain/use-cases/checks/check-service';
import { CheckServiceMultiple } from '../domain/use-cases/checks/check-service-multiple';
import { SendEmailLogs } from '../domain/use-cases/email/send-email-logs';
import { FileSystemDatasource } from '../infrastructure/datasources/file-system.datasource';
import { MongoLogDatasource } from '../infrastructure/datasources/mongo-log.datasource';
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.impl';
import { CronService } from './cron/cron-service';
import { EmailService } from './email/email.service';


const fileSystemLogRepository = new LogRepositoryImpl(
  new FileSystemDatasource(),
);

const mongoLogRepository = new LogRepositoryImpl(
  new MongoLogDatasource(),
  );
  
const emailService = new EmailService();

export class Server {

  public static async start() {

    console.log('Server started...');

    //todo: Mandar email
    // new SendEmailLogs(
    //   emailService, 
    //   fileSystemLogRepository,
    // ).execute(
    //   ['aespinozareyes9@gmail.com']
    // )
    // emailService.sendEmailWithFileSystemLogs(
    //   ['aespinozareyes9@gmail.com']
    // );

    // CronService.createJob(
    //   '*/5 * * * * *',
    //   () => {
    //     const url = 'https://google.com';
    //     new CheckService(
    //       fileSystemLogRepository,
    //       () => console.log( `${ url } is ok` ),
    //       ( error ) => console.log( error ),
    //     ).execute( url );
    //     // new CheckService().execute( 'http://localhost:3000' );
    //   }
    // );

    CronService.createJob(
      '*/5 * * * * *',
      () => {
        const url = 'https://google.com';

        new CheckServiceMultiple(
          [ fileSystemLogRepository, mongoLogRepository ],
          () => console.log( `${ url } is ok` ),
          ( error ) => console.log( error ),
        ).execute( url );
        
      }
    );

  }

}