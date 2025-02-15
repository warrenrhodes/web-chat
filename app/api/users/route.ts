import { NextRequest, NextResponse } from "next/server";
import { faker } from "@faker-js/faker";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, photoURL, authId } = await request.json();

    if (!name || !email || !authId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userData = await prisma.user.upsert({
      where: {
        authId: authId,
      },
      update: {},
      create: {
        authId: authId,
        email: email,
        name: name,
        photoURL: photoURL || faker.image.urlLoremFlickr(),
        createdAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: userData.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
