import { prisma } from "@/utils/db";

//userId: id number of user
// message: notification message to send
// type: type of notification. Either "HOTEL_MANAGER" or "USER 
export async function sendNotification(userID, message, type){
    if (type !== 'HOTEL_MANAGER' && type !== 'USER') {
        return {error: 'type must be either HOTEL_MANAGER or USER'};
    }

    await prisma.Notifications.create({
        data: {
            userId: userID,
            message: message,
            type: type
        }
    });
}

export async function markNotificationAsRead(notificationID){
    await prisma.Notifications.update({
        where: {
            id: notificationID
        },
        data: {
            read: true
        }
    });
}