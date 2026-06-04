class UserNotificationService {
  constructor() {
    this.io = null;
  }

  setSocketIO(io) {
    this.io = io;
    console.log('Socket.IO set for user notification service');
  }

  async sendNotification(userId, notification) {
    if (this.io) {
      this.io.to(`user_${userId}`).emit('notification', notification);
    }
  }
}

export default new UserNotificationService();
