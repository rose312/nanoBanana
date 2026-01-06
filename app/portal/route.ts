import { Portal } from "@creem_io/nextjs"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

const apiKey = process.env.CREEM_API_KEY

export const GET = apiKey
  ? Portal({
      apiKey,
      testMode: process.env.CREEM_TEST_MODE === "1",
    })
  : async () => NextResponse.json({ error: "Missing CREEM_API_KEY" }, { status: 500 })
