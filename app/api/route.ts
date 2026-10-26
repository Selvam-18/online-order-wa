import { NextRequest, NextResponse } from "next/server";

export async function GET() {
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