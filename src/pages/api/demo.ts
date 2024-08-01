import { env } from "@/env";

import type { NextApiRequest, NextApiResponse } from "next";

import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { encryptFid } from "@/utils/token";

const neynarClient = new NeynarAPIClient(env.NEYNAR_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(neynarClient, "neynarClient");
  console.log(req.method, "req");
  if (req.method === "POST") {
    const data = req.body as {
      untrustedData: {
        fid: number;
        url: string;
        messageHash: string;
        timestamp: number;
        network: number;
        buttonIndex: number;
        state: string;
      };
      trustedData: {
        messageBytes: string;
      };
    };
    console.log(data, "data");
    const messageBytes = data.trustedData.messageBytes;
    const result = await neynarClient.validateFrameAction(messageBytes);
    const token = encryptFid(result.action.interactor.fid);

    // const messageBytes = data.trustedData.messageBytes;
    // const result = await neynarClient.validateFrameAction(messageBytes);
    // if (result.valid) {
    //   const timestamp = Math.floor(
    //     new Date(result.action.timestamp).getTime() / 1000
    //   );
    //   if (timestamp > new Date().getTime() / 1000 - 60) {
    //     const token = encryptFid(result.action.interactor.fid);
    // const stateObject = decodeURIComponent(data.untrustedData.state);
    // const t = JSON.parse(stateObject) as {
    //   cast: {
    //     text: string;
    //   };
    // };
    // const stateString = JSON.stringify(t.cast);
    // console.log(stateString);
    res.status(200).json({
      type: "form",
      title: "Cast AI Editor",
      url: `https://apps.recaster.org/notcoin?token=${token}`, // save to db? maybe too long?
    });
    //       return;
    //     }
    //   }
    //   res.status(401);
    // } else {
    //   res.status(200).json({
    //     type: "composer",
    //     name: "Cast AI Editor",
    //     icon: "pencil",
    //     description: "Use AI to help you create cast",
    //     aboutUrl: "https://composer-action.vercel.app/",
    //     imageUrl: "https://composer-action.vercel.app/bear.png",
    //     action: {
    //       type: "post",
    //     },
    //   });
  }
}
