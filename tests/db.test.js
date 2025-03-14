import { prisma } from "@/utils/db";
import { sendNotification, markNotificationAsRead } from "@/utils/notification";

jest.mock("@/utils/db", () => ({
    prisma: {
      notifications: {
        create: jest.fn(),
        update: jest.fn()
      }
    }
  }));

describe("notification", () => {
  it("should send notification", async () => {
    const spy = jest.spyOn(prisma.notifications, "create");
    await sendNotification(1, "message", "HOTEL_MANAGER");
    expect(spy).toHaveBeenCalled();
  });

  it("should mark notification as read", async () => {
    const spy = jest.spyOn(prisma.notifications, "update");
    await markNotificationAsRead(1);
    expect(spy).toHaveBeenCalled();
  });
});
