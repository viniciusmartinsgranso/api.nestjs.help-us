import { UserEntity } from '../../users/entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { OccurrenceEntity } from '../../occurrences/entities/occurrence.entity';
import * as firebase from 'firebase-admin';
import { ResidenceEntity } from '../../residences/entities/residence.entity';
import { Message } from 'firebase-admin/lib/messaging';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor() {
    firebase.initializeApp({
      credential: firebase.credential.cert('path/to/firebase-admin-sdk.json'),
    });
  }

  async notifyUser(
    user: UserEntity,
    occurrence: OccurrenceEntity,
    residence: ResidenceEntity,
  ): Promise<void> {
    if (!user.firebaseToken) {
      this.logger.warn(`User ${user.id} does not have a Firebase token.`);
      return;
    }

    const message: Message = {
      notification: {
        title: 'Nova Ocorrência Próxima',
        body: `Uma ocorrência do tipo "${occurrence.type}" foi registrada perto da sua residência: ${residence.name}.`,
      },
      data: {
        userId: user.id.toString(),
        residence: residence.name,
        occurrenceType: occurrence.type.toString(),
        occurrenceTitle: occurrence.title,
        occurrenceDescription: occurrence.description,
        occurrenceLatitude: occurrence.latitude.toString(),
        occurrenceLongitude: occurrence.longitude.toString(),
      },
      token: user.firebaseToken,
    };

    try {
      await firebase.messaging().send(message);
      this.logger.log(
        `Notificação enviada para o usuário ${user.id} relacionada à ocorrência ${occurrence.id} e residência ${residence.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Erro ao enviar notificação para o usuário ${user.id}: ${error.message}`,
      );
    }
  }
}
