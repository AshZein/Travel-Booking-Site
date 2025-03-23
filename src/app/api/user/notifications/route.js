import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

export async function GET(request) {
    const userToken = verifyToken(request);
    if (!userToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.Notifications.findMany({
        where: { userId: userToken.id },
        select: { id: true, message: true, read: true, date: true },
        orderBy: { date: "desc" },
    });

    return NextResponse.json({ notifications });
}

export async function PATCH(request) {
    const userToken = verifyToken(request);
    if (!userToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // id is notification id
    const { id, read, cleared } = await request.json();

    if ( cleared ){
        await prisma.Notifications.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: "Notification cleared" });
    }

    if(read) {
        const notification = await prisma.Notifications.update({
            where: { id },
            data: { read: true },
            select: { message: true, read: true, date: true },
        });

        return NextResponse.json({ notification });
    }

    const notification = await prisma.Notifications.update({
        where: { id },
        data: { read: true },
        select: { message: true, read: true, date: true },
    });

    return NextResponse.json({ notification });
}