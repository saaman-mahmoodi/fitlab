import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepo.create({
      user_id: dto.user_id,
      type: dto.type,
      title: dto.title,
      body: dto.body,
      data: dto.data ?? {},
    });
    return this.notificationRepo.save(notification);
  }

  async findByUserId(userId: string, page = 1, limit = 20): Promise<[Notification[], number]> {
    return this.notificationRepo.findAndCount({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepo.count({
      where: { user_id: userId, read: false },
    });
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({
      where: { id, user_id: userId },
    });
    if (!notification) {
      return null!;
    }
    notification.read = true;
    notification.read_at = new Date();
    return this.notificationRepo.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ read: true, read_at: new Date() })
      .where('user_id = :userId', { userId })
      .andWhere('read = false')
      .execute();
  }

  async notifyWorkoutAssigned(userId: string, workoutTitle: string, workoutId: string) {
    return this.create({
      user_id: userId,
      type: NotificationType.WORKOUT_ASSIGNED,
      title: 'New Workout Assigned',
      body: `Your coach assigned: ${workoutTitle}`,
      data: { workoutId },
    });
  }

  async notifyMessageReceived(userId: string, senderName: string) {
    return this.create({
      user_id: userId,
      type: NotificationType.MESSAGE_RECEIVED,
      title: 'New Message',
      body: `${senderName} sent you a message`,
    });
  }

  async notifyWorkoutCompleted(coachUserId: string, clientName: string, workoutTitle: string) {
    return this.create({
      user_id: coachUserId,
      type: NotificationType.WORKOUT_COMPLETED,
      title: 'Workout Completed',
      body: `${clientName} completed: ${workoutTitle}`,
    });
  }

  async notifyPR(coachUserId: string, clientName: string, exerciseName: string, weight: number) {
    return this.create({
      user_id: coachUserId,
      type: NotificationType.PR_LOGGED,
      title: 'Personal Record!',
      body: `${clientName} hit a new PR on ${exerciseName}: ${weight} lbs`,
    });
  }

  async notifyMilestone(userId: string, milestone: string) {
    return this.create({
      user_id: userId,
      type: NotificationType.MILESTONE,
      title: 'Milestone Reached!',
      body: milestone,
    });
  }
}