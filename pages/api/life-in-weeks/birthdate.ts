import { NextApiRequest, NextApiResponse } from "next";
import { dynamoAdapter, isValidDate } from "../../../src/life-in-weeks/utils";
import { getSession } from "next-auth/react";
import { BadRequestError } from "../../../src/life-in-weeks/definitions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const session = await getSession({ req });

  try {
    const isValidReq =
      session &&
      req.method === "POST" &&
      typeof req.body.birthdate === "string" &&
      isValidDate(req.body.birthdate);

    if (!isValidReq) {
      throw new BadRequestError("Error request didn't pass validation!");
    }

    const userByEmail = session.user?.email
      ? await dynamoAdapter.getUserByEmail(session.user.email)
      : null;

    if (userByEmail) {
      await dynamoAdapter.updateUser({
        id: userByEmail.id,
        birthdate: req.body.birthdate,
      });
      res.status(200).json({ message: "Success" });
    } else {
      console.warn("User not found in database");
      throw new BadRequestError("Error bad request");
    }
  } catch (err) {
    if (err instanceof BadRequestError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      throw err;
    }
  }
}
