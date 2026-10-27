import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 30_000));
    const data = {
  "currency": "INR",
  "items": [
    {
      "id": 3,
      "name": "Gus's Grilled Chicken",
      "quantity": 1,
      "price": 279,
      "subtotal": 279
    }
  ],
  "total": 279
}

return NextResponse.json(data)
}